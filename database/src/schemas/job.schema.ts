import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { EmploymentType, JobStatus, RemoteType } from '../enums';
import { ILocation, ISalaryRange } from '../interfaces';
import { ModelNames } from '../config/database.constants';

export type JobDocument = HydratedJob;

@Schema({
  timestamps: true,
  collection: 'jobs',
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Job {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.COMPANY,
    required: true,
    index: true,
  })
  company!: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  title!: string;

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

  @Prop({ type: String, required: true, trim: true })
  description!: string;

  @Prop([{ type: String, trim: true }])
  requirements!: string[];

  @Prop([{ type: String, trim: true, index: true }])
  skills!: string[];

  @Prop(
    raw({
      min: {
        type: Number,
        required: true,
        min: [0, 'Salary minimum cannot be negative'],
      },
      max: {
        type: Number,
        required: true,
        validate: {
          validator: function (this: any, val: number) {
            const min = this?.salaryRange?.min ?? this?.min ?? 0;
            return val >= min;
          },
          message: 'Salary maximum must be greater than or equal to minimum',
        },
      },
      currency: { type: String, default: 'USD' },
      period: {
        type: String,
        enum: ['HOURLY', 'MONTHLY', 'YEARLY'],
        default: 'YEARLY',
      },
    }),
  )
  salaryRange!: ISalaryRange;

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

  @Prop({
    type: String,
    required: true,
    enum: EmploymentType,
    index: true,
  })
  employmentType!: EmploymentType;

  @Prop({
    type: String,
    required: true,
    enum: RemoteType,
    index: true,
  })
  remoteType!: RemoteType;

  @Prop({
    type: String,
    required: true,
    enum: JobStatus,
    default: JobStatus.DRAFT,
    index: true,
  })
  status!: JobStatus;

  @Prop({ type: Date, default: null })
  publishedAt?: Date;

  @Prop({ type: Date, default: null })
  expiresAt?: Date;

  createdAt!: Date;
  updatedAt!: Date;
}

export type HydratedJob = Job & Document;
export const JobSchema = SchemaFactory.createForClass(Job);

// Strategic Indexes based on common queries
JobSchema.index({ status: 1, publishedAt: -1 });
JobSchema.index({ company: 1, status: 1, createdAt: -1 });
JobSchema.index({ 'location.country': 1, 'location.city': 1 });
JobSchema.index({ remoteType: 1, employmentType: 1, status: 1 });
JobSchema.index({ skills: 1, status: 1 });
JobSchema.index({ 'salaryRange.min': 1, 'salaryRange.max': 1 });
