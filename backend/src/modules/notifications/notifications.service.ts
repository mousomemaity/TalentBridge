import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Notification, NotificationDocument } from '../../database/schemas/notification.schema';
import { MarkReadDto, NotificationPreferencesDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async listUserNotifications(userId: string) {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).limit(50).exec();
  }

  async markAsRead(userId: string, dto: MarkReadDto) {
    if (dto.notificationIds && dto.notificationIds.length > 0) {
      await this.notificationModel.updateMany(
        { userId, _id: { $in: dto.notificationIds } },
        { readAt: new Date() },
      ).exec();
    } else {
      await this.notificationModel.updateMany(
        { userId, readAt: null },
        { readAt: new Date() },
      ).exec();
    }
    return { success: true, message: 'Notifications marked as read' };
  }

  async updatePreferences(userId: string, dto: NotificationPreferencesDto) {
    return {
      userId,
      preferences: dto,
      updatedAt: new Date(),
    };
  }

  async sendNotification(userId: string, type: string, title: string, message: string, data?: any, tenantId?: string) {
    return this.notificationModel.create({
      _id: uuidv4(),
      userId,
      tenantId,
      type,
      title,
      message,
      data,
    });
  }
}
