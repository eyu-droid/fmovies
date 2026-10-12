import axios from 'axios';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function sendTelegramMessage(
  chatId: string,
  text: string,
  parseMode: 'HTML' | 'Markdown' = 'HTML'
) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('TELEGRAM_BOT_TOKEN not configured');
    return null;
  }

  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: false,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return null;
  }
}

export async function sendTelegramPhoto(
  chatId: string,
  photoUrl: string,
  caption: string,
  parseMode: 'HTML' | 'Markdown' = 'HTML'
) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('TELEGRAM_BOT_TOKEN not configured');
    return null;
  }

  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/sendPhoto`, {
      chat_id: chatId,
      photo: photoUrl,
      caption,
      parse_mode: parseMode,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending Telegram photo:', error);
    return null;
  }
}

export function formatTelegramMovieNightMessage(
  title: string,
  movieTitle: string,
  scheduledTime: Date,
  eventUrl: string,
  organizerName: string
): string {
  const timeStr = scheduledTime.toLocaleString();
  return `🎬 <b>${title}</b>\n\n🎥 Movie: <b>${movieTitle}</b>\n⏰ Time: <code>${timeStr}</code>\n👤 Organized by ${organizerName}\n\n<a href="${eventUrl}">Join the watch party →</a>`;
}

export function formatTelegramReminderMessage(
  title: string,
  movieTitle: string,
  timeUntilStart: string,
  eventUrl: string
): string {
  return `🚨 <b>Reminder: ${title}</b>\n\n🎥 <b>${movieTitle}</b>\n⏱️ Starts in <b>${timeUntilStart}</b>\n\n<a href="${eventUrl}">View details →</a>`;
}
