import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { EmploymentType, JobAlertFrequency, RemoteType } from '../enums';
import { IJobAlertFilters } from '../interfaces';
import { ModelNames } from '../config/database.constants';

export type SavedSearchDocument = HydratedSavedSearch;

@Schema({
  timestamps: true,
  collection: 'saved_searches',
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class SavedSearch {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.CANDIDATE_PROFILE,
    required: true,
    index: true,
  })
  candidate!: Types.ObjectId;

  @Prop({ type: String, default: '', trim: true })
  keywords!: string;

  @Prop({ type: String, default: '', trim: true })
  location!: string;

  @Prop(
    raw({
      employmentTypes: [{ type: String, enum: Object.values(EmploymentType) }],
      remoteTypes: [{ type: String, enum: Object.values(RemoteType) }],
      salaryMin: { type: Number, default: null },
      skills: [{ type: String }],
    }),
  )
  filters!: IJobAlertFilters;

  @Prop({
    type: String,
    required: true,
    enum: JobAlertFrequency,
    default: JobAlertFrequency.DAILY,
  })
  frequency!: JobAlertFrequency;

  @Prop({
    type: Boolean,
    required: true,
    default: true,
    index: true,
  })
  isActive!: boolean;

  @Prop({ type: Date, default: null })
  lastNotifiedAt?: Date;

  createdAt!: Date;
  updatedAt!: Date;
}

export type HydratedSavedSearch = SavedSearch & Document;
export const SavedSearchSchema = SchemaFactory.createForClass(SavedSearch);

// Index alerts by candidate and active status
SavedSearchSchema.index({ candidate: 1, isActive: 1 });
SavedSearchSchema.index({ isActive: 1, frequency: 1, lastNotifiedAt: 1 });
