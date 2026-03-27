import { Request, Response } from 'express';
import { evaluateCompliance } from '../compliance/evaluateCompliance';
import { RuleSet } from '../../../shared/types';
import { generateReviewSummary } from '../services/aiAgent';
import { sendReviewEmail } from '../services/emailService';

export async function checkCompliance(req: Request, res: Response): Promise<Response> {
  const { siteId, docId } = req.params;

  try {
    const document = {
      id: docId,
      siteId,
      title: 'Method Statement - Crane Lift A',
      ocrText: 'PLACEHOLDER_OCR_TEXT',
      recipients: ['sitemanager@example.com', 'engineer@example.com', 'hse.inspector@example.com'],
    };

    if (!document.ocrText) {
      return res.status(400).json({ error: 'Document has no OCR text yet' });
    }

    const ruleSet: RuleSet = {
      id: 'rules-1',
      siteId,
      name: 'Active Rule Set',
      version: 1,
      createdAt: new Date().toISOString(),
      createdByUserId: 'admin-1',
      rules: [],
    };

    const complianceResult = evaluateCompliance(document.ocrText, ruleSet);
    complianceResult.documentId = document.id;

    const review = await generateReviewSummary(complianceResult, document.title);

    await sendReviewEmail({
      to: document.recipients,
      documentTitle: document.title,
      compliance: complianceResult,
      review,
    });

    return res.json({
      complianceResult,
      reviewSummary: review.summaryText,
      improvements: review.improvements,
      emailSentTo: document.recipients,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to run compliance check' });
  }
}
