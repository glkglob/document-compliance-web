import { evaluateCompliance } from './evaluateCompliance';
import { RuleSet, RuleSeverity } from '../../../shared/types';

describe('evaluateCompliance', () => {
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

  it('evaluates basic contains/not_contains rules', () => {
    const docText = 'This wall has fire rating of 30 min and no asbestos detected.';
    const result = evaluateCompliance(docText, ruleSet);

    expect(result.summary.totalRules).toBe(2);
    expect(result.summary.passed).toBe(1);
    expect(result.summary.failed).toBe(1);
    expect(result.summary.highestSeverity as RuleSeverity).toBe('CRITICAL');
  });
});
