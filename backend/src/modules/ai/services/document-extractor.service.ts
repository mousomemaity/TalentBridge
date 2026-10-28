import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';

export interface ExtractedDocument {
  text: string;
  pageCount?: number;
  format: 'pdf' | 'docx' | 'text';
  sizeBytes: number;
  isScannedOrEmpty: boolean;
}

@Injectable()
export class DocumentExtractorService {
  private readonly logger = new Logger(DocumentExtractorService.name);
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

  validateFile(mimeType: string, sizeBytes: number): void {
    if (sizeBytes > this.MAX_FILE_SIZE) {
      throw new BadRequestException(`File size exceeds maximum allowed limit of 10MB (Received: ${(sizeBytes / 1024 / 1024).toFixed(2)}MB)`);
    }

    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];

    if (!allowedMimeTypes.includes(mimeType.toLowerCase())) {
      throw new BadRequestException(`Unsupported file format '${mimeType}'. Supported formats are PDF, DOCX, and TXT.`);
    }
  }

  async extractText(buffer: Buffer, mimeType: string): Promise<ExtractedDocument> {
    const sizeBytes = buffer.length;
    this.validateFile(mimeType, sizeBytes);

    let extractedText = '';
    let pageCount: number | undefined;
    let format: 'pdf' | 'docx' | 'text' = 'text';

    try {
      if (mimeType.toLowerCase().includes('pdf')) {
        format = 'pdf';
        // Note: pdfParse default export compatibility check
        const parseFn = typeof pdfParse === 'function' ? pdfParse : (pdfParse as any).default || pdfParse;
        const pdfData = await parseFn(buffer);
        extractedText = pdfData.text || '';
        pageCount = pdfData.numpages;
      } else if (
        mimeType.toLowerCase().includes('wordprocessingml') ||
        mimeType.toLowerCase().includes('docx')
      ) {
        format = 'docx';
        const docxResult = await mammoth.extractRawText({ buffer });
        extractedText = docxResult.value || '';
      } else {
        format = 'text';
        extractedText = buffer.toString('utf-8');
      }
    } catch (err: any) {
      this.logger.error(`Error extracting text from ${mimeType}: ${err.message}`);
      throw new BadRequestException(`Failed to extract text from document: ${err.message}`);
    }

    const cleanText = this.sanitizeText(extractedText);
    const isScannedOrEmpty = cleanText.trim().length < 50;

    return {
      text: cleanText,
      pageCount,
      format,
      sizeBytes,
      isScannedOrEmpty,
    };
  }

  sanitizeText(text: string): string {
    return text
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // remove control chars
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}
