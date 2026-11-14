import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type SavedJobDocument = SavedJob & Document;

@Schema({ timestamps: true, collection: 'saved_jobs' })
export class SavedJob {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  jobId: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const SavedJobSchema = SchemaFactory.createForClass(SavedJob);
// Compound unique index enforces candidate/job uniqueness
SavedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });
SavedJobSchema.virtual('id').get(function () {
  return this._id;
});
