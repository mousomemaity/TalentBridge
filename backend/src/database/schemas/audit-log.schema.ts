import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, collection: 'audit_logs' })
export class AuditLog {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, index: true })
  actorId: string;

  @Prop({ type: String, index: true })
  tenantId?: string;

  @Prop({ required: true })
  action: string; // STAGE_TRANSITION, APPLICATION_HIRE, OFFER_SENT, ROLE_CHANGE, etc.

  @Prop({ required: true })
  entityType: string;

  @Prop({ required: true, index: true })
  entityId: string;

  @Prop({ type: Object, default: {} })
  details: Record<string, any>;

  @Prop()
  ipAddress?: string;

  @Prop({ type: Date, default: Date.now, index: true })
  createdAt: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
AuditLogSchema.virtual('id').get(function () {
  return this._id;
});
