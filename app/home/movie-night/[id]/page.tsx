import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MovieNightCountdown } from "@/components/movie-night/movie-night-countdown";
import { RSVPButtons } from "@/components/movie-night/rsvp-buttons";
import { JellyfinButton } from "@/components/movie-night/jellyfin-button";
import {
  CalendarClock,
  Clock3,
  Link2,
  Tv,
  Users,
  MessageSquare,
  Share2,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

const getTelegramShareUrl = (url: string, title: string) => {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `https://t.me/share/url?url=${encodeURIComponent(
    `${base}${url}`
  )}&text=${encodeURIComponent(`Join my movie night: ${title}`)}`;
};

const MovieNightDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const session = await getAuthSession();
  const currentUser = session?.user?.email
    ? await db.user.findUnique({ where: { email: session.user.email } })
    : null;

  const movieNight = await db.movieNight.findUnique({
    where: { id },
    include: {
      organizer: true,
      attendees: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!movieNight) {
    return (
      <div className="mx-auto max-w-[1000px] px-4 py-16 text-center">
        <h1 className="font-display text-4xl text-white">Movie night not found</h1>
      </div>
    );
  }

  const start = new Date(movieNight.scheduledTime);
  const shareUrl = `/home/movie-night/${movieNight.id}`;
  const going = movieNight.attendees.filter((a) => a.status === "going").length;
  const maybe = movieNight.attendees.filter((a) => a.status === "maybe").length;
  const currentUserAttendance = movieNight.attendees.find(
    (a) => a.userId === currentUser?.id
  );
  const isOrganizer = movieNight.organizerId === currentUser?.id;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/home/movie-night"
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ChevronLeft className="size-4" />
          Back to events
        </Link>

        <div className="flex gap-2">
          <Button
            asChild
            className="bg-formovies-gold text-formovies-dark hover:bg-formovies-amber font-semibold"
          >
            <a
              href={getTelegramShareUrl(shareUrl, movieNight.title)}
              target="_blank"
              rel="noreferrer"
            >
              <Share2 className="mr-2 size-4" />
              Share in Telegram
            </a>
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-formovies-gold/70">
          Watch Party
        </p>
        <h1 className="mt-3 font-display text-4xl text-white">{movieNight.title}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="font-display text-2xl tracking-wide text-white">
              Movie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {movieNight.moviePosterPath ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movieNight.moviePosterPath}`}
                alt={movieNight.movieTitle}
                className="h-[420px] w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-[420px] w-full items-center justify-center rounded-xl bg-white/5 text-formovies-gold">
                <Tv className="size-10" />
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Title
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {movieNight.movieTitle}
              </h2>
            </div>
            {movieNight.movieOverview && (
              <p className="text-sm leading-relaxed text-white/60 line-clamp-6">
                {movieNight.movieOverview}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <CalendarClock className="size-5 text-formovies-gold" />
                Event details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <MovieNightCountdown scheduledTime={start} timezone={movieNight.timezone} />

              <div className="space-y-3 text-sm text-white/70">
                <div className="flex items-center gap-3">
                  <Clock3 className="size-4 text-formovies-gold" />
                  {start.toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>

                <div className="flex items-center gap-3">
                  <Users className="size-4 text-formovies-gold" />
                  {going} going • {maybe} maybe
                </div>

                <div className="flex items-center gap-3">
                  <MessageSquare className="size-4 text-formovies-gold" />
                  Organized by {movieNight.organizer.name || movieNight.organizer.email}
                </div>
              </div>

              {movieNight.description && (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/70">
                  {movieNight.description}
                </div>
              )}

              {currentUser && (
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3">
                    Your Response
                  </p>
                  <RSVPButtons
                    movieNightId={id}
                    currentStatus={currentUserAttendance?.status}
                  />
                </div>
              )}

              {movieNight.jellyfinServerUrl && (
                <div className="pt-4 border-t border-white/10">
                  <JellyfinButton
                    serverUrl={movieNight.jellyfinServerUrl}
                    itemId={movieNight.jellyfinItemId}
                    movieTitle={movieNight.movieTitle}
                    eventTitle={movieNight.title}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Users className="size-5 text-formovies-gold" />
                Attendees ({movieNight.attendees.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {movieNight.attendees.length === 0 ? (
                  <p className="text-white/50 text-sm">No attendees yet.</p>
                ) : (
                  movieNight.attendees.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-white text-sm">
                          {attendee.user.name || attendee.user.email}
                          {isOrganizer && attendee.userId === movieNight.organizerId && (
                            <span className="ml-2 text-xs text-formovies-gold">organizer</span>
                          )}
                        </p>
                      </div>
                      <p className={`text-xs uppercase tracking-[0.1em] font-semibold ${
                        attendee.status === "going"
                          ? "text-green-400"
                          : attendee.status === "maybe"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}>
                        {attendee.status}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MovieNightDetailPage;
