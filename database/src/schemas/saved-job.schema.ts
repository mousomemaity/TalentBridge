import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { ModelNames } from '../config/database.constants';

export type SavedJobDocument = HydratedSavedJob;

@Schema({
  timestamps: true,
  collection: 'saved_jobs',
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class SavedJob {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.CANDIDATE_PROFILE,
    required: true,
    index: true,
  })
  candidate!: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.JOB,
    required: true,
    index: true,
  })
  job!: Types.ObjectId;

  createdAt!: Date;
  updatedAt!: Date;
}

export type HydratedSavedJob = SavedJob & Document;
export const SavedJobSchema = SchemaFactory.createForClass(SavedJob);

// Unique candidate-job pair to prevent duplicate saves
SavedJobSchema.index({ candidate: 1, job: 1 }, { unique: true });
SavedJobSchema.index({ candidate: 1, createdAt: -1 });
