import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type CandidateProfileDocument = CandidateProfile & Document;

@Schema({ _id: false })
export class CandidateSkill {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 'INTERMEDIATE' })
  level: string; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

  @Prop({ default: 1 })
  yearsExperience: number;
}

@Schema({ _id: false })
export class CandidateExperience {
  @Prop({ type: String, default: uuidv4 })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  company: string;

  @Prop()
  location?: string;

  @Prop({ required: true })
  startDate: string;

  @Prop()
  endDate?: string;

  @Prop({ default: false })
  current: boolean;

  @Prop()
  description?: string;
}

@Schema({ _id: false })
export class CandidateEducation {
  @Prop({ type: String, default: uuidv4 })
  id: string;

  @Prop({ required: true })
  institution: string;

  @Prop({ required: true })
  degree: string;

  @Prop()
  fieldOfStudy?: string;

  @Prop({ required: true })
  startDate: string;

  @Prop()
  endDate?: string;

  @Prop()
  grade?: string;
}

@Schema({ timestamps: true, collection: 'candidate_profiles' })
export class CandidateProfile {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, unique: true, index: true })
  userId: string;

  @Prop({ trim: true })
  headline?: string;

  @Prop({ trim: true })
  summary?: string;

  @Prop({ trim: true })
  location?: string;

  @Prop({ default: 0 })
  yearsExperience: number;

  @Prop({ type: [CandidateSkill], default: [] })
  skills: CandidateSkill[];

  @Prop({ type: [CandidateExperience], default: [] })
  experiences: CandidateExperience[];

  @Prop({ type: [CandidateEducation], default: [] })
  educations: CandidateEducation[];

  @Prop({ type: Object, default: {} })
  preferences: {
    roles?: string[];
    locations?: string[];
    salaryMin?: number;
    remoteOnly?: boolean;
    noticePeriodDays?: number;
  };

  @Prop({ default: 'PUBLIC', enum: ['PUBLIC', 'RECRUITERS_ONLY', 'HIDDEN'] })
  visibility: string;

  @Prop({ default: true })
  openToWork: boolean;

  @Prop({ type: [String], default: [] })
  blockedCompanyIds: string[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const CandidateProfileSchema = SchemaFactory.createForClass(CandidateProfile);
CandidateProfileSchema.virtual('id').get(function () {
  return this._id;
});
