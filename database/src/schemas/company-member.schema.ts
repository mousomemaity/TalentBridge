import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { CompanyMemberRole, MembershipStatus } from '../enums';
import { ModelNames } from '../config/database.constants';

export type CompanyMemberDocument = HydratedCompanyMember;

@Schema({
  timestamps: true,
  collection: 'company_members',
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class CompanyMember {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.USER,
    required: true,
    index: true,
  })
  user!: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.COMPANY,
    required: true,
    index: true,
  })
  company!: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: CompanyMemberRole,
    default: CompanyMemberRole.MEMBER,
    index: true,
  })
  role!: CompanyMemberRole;

  @Prop({
    type: String,
    required: true,
    enum: MembershipStatus,
    default: MembershipStatus.INVITED,
    index: true,
  })
  membershipStatus!: MembershipStatus;

  createdAt!: Date;
  updatedAt!: Date;
}

export type HydratedCompanyMember = CompanyMember & Document;
export const CompanyMemberSchema = SchemaFactory.createForClass(CompanyMember);

// Ensure one membership record per company-user pair
CompanyMemberSchema.index({ company: 1, user: 1 }, { unique: true });
CompanyMemberSchema.index({ user: 1, membershipStatus: 1 });
