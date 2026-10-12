import { db } from "./db";
import { sendTelegramMessage, formatTelegramReminderMessage } from "./telegram";

function formatTimeUntil(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff <= 0) return "Now";

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${minutes} minute${minutes > 1 ? "s" : ""}`;
}

export async function sendMovieNightReminders() {
  try {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);

    const upcomingMovieNights = await db.movieNight.findMany({
      where: {
        scheduledTime: {
          gte: now,
          lte: in24Hours,
        },
        status: "scheduled",
      },
      include: {
        attendees: true,
      },
    });

    for (const movieNight of upcomingMovieNights) {
      const timeUntil = formatTimeUntil(movieNight.scheduledTime);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const eventUrl = `${baseUrl}/home/movie-night/${movieNight.id}`;
      const message = formatTelegramReminderMessage(
        movieNight.title,
        movieNight.movieTitle,
        timeUntil,
        eventUrl
      );

      console.log(`[Reminder] Upcoming: ${movieNight.title} - ${timeUntil}`);
    }
  } catch (error) {
    console.error("Error sending reminders:", error);
  }
}

export async function updateMovieNightStatus() {
  try {
    const now = new Date();

    // Mark started events
    await db.movieNight.updateMany({
      where: {
        scheduledTime: { lte: now },
        status: "scheduled",
      },
      data: {
        status: "in_progress",
      },
    });

    // Mark completed events (after 4 hours)
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
    await db.movieNight.updateMany({
      where: {
        scheduledTime: { lte: fourHoursAgo },
        status: "in_progress",
      },
      data: {
        status: "completed",
      },
    });
  } catch (error) {
    console.error("Error updating movie night status:", error);
  }
}
