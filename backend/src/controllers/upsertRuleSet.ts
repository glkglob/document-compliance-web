import { Request, Response } from 'express';
import { RuleSet } from '../../../shared/types';

export async function upsertRuleSet(req: Request, res: Response): Promise<Response> {
  const { siteId } = req.params;
  const body = req.body as Partial<RuleSet>;

  try {
    const ruleSet: RuleSet = {
      id: body.id ?? `rules-${Date.now()}`,
      siteId,
      name: body.name ?? 'Default Rule Set',
      version: (body.version ?? 0) + 1,
      createdAt: new Date().toISOString(),
      createdByUserId: 'admin-placeholder',
      rules: body.rules ?? [],
    };

    return res.status(201).json(ruleSet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to upsert rule set' });
  }
}
