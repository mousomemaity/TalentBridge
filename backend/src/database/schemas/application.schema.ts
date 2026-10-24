import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationStatus } from '../../common/constants/roles.enum';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true, collection: 'applications' })
export class Application {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true, index: true })
  jobId: string;

  @Prop({ required: true, index: true })
  candidateId: string; // The candidate userId

  @Prop({ type: String, index: true })
  tenantCandidateId?: string;

  @Prop({ type: String })
  resumeId?: string;

  @Prop({ required: true, index: true })
  stageId: string;

  @Prop({ required: true, enum: ApplicationStatus, default: ApplicationStatus.ACTIVE, index: true })
  status: ApplicationStatus;

  @Prop({ default: 1 })
  version: number; // Optimistic locking version

  @Prop({ default: 'DIRECT' })
  source: string;

  @Prop()
  coverLetter?: string;

  @Prop({ type: Object, default: {} })
  screeningAnswers?: Record<string, any>;

  @Prop({ type: Number, min: 0, max: 5 })
  rating?: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Number, min: 0, max: 100 })
  matchScore?: number;

  @Prop({ type: Object })
  matchBreakdown?: {
    skillsScore?: number;
    experienceScore?: number;
    locationScore?: number;
    summary?: string;
    missingSkills?: string[];
    matchedSkills?: string[];
  };

  @Prop({ type: String })
  rejectionReason?: string;

  @Prop({ type: Date, default: Date.now })
  appliedAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

// Database-backed uniqueness strategy: one application per candidate per job
ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
ApplicationSchema.index({ tenantId: 1, jobId: 1, stageId: 1 });
ApplicationSchema.index({ candidateId: 1, status: 1 });
ApplicationSchema.virtual('id').get(function () {
  return this._id;
});
