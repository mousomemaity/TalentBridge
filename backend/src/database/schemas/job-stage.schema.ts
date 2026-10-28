import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { StageKind } from '../../common/constants/roles.enum';

export type JobStageDocument = JobStage & Document;

@Schema({ timestamps: true, collection: 'job_stages' })
export class JobStage {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, index: true })
  jobId: string;

  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: StageKind, default: StageKind.SCREEN })
  kind: StageKind;

  @Prop({ required: true, default: 0 })
  position: number;

  @Prop({ default: 3 })
  slaDays: number;

  @Prop({ type: Object, default: {} })
  automations?: {
    emailCandidate?: boolean;
    templateId?: string;
    autoSendAssessment?: boolean;
    assessmentId?: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export const JobStageSchema = SchemaFactory.createForClass(JobStage);
JobStageSchema.index({ jobId: 1, position: 1 });
JobStageSchema.virtual('id').get(function () {
  return this._id;
});
