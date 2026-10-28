import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ApplicationStageHistoryDocument = ApplicationStageHistory & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, collection: 'application_stage_history' })
export class ApplicationStageHistory {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, index: true })
  applicationId: string;

  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true })
  fromStageId: string;

  @Prop({ required: true })
  toStageId: string;

  @Prop({ type: String })
  fromStatus?: string;

  @Prop({ type: String })
  toStatus?: string;

  @Prop({ required: true })
  actorId: string;

  @Prop({ required: true })
  actorRole: string;

  @Prop({ type: String })
  reason?: string;

  @Prop({ type: Date, default: Date.now })
  movedAt: Date;

  createdAt?: Date;
}

export const ApplicationStageHistorySchema = SchemaFactory.createForClass(ApplicationStageHistory);
ApplicationStageHistorySchema.index({ applicationId: 1, movedAt: -1 });
ApplicationStageHistorySchema.virtual('id').get(function () {
  return this._id;
});
