"use client";
import Image from "next/image";
import Link from "next/link";
import { useSavedCompanions } from "./SavedCompanionsProvider";
import { useMemo } from "react";

interface CompanionCardProps {
  id: string;
  name: string,
  topic: string,
  subject: string,
  duration: number,
  color: string;
}

const CompanionCard = ({id, name, topic, subject, duration, color}: CompanionCardProps) => {
  const { savedIds, toggleSave } = useSavedCompanions();
  const isSaved = useMemo(() => savedIds.includes(id), [savedIds, id]);

  return (
    <article className="companion-card" style={{ backgroundColor: color }}>
      <div className="flex justify-between items-center">
        <div className="subject-badge">{subject}</div>
        <button
          className="companion-bookmark"
          aria-label={isSaved ? "Remove from saved" : "Save companion"}
          aria-pressed={isSaved}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSave(id);
          }}
        >
          <Image
            src={isSaved ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"}
            alt={isSaved ? "saved" : "bookmark"}
            width={12.5}
            height={15}
          />
        </button>
      </div>
      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-sm">{topic}</p>
      <div className="flex items-center gap-2">
        <Image src="/icons/clock.svg" alt="duration" width={13.5} height={13.5} />
        <p className="textsm">{duration} minutes</p>
      </div>
      <Link href={`/companions/${id}`} className="w-full">
        <button className="btn-primary w-full justify-center">Launch Lesson</button>
      </Link>
    </article>
  );
};

export default CompanionCard