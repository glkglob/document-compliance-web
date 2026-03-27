import { Request, Response } from 'express';

export async function listDocuments(req: Request, res: Response): Promise<Response> {
  const { siteId } = req.params;

  try {
    const documents = [
      {
        id: 'doc-1',
        siteId,
        filename: 'example.pdf',
        status: 'COMPLIANT',
        uploadedAt: new Date().toISOString(),
      },
    ];

    return res.json(documents);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to list documents' });
  }
}
