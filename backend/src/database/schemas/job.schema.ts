import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { JobStatus, JobType, WorkplaceType } from '../../common/constants/roles.enum';

export type JobDocument = Job & Document;

@Schema({ _id: false })
export class ScreeningQuestion {
  @Prop({ type: String, default: uuidv4 })
  id: string;

  @Prop({ required: true })
  question: string;

  @Prop({ default: 'TEXT', enum: ['TEXT', 'YES_NO', 'NUMBER', 'MULTIPLE_CHOICE'] })
  type: string;

  @Prop({ default: false })
  required: boolean;

  @Prop({ type: [String], default: [] })
  options?: string[];

  @Prop({ default: false })
  isKnockout: boolean;

  @Prop()
  idealAnswer?: string;
}

@Schema({ timestamps: true, collection: 'jobs' })
export class Job {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true, index: true })
  slug: string;

  @Prop({ trim: true })
  department?: string;

  @Prop({ trim: true })
  location?: string;

  @Prop({ required: true, enum: JobType, default: JobType.FULL_TIME })
  jobType: JobType;

  @Prop({ required: true, enum: WorkplaceType, default: WorkplaceType.ONSITE })
  workplaceType: WorkplaceType;

  @Prop({ type: Number })
  salaryMin?: number;

  @Prop({ type: Number })
  salaryMax?: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  requirements: string[];

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [String], default: [] })
  benefits: string[];

  @Prop({ default: 1 })
  openings: number;

  @Prop({ required: true, enum: JobStatus, default: JobStatus.DRAFT, index: true })
  status: JobStatus;

  @Prop({ type: [ScreeningQuestion], default: [] })
  screeningQuestions: ScreeningQuestion[];

  @Prop({ type: Object, default: {} })
  hiringTeam: {
    recruiterIds?: string[];
    hiringManagerIds?: string[];
    interviewerIds?: string[];
  };

  @Prop({ type: Date })
  publishedAt?: Date;

  @Prop({ type: Date })
  closesAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
JobSchema.index({ tenantId: 1, slug: 1 }, { unique: true });
JobSchema.index({ status: 1, publishedAt: -1 });
JobSchema.virtual('id').get(function () {
  return this._id;
});
