import {
  RuleSet,
  ComplianceResult,
  Rule,
  ComplianceIssue,
  RuleSeverity,
} from '../../../shared/types';

const severityOrder: RuleSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

function pickHighestSeverity(severities: RuleSeverity[]): RuleSeverity | null {
  if (!severities.length) {
    return null;
  }

  return severities.reduce((max, severity) =>
    severityOrder.indexOf(severity) > severityOrder.indexOf(max) ? severity : max
  );
}

function evaluateRule(documentText: string, rule: Rule): ComplianceIssue {
  const lcText = documentText.toLowerCase();
  const valueStr = String(rule.value).toLowerCase();

  let passed = false;
  const excerpts: ComplianceIssue['excerpts'] = [];

  switch (rule.operator) {
    case 'CONTAINS': {
      const idx = lcText.indexOf(valueStr);
      passed = idx !== -1;
      if (!passed && idx !== -1) {
        excerpts.push({
          text: documentText.slice(idx, idx + valueStr.length),
          startIndex: idx,
          endIndex: idx + valueStr.length,
        });
      }
      break;
    }
    case 'NOT_CONTAINS':
      passed = lcText.indexOf(valueStr) === -1;
      break;
    case 'EXISTS':
      passed = lcText.includes(rule.field.toLowerCase());
      break;
    case 'NOT_EXISTS':
      passed = !lcText.includes(rule.field.toLowerCase());
      break;
    case 'GREATER_THAN_OR_EQUAL':
    case 'LESS_THAN_OR_EQUAL':
    case 'EQUALS':
    case 'NOT_EQUALS':
      passed = true;
      break;
  }

  return {
    ruleId: rule.id,
    description: rule.description,
    severity: rule.severity,
    passed,
    excerpts,
  };
}

export function evaluateCompliance(
  documentText: string,
  ruleSet: RuleSet
): ComplianceResult {
  const evaluatedIssues: ComplianceIssue[] = ruleSet.rules.map((rule) =>
    evaluateRule(documentText, rule)
  );

  const failedIssues = evaluatedIssues.filter((issue) => !issue.passed);

  return {
    id: crypto.randomUUID(),
    documentId: '',
    siteId: ruleSet.siteId,
    ruleSetId: ruleSet.id,
    checkedAt: new Date().toISOString(),
    summary: {
      totalRules: ruleSet.rules.length,
      passed: evaluatedIssues.filter((issue) => issue.passed).length,
      failed: failedIssues.length,
      highestSeverity: pickHighestSeverity(failedIssues.map((issue) => issue.severity)),
    },
    issues: evaluatedIssues,
  };
}
