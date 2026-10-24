import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { ResumeParseStatus } from '../enums';
import { IResumeParsedResult } from '../interfaces';
import { ModelNames } from '../config/database.constants';

export type ResumeDocument = HydratedResume;

@Schema({
  timestamps: true,
  collection: 'resumes',
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.storageKey;
      delete ret.__v;
      return ret;
    },
  },
})
export class Resume {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.CANDIDATE_PROFILE,
    required: true,
    index: true,
  })
  candidate!: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  fileName!: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  storageKey!: string;

  @Prop({ type: String, required: true })
  mimeType!: string;

  @Prop({ type: Number, required: true, min: 0 })
  fileSize!: number;

  @Prop({ type: Boolean, default: false })
  isDefault!: boolean;

  @Prop({
    type: String,
    required: true,
    enum: ResumeParseStatus,
    default: ResumeParseStatus.PENDING,
    index: true,
  })
  parseStatus!: ResumeParseStatus;

  @Prop(
    raw({
      extractedSkills: [{ type: String }],
      workExperience: [
        {
          title: { type: String },
          company: { type: String },
          duration: { type: String },
          description: { type: String },
        },
      ],
      education: [
        {
          institution: { type: String },
          degree: { type: String },
          graduationYear: { type: Number },
        },
      ],
      summary: { type: String },
      rawText: { type: String, select: false },
    }),
  )
  parsedResult?: IResumeParsedResult;

  @Prop({ type: String, default: 'v1.0.0' })
  parserVersion!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export type HydratedResume = Resume & Document;
export const ResumeSchema = SchemaFactory.createForClass(Resume);

ResumeSchema.index({ candidate: 1, isDefault: 1 });
ResumeSchema.index({ candidate: 1, createdAt: -1 });
