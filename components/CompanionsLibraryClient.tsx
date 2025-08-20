"use client";
import { useSavedCompanions } from "@/components/SavedCompanionsProvider";
import { getSubjectColor } from "@/lib/utils";
import CompanionCard from "@/components/CompanionCard";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";
import { useMemo } from "react";

interface CompanionsLibraryClientProps {
  initialCompanions: any[];
}

const CompanionsLibraryClient = ({ initialCompanions }: CompanionsLibraryClientProps) => {
  const { savedIds } = useSavedCompanions();
  const ordered = useMemo(() => {
    if (!savedIds.length) return initialCompanions;
    const savedSet = new Set(savedIds);
    const saved = initialCompanions.filter((c) => savedSet.has(c.id));
    const rest = initialCompanions.filter((c) => !savedSet.has(c.id));
    return [...saved, ...rest];
  }, [initialCompanions, savedIds]);

  return (
    <main>
      <section className="flex justify-between gap-4 max-sm:flex-col">
        <h1>Companion Library</h1>
        <div className="flex gap-4">
          <SearchInput />
          <SubjectFilter />
        </div>
      </section>
      <section className="companions-grid">
        {ordered.map((companion) => (
          <CompanionCard
            key={companion.id}
            {...companion}
            color={getSubjectColor(companion.subject)}
          />
        ))}
      </section>
    </main>
  );
};

export default CompanionsLibraryClient;
