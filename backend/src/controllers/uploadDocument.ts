import { Request, Response } from 'express';

export async function uploadDocument(req: Request, res: Response): Promise<Response> {
  const { siteId } = req.params;
  const file = (req.files as { file?: { name: string } } | undefined)?.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const storagePath = `sites/${siteId}/${Date.now()}_${file.name}`;
    const documentId = `doc-${Date.now()}`;
    const ocrText = 'PLACEHOLDER_OCR_TEXT';

    return res.status(201).json({
      id: documentId,
      siteId,
      storagePath,
      filename: file.name,
      ocrText,
      status: 'READY',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
