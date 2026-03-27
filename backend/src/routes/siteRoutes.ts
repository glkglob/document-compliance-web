import { Router } from 'express';
import { uploadDocument } from '../controllers/uploadDocument';
import { listDocuments } from '../controllers/listDocuments';
import { getDocument } from '../controllers/getDocument';
import { upsertRuleSet } from '../controllers/upsertRuleSet';
import { checkCompliance } from '../controllers/checkCompliance';

export const siteRoutes = Router();

siteRoutes.post('/:siteId/documents', uploadDocument);
siteRoutes.get('/:siteId/documents', listDocuments);
siteRoutes.get('/:siteId/documents/:docId', getDocument);
siteRoutes.post('/:siteId/rules', upsertRuleSet);
siteRoutes.get('/:siteId/compliance/:docId', checkCompliance);
