import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { IComponentBreakdown } from '../interfaces';
import { ModelNames } from '../config/database.constants';

export type MatchResultDocument = HydratedMatchResult;

@Schema({
  timestamps: true,
  collection: 'match_results',
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class MatchResult {
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

  @Prop({
    type: Number,
    required: true,
    min: [0, 'Score cannot be less than 0'],
    max: [100, 'Score cannot exceed 100'],
    index: true,
  })
  totalScore!: number;

  @Prop(
    raw({
      skillsScore: { type: Number, required: true, min: 0, max: 100 },
      experienceScore: { type: Number, required: true, min: 0, max: 100 },
      educationScore: { type: Number, required: true, min: 0, max: 100 },
      locationScore: { type: Number, default: 100, min: 0, max: 100 },
      matchedSkills: [{ type: String }],
      missingSkills: [{ type: String }],
    }),
  )
  componentBreakdown!: IComponentBreakdown;

  @Prop({
    type: String,
    required: true,
    default: 'talentbridge-ai-v1',
  })
  modelVersion!: string;

  @Prop({
    type: Date,
    required: true,
    default: Date.now,
  })
  calculatedAt!: Date;

  createdAt!: Date;
  updatedAt!: Date;
}

export type HydratedMatchResult = MatchResult & Document;
export const MatchResultSchema = SchemaFactory.createForClass(MatchResult);

// Candidate/Job matching lookup
MatchResultSchema.index({ job: 1, candidate: 1 }, { unique: true });
MatchResultSchema.index({ job: 1, totalScore: -1 });
MatchResultSchema.index({ candidate: 1, totalScore: -1 });
