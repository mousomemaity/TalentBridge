import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { NotificationType } from '../enums';
import { ModelNames } from '../config/database.constants';

export type NotificationDocument = HydratedNotification;

@Schema({
  timestamps: true,
  collection: 'notifications',
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Notification {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ModelNames.USER,
    required: true,
    index: true,
  })
  recipient!: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: NotificationType,
    index: true,
  })
  type!: NotificationType;

  @Prop({ type: String, required: true, trim: true })
  title!: string;

  @Prop({ type: String, required: true, trim: true })
  message!: string;

  @Prop(
    raw({
      entityType: { type: String, required: true },
      entityId: { type: MongooseSchema.Types.ObjectId, required: true },
    }),
  )
  relatedEntity!: {
    entityType: string;
    entityId: Types.ObjectId;
  };

  @Prop({ type: Boolean, default: false, index: true })
  isRead!: boolean;

  @Prop({ type: Date, default: null })
  readAt?: Date;

  createdAt!: Date;
  updatedAt!: Date;
}

export type HydratedNotification = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Fast unread inbox query index
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
