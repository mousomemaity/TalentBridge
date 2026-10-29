import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { ModelNames } from '../config/database.constants';

export type ApplicationStageHistoryDocument = HydratedApplicationStageHistory;

@Schema({
  timestamps: true,
  collection: 'application_stage_histories',
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class ApplicationStageHistory {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.APPLICATION,
    required: true,
    index: true,
  })
  application!: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.PIPELINE_STAGE,
    default: null,
  })
  previousStage?: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.PIPELINE_STAGE,
    required: true,
  })
  nextStage!: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.USER,
    required: true,
  })
  actor!: Types.ObjectId;

  @Prop({ type: String, default: '', trim: true })
  notes!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export type HydratedApplicationStageHistory = ApplicationStageHistory & Document;
export const ApplicationStageHistorySchema = SchemaFactory.createForClass(ApplicationStageHistory);

// Chronological stage audit trail per application
ApplicationStageHistorySchema.index({ application: 1, createdAt: -1 });
ApplicationStageHistorySchema.index({ actor: 1, createdAt: -1 });
