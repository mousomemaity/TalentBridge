import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { ApplicationStatus } from '../enums';
import { IApplicationAnswer, IMatchScoreSnapshot } from '../interfaces';
import { ModelNames } from '../config/database.constants';

export type ApplicationDocument = HydratedApplication;

@Schema({
  timestamps: true,
  collection: 'applications',
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Application {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.JOB,
    required: true,
    index: true,
  })
  job!: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.CANDIDATE_PROFILE,
    required: true,
    index: true,
  })
  candidate!: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.RESUME,
    required: true,
  })
  selectedResume!: Types.ObjectId;

  @Prop([
    raw({
      questionId: { type: String, required: true },
      question: { type: String, required: true },
      answer: { type: String, required: true },
    }),
  ])
  answers!: IApplicationAnswer[];

  @Prop({ type: String, default: '', trim: true })
  coverLetter!: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.PIPELINE_STAGE,
    required: true,
    index: true,
  })
  currentStage!: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: ApplicationStatus,
    default: ApplicationStatus.SUBMITTED,
    index: true,
  })
  status!: ApplicationStatus;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.MATCH_RESULT,
    default: null,
  })
  matchResult?: Types.ObjectId;

  @Prop(
    raw({
      totalScore: { type: Number, min: 0, max: 100 },
      modelVersion: { type: String },
      calculatedAt: { type: Date },
    }),
  )
  matchScoreSnapshot?: IMatchScoreSnapshot;

  createdAt!: Date;
  updatedAt!: Date;
}

export type HydratedApplication = Application & Document;
export const ApplicationSchema = SchemaFactory.createForClass(Application);

// Unique candidate application per job
ApplicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

// Required index queries
ApplicationSchema.index({ job: 1, currentStage: 1 });
ApplicationSchema.index({ candidate: 1, updatedAt: -1 });
ApplicationSchema.index({ job: 1, status: 1 });
ApplicationSchema.index({ 'matchScoreSnapshot.totalScore': -1 });
