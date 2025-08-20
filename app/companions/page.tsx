import { getAllCompanions } from "@/lib/actions/companion.actions";
import { SavedCompanionsProvider } from "@/components/SavedCompanionsProvider";
import CompanionsLibraryClient from "@/components/CompanionsLibraryClient";

// Split into server + client to allow local saved list ordering.

// client logic moved to components/CompanionsLibraryClient.tsx

// Export a server component that fetches, then renders provider + client ordering component.
export default async function CompanionsLibrary(props: SearchParams) {
  const filters = await props.searchParams;
  const subject = filters.subject ? filters.subject : "";
  const topic = filters.topic ? filters.topic : "";
  const companions = await getAllCompanions({ subject, topic });

  return (
    <SavedCompanionsProvider>
      <CompanionsLibraryClient initialCompanions={companions} />
    </SavedCompanionsProvider>
  );
}