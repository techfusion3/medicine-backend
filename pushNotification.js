const webpush = require('web-push');
const Reminder = require('../models/Reminder');
const User = require('../models/User');

// VAPID keys for push notifications
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  'mailto:techfusion705@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Function to send push notification
const sendPushNotification = async (subscription, title, body) => {
  const payload = JSON.stringify({ title, body });

  try {
    await webpush.sendNotification(subscription, payload);
    console.log('[📲 Push Notification sent]');
  } catch (error) {
    console.error('[❌ Push Notification Error]', error);
  }
};

// Cron job or endpoint to trigger push notification (example)
const sendPushReminder = async () => {
  const reminders = await Reminder.find({}).lean();

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  for (const reminder of reminders) {
    const { times, medicineName, userId } = reminder;

    if (times.includes(currentTime)) {
      const user = await User.findById(userId).lean();

      if (user && user.pushSubscription) {
        const subscription = user.pushSubscription;
        const title = `Medicine Reminder: ${medicineName}`;
        const body = `It's time to take your medicine: ${medicineName}`;

        await sendPushNotification(subscription, title, body);
      }
    }
  }
};

module.exports = sendPushReminder;
