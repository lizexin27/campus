const schedule = require('node-schedule');
const Reminder = require('../models/Reminder');
const pushNotificationService = require('./pushNotificationService');

class ReminderService {
  // 设置定时任务
  static setupJobs() {
    // 每分钟检查一次提醒
    schedule.scheduleJob('* * * * *', async () => {
      await this.checkReminders();
    });

    console.log('Reminder service started');
  }

  // 检查提醒
  static async checkReminders() {
    try {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // 获取所有需要触发的提醒
      const reminders = await Reminder.find({
        enabled: true,
        time: currentTime,
        notified: false
      });

      for (const reminder of reminders) {
        try {
          // 发送通知
          await pushNotificationService.sendNotification({
            userId: reminder.userId,
            title: reminder.title,
            body: reminder.content || '提醒时间到了',
            type: 'reminder'
          });

          // 更新已通知状态
          reminder.notified = true;
          await reminder.save();

          console.log(`Reminder sent for ${reminder.title}`);
        } catch (error) {
          console.error('Failed to send reminder:', error);
        }
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  }

  // 设置单个提醒
  static async setReminder(reminderData) {
    const reminder = new Reminder({
      ...reminderData,
      notified: false
    });

    await reminder.save();

    // 如果是立即触发的提醒，立即发送
    if (reminderData.immediate) {
      await this.triggerReminder(reminder._id);
    }

    return reminder;
  }

  // 手动触发提醒
  static async triggerReminder(reminderId) {
    try {
      const reminder = await Reminder.findById(reminderId);
      if (!reminder || !reminder.enabled) return;

      await pushNotificationService.sendNotification({
        userId: reminder.userId,
        title: reminder.title,
        body: reminder.content || '提醒时间到了',
        type: 'reminder'
      });

      reminder.notified = true;
      await reminder.save();

      console.log(`Manual reminder sent for ${reminder.title}`);
    } catch (error) {
      console.error('Failed to trigger reminder:', error);
    }
  }
}

module.exports = ReminderService;