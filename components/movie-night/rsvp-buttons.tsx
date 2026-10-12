"use client"

import { joinMovieNight } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle, X } from "lucide-react";
import { useTransition } from "react";

interface RSVPButtonsProps {
  movieNightId: string;
  currentStatus?: string | null;
}

export function RSVPButtons({ movieNightId, currentStatus }: RSVPButtonsProps) {
  const [isPending, startTransition] = useTransition();

  const handleRSVP = (status: "going" | "maybe" | "declined") => {
    startTransition(async () => {
      try {
        await joinMovieNight(movieNightId, status);
      } catch (error) {
        console.error("Error updating RSVP:", error);
      }
    });
  };

  const buttonClass = (status: string) =>
    currentStatus === status
      ? "bg-formovies-gold text-formovies-dark"
      : "border-white/10 text-white/60 hover:bg-white/5";

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => handleRSVP("going")}
        disabled={isPending}
        className={`${buttonClass("going")} border`}
        variant="outline"
        size="sm"
      >
        <Check className="mr-1 size-3" />
        Going
      </Button>
      <Button
        onClick={() => handleRSVP("maybe")}
        disabled={isPending}
        className={`${buttonClass("maybe")} border`}
        variant="outline"
        size="sm"
      >
        <HelpCircle className="mr-1 size-3" />
        Maybe
      </Button>
      <Button
        onClick={() => handleRSVP("declined")}
        disabled={isPending}
        className={`${buttonClass("declined")} border`}
        variant="outline"
        size="sm"
      >
        <X className="mr-1 size-3" />
        Can't go
      </Button>
    </div>
  );
}
