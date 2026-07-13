import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Req() req: Request & { user?: { id?: string } }) {
    return this.notificationsService.findAll(req.user?.id ?? '');
  }

  @Post()
  create(@Req() req: Request & { user?: { id?: string } }, @Body() body: Record<string, unknown>) {
    return this.notificationsService.create(req.user?.id ?? '', {
      userId: req.user?.id ?? '',
      title: String(body.title ?? 'New notification'),
      message: String(body.message ?? ''),
      channels: Array.isArray(body.channels) ? (body.channels as string[]) : undefined,
      templateName: typeof body.templateName === 'string' ? body.templateName : undefined,
      context:
        typeof body.context === 'object' && body.context
          ? (body.context as Record<string, unknown>)
          : undefined,
      preferences:
        typeof body.preferences === 'object' && body.preferences
          ? (body.preferences as any)
          : undefined,
      retry:
        typeof body.retry === 'object' && body.retry
          ? (body.retry as { maxAttempts?: number })
          : undefined,
      queue: typeof body.queue === 'boolean' ? body.queue : false,
      scheduledAt: body.scheduledAt ? new Date(String(body.scheduledAt)) : undefined,
      metadata:
        typeof body.metadata === 'object' && body.metadata
          ? (body.metadata as Record<string, unknown>)
          : undefined,
    });
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch(':id/unread')
  markAsUnread(@Param('id') id: string) {
    return this.notificationsService.markAsUnread(id);
  }

  @Get('preferences')
  getPreferences(@Req() req: Request & { user?: { id?: string } }) {
    return this.notificationsService.getPreferences(req.user?.id ?? '');
  }

  @Patch('preferences')
  updatePreferences(
    @Req() req: Request & { user?: { id?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.notificationsService.setPreferences(req.user?.id ?? '', {
      inApp: body.inApp === undefined ? undefined : Boolean(body.inApp),
      email: body.email === undefined ? undefined : Boolean(body.email),
      push: body.push === undefined ? undefined : Boolean(body.push),
      webPush: body.webPush === undefined ? undefined : Boolean(body.webPush),
    } as any);
  }

  @Post('digest')
  createDigest(
    @Req() req: Request & { user?: { id?: string } },
    @Body() body: { notificationIds?: string[] },
  ) {
    return this.notificationsService.createDigest(req.user?.id ?? '', body.notificationIds ?? []);
  }

  @Post('schedule')
  schedule(
    @Req() req: Request & { user?: { id?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.notificationsService.schedule(req.user?.id ?? '', {
      userId: req.user?.id ?? '',
      title: String(body.title ?? 'Scheduled notification'),
      message: String(body.message ?? ''),
      channels: Array.isArray(body.channels) ? (body.channels as string[]) : undefined,
      templateName: typeof body.templateName === 'string' ? body.templateName : undefined,
      context:
        typeof body.context === 'object' && body.context
          ? (body.context as Record<string, unknown>)
          : undefined,
      preferences:
        typeof body.preferences === 'object' && body.preferences
          ? (body.preferences as any)
          : undefined,
      retry:
        typeof body.retry === 'object' && body.retry
          ? (body.retry as { maxAttempts?: number })
          : undefined,
      queue: true,
      scheduledAt: body.scheduledAt ? new Date(String(body.scheduledAt)) : undefined,
      metadata:
        typeof body.metadata === 'object' && body.metadata
          ? (body.metadata as Record<string, unknown>)
          : undefined,
    });
  }
}
