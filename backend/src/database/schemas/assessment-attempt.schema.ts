import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { AssessmentStatus } from '../../common/constants/roles.enum';

export type AssessmentAttemptDocument = AssessmentAttempt & Document;

@Schema({ timestamps: true, collection: 'assessment_attempts' })
export class AssessmentAttempt {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, index: true })
  assessmentId: string;

  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true, index: true })
  applicationId: string;

  @Prop({ required: true, index: true })
  candidateId: string;

  @Prop({ required: true, unique: true, index: true })
  inviteId: string;

  @Prop({ required: true, enum: AssessmentStatus, default: AssessmentStatus.INVITED })
  status: AssessmentStatus;

  @Prop({ type: Date })
  startedAt?: Date;

  @Prop({ type: Date })
  deadlineAt?: Date;

  @Prop({ type: Date })
  submittedAt?: Date;

  @Prop({ type: Number })
  score?: number;

  @Prop({ default: 100 })
  integrityScore: number;

  @Prop({ type: Object, default: {} })
  answers: Record<string, any>;

  @Prop({ type: [Object], default: [] })
  proctorEvents: Array<{ event: string; timestamp: Date; details?: any }>;

  createdAt?: Date;
  updatedAt?: Date;
}

export const AssessmentAttemptSchema = SchemaFactory.createForClass(AssessmentAttempt);
AssessmentAttemptSchema.virtual('id').get(function () {
  return this._id;
});
