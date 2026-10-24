import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AccountStatus, UserRole } from '../enums';

export type UserDocument = HydratedUser;

@Schema({
  timestamps: true,
  collection: 'users',
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.passwordHash;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
  })
  email!: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  passwordHash!: string;

  @Prop({
    type: String,
    required: true,
    enum: UserRole,
    default: UserRole.CANDIDATE,
    index: true,
  })
  role!: UserRole;

  @Prop({
    type: String,
    required: true,
    enum: AccountStatus,
    default: AccountStatus.PENDING,
    index: true,
  })
  accountStatus!: AccountStatus;

  @Prop({ type: Date, default: null })
  lastLoginAt?: Date;

  createdAt!: Date;
  updatedAt!: Date;
}

export type HydratedUser = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ role: 1, accountStatus: 1 });
