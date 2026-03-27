import nodemailer from 'nodemailer';
import { ReviewSummary } from './aiAgent';
import { ComplianceResult } from '../../../shared/types';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendReviewEmailOptions {
  to: string[];
  documentTitle: string;
  compliance: ComplianceResult;
  review: ReviewSummary;
}

export async function sendReviewEmail({
  to,
  documentTitle,
  compliance,
  review,
}: SendReviewEmailOptions): Promise<void> {
  const status = compliance.summary.failed === 0 ? 'PASSED' : 'FAILED';

  const htmlImprovements =
    review.improvements.length > 0
      ? `<ul>${review.improvements.map((item) => `<li>${item}</li>`).join('')}</ul>`
      : '<p>No improvements required. All rules passed.</p>';

  const html = `
    <h2>Document review: ${documentTitle}</h2>
    <p><strong>Status:</strong> ${status}</p>
    <p><strong>Summary:</strong></p>
    <p>${review.summaryText}</p>
    <p><strong>Compliance stats:</strong></p>
    <ul>
      <li>Total rules: ${compliance.summary.totalRules}</li>
      <li>Passed: ${compliance.summary.passed}</li>
      <li>Failed: ${compliance.summary.failed}</li>
      <li>Highest severity: ${compliance.summary.highestSeverity ?? 'None'}</li>
    </ul>
    <p><strong>Points to improve (for failed rules):</strong></p>
    ${htmlImprovements}
  `;

  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? 'noreply@yourapp.com',
    to: to.join(','),
    subject: `Document review: ${documentTitle} - ${status}`,
    html,
  });
}
