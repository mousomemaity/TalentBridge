import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type SavedSearchDocument = SavedSearch & Document;

@Schema({ timestamps: true, collection: 'saved_searches' })
export class SavedSearch {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  query?: string;

  @Prop({ type: Object, default: {} })
  filters: Record<string, any>;

  @Prop({ default: 'DAILY', enum: ['DAILY', 'WEEKLY'] })
  frequency: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const SavedSearchSchema = SchemaFactory.createForClass(SavedSearch);
SavedSearchSchema.virtual('id').get(function () {
  return this._id;
});
