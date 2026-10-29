import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ICompanySettings } from '../interfaces';

export type CompanyDocument = HydratedCompany;

@Schema({
  timestamps: true,
  collection: 'companies',
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Company {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe (lowercase alphanumeric with hyphens)'],
  })
  slug!: string;

  @Prop({
    type: String,
    default: '',
    trim: true,
  })
  description!: string;

  @Prop({
    type: String,
    default: null,
  })
  logo?: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    index: true,
  })
  industry!: string;

  @Prop(
    raw({
      website: { type: String, default: null },
      size: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
        default: '11-50',
      },
      linkedinUrl: { type: String, default: null },
      twitterUrl: { type: String, default: null },
      careersPageUrl: { type: String, default: null },
      autoRejectBelowMatchScore: { type: Number, default: 0, min: 0, max: 100 },
    }),
  )
  settings!: ICompanySettings;

  createdAt!: Date;
  updatedAt!: Date;
}

export type HydratedCompany = Company & Document;
export const CompanySchema = SchemaFactory.createForClass(Company);

CompanySchema.index({ industry: 1, createdAt: -1 });
