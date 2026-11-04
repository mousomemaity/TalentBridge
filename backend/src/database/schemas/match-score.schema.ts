import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type MatchScoreDocument = MatchScore & Document;

@Schema({ timestamps: true, collection: 'match_scores' })
export class MatchScore {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, unique: true, index: true })
  applicationId: string;

  @Prop({ required: true, min: 0, max: 100 })
  score: number;

  @Prop({ type: Object, default: {} })
  breakdown: {
    skillsMatchPercent?: number;
    experienceScore?: number;
    locationCompatibility?: number;
    matchedSkills?: string[];
    missingSkills?: string[];
    explanation?: string;
  };

  @Prop({ default: 'v1.0' })
  modelVersion: string;

  @Prop({ type: Date, default: Date.now })
  computedAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const MatchScoreSchema = SchemaFactory.createForClass(MatchScore);
MatchScoreSchema.virtual('id').get(function () {
  return this._id;
});
