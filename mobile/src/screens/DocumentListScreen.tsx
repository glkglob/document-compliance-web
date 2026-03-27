import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'DocumentList'>;

interface DocumentListItem {
  id: string;
  filename: string;
  status: string;
  uploadedAt: string;
}

export function DocumentListScreen(): JSX.Element {
  const navigation = useNavigation<Nav>();
  const [docs, setDocs] = useState<DocumentListItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDocs = async (): Promise<void> => {
    setRefreshing(true);
    try {
      const resp = await fetch('https://your-api.com/api/sites/site-123/documents');
      const json = (await resp.json()) as DocumentListItem[];
      setDocs(json);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadDocs();
  }, []);

  const renderItem = ({ item }: { item: DocumentListItem }): JSX.Element => (
    <TouchableOpacity
      style={{
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
      }}
      onPress={() =>
        navigation.navigate('ComplianceReport', {
          docId: item.id,
        })
      }
    >
      <Text style={{ fontWeight: '600' }}>{item.filename}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Uploaded: {new Date(item.uploadedAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 16 }}>Documents</Text>
      <FlatList
        data={docs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadDocs} />}
      />
    </View>
  );
}
