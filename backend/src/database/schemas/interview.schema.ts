import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { InterviewStatus } from '../../common/constants/roles.enum';

export type InterviewDocument = Interview & Document;

@Schema({ timestamps: true, collection: 'interviews' })
export class Interview {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true, index: true })
  applicationId: string;

  @Prop({ required: true, index: true })
  jobId: string;

  @Prop({ required: true, index: true })
  candidateId: string;

  @Prop({ type: [String], default: [] })
  interviewerIds: string[];

  @Prop({ default: 'VIDEO', enum: ['PHONE', 'VIDEO', 'ONSITE'] })
  type: string;

  @Prop({ required: true })
  startsAt: Date;

  @Prop({ required: true })
  endsAt: Date;

  @Prop({ default: 'UTC' })
  timezone: string;

  @Prop({ required: true, enum: InterviewStatus, default: InterviewStatus.SCHEDULED })
  status: InterviewStatus;

  @Prop({ default: () => `room-${uuidv4()}` })
  roomName: string;

  @Prop()
  notes?: string;

  @Prop()
  rescheduleReason?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const InterviewSchema = SchemaFactory.createForClass(Interview);
InterviewSchema.index({ tenantId: 1, startsAt: 1 });
InterviewSchema.virtual('id').get(function () {
  return this._id;
});
