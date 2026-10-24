import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { PipelineStageCategory } from '../enums';
import { ModelNames } from '../config/database.constants';

export type PipelineStageDocument = HydratedPipelineStage;

@Schema({
  timestamps: true,
  collection: 'pipeline_stages',
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class PipelineStage {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.COMPANY,
    required: true,
    index: true,
  })
  company!: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.JOB,
    default: null,
    index: true,
  })
  job?: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  name!: string;

  @Prop({ type: Number, required: true, default: 0 })
  position!: number;

  @Prop({
    type: String,
    required: true,
    enum: PipelineStageCategory,
    index: true,
  })
  category!: PipelineStageCategory;

  @Prop({ type: Number, default: 3, min: 0 })
  slaDays!: number;

  @Prop({ type: Number, default: 0, min: 0 })
  slaHours!: number;

  createdAt!: Date;
  updatedAt!: Date;
}

export type HydratedPipelineStage = PipelineStage & Document;
export const PipelineStageSchema = SchemaFactory.createForClass(PipelineStage);

PipelineStageSchema.index({ company: 1, job: 1, position: 1 });
PipelineStageSchema.index({ company: 1, category: 1 });
