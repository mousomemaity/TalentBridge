import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ScorecardDocument = Scorecard & Document;

@Schema({ _id: false })
export class ScorecardCriterionRating {
  @Prop({ required: true })
  criterion: string;

  @Prop({ required: true, min: 1, max: 5 })
  score: number;

  @Prop()
  notes?: string;
}

@Schema({ timestamps: true, collection: 'scorecards' })
export class Scorecard {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, index: true })
  interviewId: string;

  @Prop({ required: true, index: true })
  applicationId: string;

  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true, index: true })
  interviewerId: string;

  @Prop({ type: [ScorecardCriterionRating], default: [] })
  ratings: ScorecardCriterionRating[];

  @Prop({ required: true, min: 1, max: 5 })
  overallRating: number;

  @Prop({ required: true, enum: ['STRONG_YES', 'YES', 'NEUTRAL', 'NO', 'STRONG_NO'] })
  recommendation: string;

  @Prop()
  summary?: string;

  @Prop({ type: Date, default: Date.now })
  submittedAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ScorecardSchema = SchemaFactory.createForClass(Scorecard);
ScorecardSchema.index({ interviewId: 1, interviewerId: 1 }, { unique: true });
ScorecardSchema.virtual('id').get(function () {
  return this._id;
});
