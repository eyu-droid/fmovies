"use client"

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface MovieNightCountdownProps {
  scheduledTime: Date;
  timezone?: string;
}

export function MovieNightCountdown({ scheduledTime, timezone = "UTC" }: MovieNightCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const diff = scheduledTime.getTime() - now.getTime();

      if (diff <= 0) {
        setIsPast(true);
        setTimeRemaining("Event has started!");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [scheduledTime]);

  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
      isPast
        ? "bg-red-500/10 border border-red-500/30 text-red-200"
        : "bg-formovies-gold/10 border border-formovies-gold/30 text-formovies-gold"
    }`}>
      <Clock className="size-4" />
      <span className="text-sm font-medium">{timeRemaining}</span>
    </div>
  );
}
