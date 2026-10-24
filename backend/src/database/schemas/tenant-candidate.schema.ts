import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type TenantCandidateDocument = TenantCandidate & Document;

@Schema({ timestamps: true, collection: 'tenant_candidates' })
export class TenantCandidate {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ type: String, index: true })
  userId?: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ trim: true })
  name?: string;

  @Prop({ default: 'APPLICATION' })
  source: string;

  @Prop({ type: String })
  ownerId?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const TenantCandidateSchema = SchemaFactory.createForClass(TenantCandidate);
TenantCandidateSchema.index({ tenantId: 1, email: 1 }, { unique: true });
TenantCandidateSchema.virtual('id').get(function () {
  return this._id;
});
