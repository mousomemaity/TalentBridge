import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ResumeDocument = Resume & Document;

@Schema({ timestamps: true, collection: 'resumes' })
export class Resume {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  fileId: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ default: 'application/pdf' })
  mimeType: string;

  @Prop({ default: 0 })
  sizeBytes: number;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ default: 'PENDING', enum: ['PENDING', 'PARSING', 'PARSED', 'FAILED'] })
  parseStatus: string;

  @Prop({ type: Object })
  parsedJson?: {
    headline?: string;
    summary?: string;
    skills?: string[];
    yearsExperience?: number;
    experiences?: any[];
    educations?: any[];
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
ResumeSchema.virtual('id').get(function () {
  return this._id;
});
