import { ComplianceResult } from '../../../shared/types';

export interface ReviewSummary {
  summaryText: string;
  improvements: string[];
}

export async function generateReviewSummary(
  compliance: ComplianceResult,
  documentTitle: string
): Promise<ReviewSummary> {
  void compliance;
  void documentTitle;
  return {
    summaryText:
      'PLACEHOLDER: Document mostly compliant; 2 high-severity issues found related to fire rating and crane load.',
    improvements: [
      'Increase specified fire-rating to at least 30 minutes for all compartment walls.',
      'Update lifting plan to ensure maximum crane load does not exceed 10 tonnes.',
    ],
  };
}
