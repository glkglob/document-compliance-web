export type UserRole = 'SITE_MANAGER' | 'ENGINEER' | 'INSPECTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  siteIds: string[];
}

export interface Site {
  id: string;
  name: string;
  location?: string;
  activeRuleSetId?: string;
}

export type DocumentStatus = 'PENDING_OCR' | 'READY' | 'COMPLIANT' | 'NON_COMPLIANT';

export interface Document {
  id: string;
  siteId: string;
  filename: string;
  mimeType: string;
  storagePath: string;
  uploadedByUserId: string;
  uploadedAt: string;
  ocrText?: string;
  status: DocumentStatus;
  lastComplianceCheckAt?: string;
  lastComplianceResultId?: string;
}

export type RuleOperator =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'CONTAINS'
  | 'NOT_CONTAINS'
  | 'GREATER_THAN_OR_EQUAL'
  | 'LESS_THAN_OR_EQUAL'
  | 'EXISTS'
  | 'NOT_EXISTS';

export type RuleSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Rule {
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

export interface RuleSet {
  id: string;
  siteId: string;
  name: string;
  version: number;
  rules: Rule[];
  createdAt: string;
  createdByUserId: string;
}

export interface ComplianceIssue {
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

export interface ComplianceResult {
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

export interface EvaluateComplianceInput {
  documentText: string;
  rules: RuleSet;
}

export type EvaluateComplianceFn = (
  documentText: string,
  rules: RuleSet
) => ComplianceResult;
