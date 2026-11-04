import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '../../common/constants/roles.enum';

export type TenantMemberDocument = TenantMember & Document;

@Schema({ timestamps: true, collection: 'tenant_members' })
export class TenantMember {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.RECRUITER })
  role: UserRole;

  @Prop({ trim: true })
  department?: string;

  @Prop({ default: true })
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const TenantMemberSchema = SchemaFactory.createForClass(TenantMember);
TenantMemberSchema.index({ tenantId: 1, userId: 1 }, { unique: true });
TenantMemberSchema.virtual('id').get(function () {
  return this._id;
});
