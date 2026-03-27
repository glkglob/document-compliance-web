import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'UploadDocument'>;

export function UploadDocumentScreen(): JSX.Element {
  const navigation = useNavigation<Nav>();
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePick = async (): Promise<void> => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*', 'application/vnd.*', 'application/msword'],
      multiple: false,
    });

    if (!res.canceled && res.assets.length > 0) {
      setFile(res.assets[0]);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!file) {
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name ?? 'document',
      type: file.mimeType ?? 'application/octet-stream',
    } as unknown as Blob);

    try {
      await fetch('https://your-api.com/api/sites/site-123/documents', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigation.navigate('DocumentList');
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 16 }}>Upload project document</Text>

      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderStyle: 'dashed',
          borderRadius: 8,
          padding: 24,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
        onPress={handlePick}
      >
        <Text>{file ? file.name : 'Tap to select a file (PDF, image, Office)'}</Text>
      </TouchableOpacity>

      {uploading ? <ActivityIndicator /> : <Button title="Upload & Run OCR" onPress={handleUpload} disabled={!file} />}
    </View>
  );
}
