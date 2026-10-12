"use client"

import { createMovieNight } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarClock, Sparkles, Tv, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MovieNightFormProps {
  movie: {
    id: number;
    title: string;
    poster_path?: string | null;
    overview?: string | null;
  };
}

export function MovieNightForm({ movie }: MovieNightFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      formData.set("movieTitle", movie.title);
      formData.set("tmdbMovieId", String(movie.id));
      formData.set("moviePosterPath", movie.poster_path ?? "");
      formData.set("movieOverview", movie.overview ?? "");
      formData.set("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");

      const result = await createMovieNight(formData);
      router.push(`/home/movie-night/${result.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-3 text-formovies-gold">
        <Sparkles className="size-5" />
        <h3 className="font-display text-2xl tracking-wide text-white">Plan a watch party</h3>
      </div>

      <input type="hidden" name="movieTitle" value={movie.title} />
      <input type="hidden" name="tmdbMovieId" value={String(movie.id)} />
      <input type="hidden" name="moviePosterPath" value={movie.poster_path ?? ""} />
      <input type="hidden" name="movieOverview" value={movie.overview ?? ""} />
      <input type="hidden" name="timezone" value={Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"} />

      <div className="space-y-2">
        <label htmlFor="title" className="text-xs uppercase tracking-[0.2em] text-white/50">
          Event name
        </label>
        <Input
          id="title"
          name="title"
          defaultValue={`${movie.title} Movie Night`}
          placeholder="Movie Night"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="scheduledTime" className="text-xs uppercase tracking-[0.2em] text-white/50">
          Start time
        </label>
        <Input
          id="scheduledTime"
          name="scheduledTime"
          type="datetime-local"
          required
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-xs uppercase tracking-[0.2em] text-white/50">
          Details
        </label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Bring snacks, vote for a snack break, and get ready to watch together."
          className="resize-none bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
      </div>

      <div className="rounded-lg border border-formovies-gold/30 bg-formovies-gold/[0.04] p-4">
        <div className="flex gap-3">
          <HelpCircle className="size-5 flex-shrink-0 text-formovies-gold" />
          <div>
            <p className="text-sm font-semibold text-formovies-gold/90">
              Have a Jellyfin server?
            </p>
            <p className="mt-1 text-xs text-formovies-gold/70">
              Add your server URL and item ID below for instant synchronized playback using Jellyfin SyncPlay. Everyone who joins will watch together perfectly in sync!
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="jellyfinServerUrl" className="text-xs uppercase tracking-[0.2em] text-white/50">
            Jellyfin server URL
          </label>
          <Input
            id="jellyfinServerUrl"
            name="jellyfinServerUrl"
            placeholder="https://jellyfin.example.com"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
          <p className="text-[10px] text-white/30">e.g., https://jellyfin.yourserver.com</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="jellyfinItemId" className="text-xs uppercase tracking-[0.2em] text-white/50">
            Jellyfin item ID (optional)
          </label>
          <Input
            id="jellyfinItemId"
            name="jellyfinItemId"
            placeholder="e.g., abc123def456"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
          <p className="text-[10px] text-white/30">Found in Jellyfin details page URL</p>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-formovies-gold text-formovies-dark hover:bg-formovies-amber font-semibold"
      >
        {isSubmitting ? "Creating..." : "Create watch party"}
      </Button>

      <div className="space-y-2 rounded-lg bg-white/[0.02] p-3">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <CalendarClock className="size-3.5" />
          <span>Event syncs with Telegram for invites and reminders</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Tv className="size-3.5" />
          <span>Jellyfin SyncPlay keeps everyone watching in perfect sync</span>
        </div>
      </div>
    </form>
  );
}
