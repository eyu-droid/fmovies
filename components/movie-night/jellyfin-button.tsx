"use client"

import { Button } from "@/components/ui/button";
import { ExternalLink, Tv } from "lucide-react";
import { useState } from "react";
import { JellyfinSyncGuide } from "./jellyfin-sync-guide";

interface JellyfinButtonProps {
  serverUrl: string;
  itemId?: string | null;
  movieTitle: string;
  eventTitle: string;
}

export function JellyfinButton({
  serverUrl,
  itemId,
  movieTitle,
  eventTitle,
}: JellyfinButtonProps) {
  const [showGuide, setShowGuide] = useState(false);

  if (!serverUrl) {
    return null;
  }

  const playerUrl = itemId
    ? `${serverUrl.replace(/\/$/, "")}/web/index.html#!/videoplayer?ids=${itemId}`
    : `${serverUrl.replace(/\/$/, "")}/web`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          asChild
          className="flex-1 bg-formovies-gold text-formovies-dark hover:bg-formovies-amber font-semibold"
        >
          <a href={playerUrl} target="_blank" rel="noreferrer">
            <Tv className="mr-2 size-4" />
            Open in Jellyfin
            <ExternalLink className="ml-2 size-4" />
          </a>
        </Button>
        <Button
          onClick={() => setShowGuide(!showGuide)}
          variant="outline"
          className="border-formovies-gold/30 text-formovies-gold hover:bg-formovies-gold/10"
        >
          {showGuide ? "Hide guide" : "How to sync?"}
        </Button>
      </div>

      {showGuide && (
        <JellyfinSyncGuide
          serverUrl={serverUrl}
          movieTitle={movieTitle}
          eventTitle={eventTitle}
        />
      )}
    </div>
  );
}
