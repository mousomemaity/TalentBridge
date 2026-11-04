import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { EmploymentType, RemoteType } from '../enums';
import {
  ICertification,
  IContactInfo,
  IEducation,
  IJobPreferences,
  ILanguage,
  ILocation,
  IProject,
  ISkillItem,
  IWorkExperience,
} from '../interfaces';
import { ModelNames } from '../config/database.constants';

export type CandidateProfileDocument = HydratedCandidateProfile;

@Schema({
  timestamps: true,
  collection: 'candidate_profiles',
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class CandidateProfile {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.USER,
    required: true,
    unique: true,
    index: true,
  })
  user!: Types.ObjectId;

  @Prop({ type: String, default: null })
  photo?: string;

  @Prop({ type: String, default: '', trim: true })
  headline!: string;

  @Prop({ type: String, default: '', trim: true })
  summary!: string;

  @Prop(
    raw({
      phone: { type: String, default: null },
      alternateEmail: { type: String, default: null },
      linkedin: { type: String, default: null },
      github: { type: String, default: null },
      portfolioWebsite: { type: String, default: null },
    }),
  )
  contactInfo!: IContactInfo;

  @Prop(
    raw({
      city: { type: String, default: '' },
      state: { type: String, default: null },
      country: { type: String, default: '' },
      postalCode: { type: String, default: null },
      isRemote: { type: Boolean, default: false },
    }),
  )
  location!: ILocation;

  @Prop([
    raw({
      title: { type: String, required: true },
      companyName: { type: String, required: true },
      location: { type: String, default: null },
      startDate: { type: Date, required: true },
      endDate: { type: Date, default: null },
      isCurrent: { type: Boolean, default: false },
      description: { type: String, default: '' },
    }),
  ])
  experience!: IWorkExperience[];

  @Prop([
    raw({
      institution: { type: String, required: true },
      degree: { type: String, required: true },
      fieldOfStudy: { type: String, default: null },
      startDate: { type: Date, required: true },
      endDate: { type: Date, default: null },
      grade: { type: String, default: null },
    }),
  ])
  education!: IEducation[];

  @Prop([
    raw({
      name: { type: String, required: true, trim: true },
      yearsOfExperience: { type: Number, default: 0 },
      proficiency: {
        type: String,
        enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
        default: 'INTERMEDIATE',
      },
    }),
  ])
  skills!: ISkillItem[];

  @Prop([
    raw({
      title: { type: String, required: true },
      description: { type: String, default: '' },
      url: { type: String, default: null },
      technologies: [{ type: String }],
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
    }),
  ])
  projects!: IProject[];

  @Prop([
    raw({
      name: { type: String, required: true },
      issuingOrganization: { type: String, required: true },
      issueDate: { type: Date, required: true },
      expirationDate: { type: Date, default: null },
      credentialId: { type: String, default: null },
      credentialUrl: { type: String, default: null },
    }),
  ])
  certifications!: ICertification[];

  @Prop([
    raw({
      language: { type: String, required: true },
      proficiency: {
        type: String,
        enum: ['BASIC', 'CONVERSATIONAL', 'PROFICIENT', 'FLUENT', 'NATIVE'],
        default: 'CONVERSATIONAL',
      },
    }),
  ])
  languages!: ILanguage[];

  @Prop(
    raw({
      desiredTitles: [{ type: String }],
      employmentTypes: [{ type: String, enum: Object.values(EmploymentType) }],
      remotePreferences: [{ type: String, enum: Object.values(RemoteType) }],
      preferredLocations: [{ type: String }],
      minSalary: { type: Number, default: null },
      maxSalary: { type: Number, default: null },
      currency: { type: String, default: 'USD' },
    }),
  )
  jobPreferences!: IJobPreferences;

  createdAt!: Date;
  updatedAt!: Date;
}

export type HydratedCandidateProfile = CandidateProfile & Document;
export const CandidateProfileSchema = SchemaFactory.createForClass(CandidateProfile);

CandidateProfileSchema.index({ 'skills.name': 1 });
CandidateProfileSchema.index({ 'location.country': 1, 'location.city': 1 });
