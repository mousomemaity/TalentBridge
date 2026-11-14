import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type TenantDocument = Tenant & Document;

@Schema({ timestamps: true, collection: 'tenants' })
export class Tenant {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  slug: string;

  @Prop({ trim: true })
  domain?: string;

  @Prop({ default: false })
  domainVerified: boolean;

  @Prop()
  logoUrl?: string;

  @Prop({ default: 'free' })
  planId: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ type: Object, default: {} })
  settings: Record<string, any>;

  createdAt?: Date;
  updatedAt?: Date;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
TenantSchema.virtual('id').get(function () {
  return this._id;
});
