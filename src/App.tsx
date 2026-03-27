// src/App.tsx
import { useState } from 'react';

type RuleOperator =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'CONTAINS'
  | 'NOT_CONTAINS'
  | 'GREATER_THAN_OR_EQUAL'
  | 'LESS_THAN_OR_EQUAL'
  | 'EXISTS'
  | 'NOT_EXISTS';

type RuleSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface Rule {
  id: string;
  siteId: string;
  version: number;
  field: string;
  operator: RuleOperator;
  value: string | number | boolean;
  description: string;
  severity: RuleSeverity;
  enabled: boolean;
}

interface RuleSet {
  id: string;
  siteId: string;
  name: string;
  version: number;
  rules: Rule[];
  createdAt: string;
  createdByUserId: string;
}

interface ComplianceIssue {
  ruleId: string;
  description: string;
  severity: RuleSeverity;
  passed: boolean;
  excerpts: {
    text: string;
    startIndex: number;
    endIndex: number;
    page?: number;
  }[];
}

interface ComplianceResult {
  id: string;
  documentId: string;
  siteId: string;
  ruleSetId: string;
  checkedAt: string;
  summary: {
    totalRules: number;
    passed: number;
    failed: number;
    highestSeverity: RuleSeverity | null;
  };
  issues: ComplianceIssue[];
}

const API_URL = import.meta.env.VITE_API_URL as string;

function App() {
  const [docText, setDocText] = useState(
    'This wall has fire rating of 30 min and no asbestos detected.'
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const ruleSet: RuleSet = {
        id: 'rules-1',
        siteId: 'site-1',
        name: 'Test Rule Set',
        version: 1,
        createdAt: new Date().toISOString(),
        createdByUserId: 'admin-1',
        rules: [
          {
            id: 'r1',
            siteId: 'site-1',
            version: 1,
            field: 'fire_rating_minutes',
            operator: 'CONTAINS',
            value: '30 min',
            description: 'Fire rating must mention 30 min',
            severity: 'HIGH',
            enabled: true,
          },
          {
            id: 'r2',
            siteId: 'site-1',
            version: 1,
            field: 'asbestos_present',
            operator: 'NOT_CONTAINS',
            value: 'asbestos',
            description: 'Document must not mention asbestos',
            severity: 'CRITICAL',
            enabled: true,
          },
        ],
      };

      const res = await fetch(`${API_URL}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentText: docText,
          rules: ruleSet,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = (await res.json()) as ComplianceResult;
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'system-ui' }}>
      <h1>Document Compliance Demo</h1>
      <p>Backend: {API_URL}</p>

      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
        Document text
      </label>
      <textarea
        style={{ width: '100%', minHeight: 160 }}
        value={docText}
        onChange={(e) => setDocText(e.target.value)}
      />

      <button
        onClick={handleEvaluate}
        disabled={loading}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
      >
        {loading ? 'Checking…' : 'Evaluate compliance'}
      </button>

      {error && (
        <div style={{ marginTop: '1rem', color: 'red' }}>
          Error: {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Result</h2>
          <p>
            Rules: {result.summary.passed} passed / {result.summary.failed} failed{' '}
            (total {result.summary.totalRules})
          </p>
          <p>
            Highest severity: {result.summary.highestSeverity ?? 'None'}
          </p>

          <h3>Issues</h3>
          {result.issues.length === 0 && <p>No issues.</p>}
          {result.issues.map((issue) => (
            <div
              key={issue.ruleId}
              style={{
                border: '1px solid #ddd',
                padding: '0.5rem',
                marginBottom: '0.5rem',
              }}
            >
              <strong>{issue.severity}</strong> – {issue.description}{' '}
              ({issue.passed ? 'PASSED' : 'FAILED'})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
  
















  




         
           
