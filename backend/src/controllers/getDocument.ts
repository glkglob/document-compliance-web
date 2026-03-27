import { Request, Response } from 'express';

export async function getDocument(req: Request, res: Response): Promise<Response> {
  const { siteId, docId } = req.params;

  try {
    const document = {
      id: docId,
      siteId,
      filename: 'example.pdf',
      storagePath: `sites/${siteId}/example.pdf`,
      ocrText: 'PLACEHOLDER_OCR_TEXT',
    };

    return res.json(document);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch document' });
  }
}
