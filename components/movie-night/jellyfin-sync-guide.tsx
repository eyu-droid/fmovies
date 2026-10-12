"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Play, Users, Zap } from "lucide-react";

interface JellyfinSyncGuideProps {
  serverUrl: string;
  movieTitle: string;
  eventTitle: string;
}

export function JellyfinSyncGuide({
  serverUrl,
  movieTitle,
  eventTitle,
}: JellyfinSyncGuideProps) {
  const [expanded, setExpanded] = useState(false);

  const steps = [
    {
      number: 1,
      title: "Click Open in Jellyfin",
      description: "This will take you to the Jellyfin player with the movie ready to play.",
      icon: Play,
    },
    {
      number: 2,
      title: "Enable SyncPlay",
      description: "Look for the SyncPlay button in the player controls (usually in the bottom right).",
      icon: Zap,
    },
    {
      number: 3,
      title: "Create or Join a Group",
      description: `Create a new SyncPlay group or join an existing one with name like "${eventTitle}".",
      icon: Users,
    },
    {
      number: 4,
      title: "Invite Friends",
      description: "Share the group name with your friends so they can join and watch together.",
      icon: Users,
    },
  ];

  return (
    <Card className="border-white/10 bg-white/[0.03]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-white">
            <Play className="size-5 text-formovies-gold" />
            How to Watch Together
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-white/60 hover:text-white"
          >
            {expanded ? (
              <ChevronUp className="size-5" />
            ) : (
              <ChevronDown className="size-5" />
            )}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-6">
          <div className="rounded-lg border border-formovies-gold/30 bg-formovies-gold/[0.04] p-4">
            <p className="text-sm text-formovies-gold/90">
              💡 <strong>SyncPlay Magic:</strong> Jellyfin automatically synchronizes playback across all users in the same group. Everyone's video stays in perfect sync — no manual coordination needed!
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-formovies-gold/20">
                    <span className="text-sm font-bold text-formovies-gold">
                      {step.number}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{step.title}</h4>
                    <p className="mt-1 text-sm text-white/60">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-3">
            <h4 className="font-semibold text-white text-sm">✨ Features</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <span className="text-formovies-gold">✓</span>
                Automatic playback synchronization
              </li>
              <li className="flex items-center gap-2">
                <span className="text-formovies-gold">✓</span>
                Everyone pauses/plays together
              </li>
              <li className="flex items-center gap-2">
                <span className="text-formovies-gold">✓</span>
                Seek/skip syncs across all users
              </li>
              <li className="flex items-center gap-2">
                <span className="text-formovies-gold">✓</span>
                Unlimited watchers (server dependent)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-formovies-gold">✓</span>
                Built into Jellyfin — no extra setup
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-3">
            <h4 className="font-semibold text-white text-sm">❓ Troubleshooting</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <strong className="text-white">Don't see SyncPlay?</strong> Make sure your Jellyfin server has SyncPlay enabled in admin settings.
              </li>
              <li>
                <strong className="text-white">Out of sync?</strong> Everyone should reload the page and rejoin the group.
              </li>
              <li>
                <strong className="text-white">Can't access server?</strong> Check that your Jellyfin server is reachable from the internet.
              </li>
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
