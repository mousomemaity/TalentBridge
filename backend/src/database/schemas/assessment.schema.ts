import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type AssessmentDocument = Assessment & Document;

@Schema({ _id: false })
export class AssessmentQuestion {
  @Prop({ type: String, default: uuidv4 })
  id: string;

  @Prop({ required: true })
  prompt: string;

  @Prop({ default: 'MCQ', enum: ['MCQ', 'CODING', 'WRITTEN'] })
  type: string;

  @Prop({ type: [String], default: [] })
  options?: string[];

  @Prop()
  correctAnswer?: string;

  @Prop({ default: 10 })
  points: number;
}

@Schema({ timestamps: true, collection: 'assessments' })
export class Assessment {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ default: 45 })
  durationMinutes: number;

  @Prop({ default: 70 })
  passScore: number;

  @Prop({ type: [AssessmentQuestion], default: [] })
  questions: AssessmentQuestion[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment);
AssessmentSchema.virtual('id').get(function () {
  return this._id;
});
