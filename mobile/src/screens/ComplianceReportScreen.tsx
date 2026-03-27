import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type Route = RouteProp<RootStackParamList, 'ComplianceReport'>;

interface ComplianceIssue {
  ruleId: string;
  description: string;
  severity: string;
  passed: boolean;
  excerpts: {
    text: string;
    startIndex: number;
    endIndex: number;
    page?: number;
  }[];
}

interface ComplianceResult {
  summary: {
    totalRules: number;
    passed: number;
    failed: number;
    highestSeverity: string | null;
  };
  issues: ComplianceIssue[];
}

interface ComplianceReportApiResponse {
  complianceResult: ComplianceResult;
  reviewSummary: string;
  improvements: string[];
  emailSentTo: string[];
}

export function ComplianceReportScreen(): JSX.Element {
  const route = useRoute<Route>();
  const { docId } = route.params;

  const [result, setResult] = useState<ComplianceReportApiResponse | null>(null);

  useEffect(() => {
    const loadReport = async (): Promise<void> => {
      try {
        const resp = await fetch(`https://your-api.com/api/sites/site-123/compliance/${docId}`);
        const json = (await resp.json()) as ComplianceReportApiResponse;
        setResult(json);
      } catch (error) {
        console.error(error);
      }
    };

    void loadReport();
  }, [docId]);

  if (!result) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading compliance report…</Text>
      </View>
    );
  }

  const { summary, issues } = result.complianceResult;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>Compliance report</Text>
      <Text>
        Total rules: {summary.totalRules} | Passed: {summary.passed} | Failed: {summary.failed}
      </Text>
      <Text>Highest severity: {summary.highestSeverity ?? 'None'}</Text>

      <Text style={{ marginTop: 8 }}>Summary for email:</Text>
      <Text>{result.reviewSummary}</Text>

      <Text style={{ marginTop: 8 }}>Notification sent to: {result.emailSentTo.join(', ')}</Text>

      {issues.map((issue) => (
        <View
          key={issue.ruleId}
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 8,
            backgroundColor: issue.passed ? '#e6ffed' : '#ffe6e6',
          }}
        >
          <Text style={{ fontWeight: '600' }}>
            {issue.passed ? 'PASS' : 'FAIL'} - {issue.description}
          </Text>
          <Text>Severity: {issue.severity}</Text>

          {issue.excerpts.length > 0 ? (
            <TouchableOpacity style={{ marginTop: 8 }}>
              <Text style={{ textDecorationLine: 'underline' }}>View related excerpts</Text>
            </TouchableOpacity>
          ) : null}

          {issue.excerpts.map((excerpt, index) => (
            <View key={index} style={{ marginTop: 4 }}>
              <Text style={{ fontStyle: 'italic' }}>&quot;{excerpt.text}&quot;</Text>
              {excerpt.page !== undefined ? <Text>Page: {excerpt.page}</Text> : null}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
