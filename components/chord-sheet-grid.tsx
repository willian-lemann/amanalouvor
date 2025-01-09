import { createClient } from "@/utils/supabase/server";
import { ChordSheetItem } from "./chord-sheet-item";
import { UploadButton } from "./upload-button";
import { getChords } from "@/actions/file-actions";
import { Search } from "./search";

type ChordSheetGridProps = {
  searchParams: { page: number; q: string };
};

export async function ChordSheetGrid({ searchParams }: ChordSheetGridProps) {
  const { page, q } = searchParams;
  const { data, error } = await getChords({ page, query: q });

  return (
    <div className="bg-background text-foreground ">
      <div className="flex items-center justify-between mb-6 gap-10 mx-4 md:mx-0">
        <Search />
        <UploadButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {!data || error
          ? null
          : data.map((sheet) => (
              <ChordSheetItem key={sheet.id} sheet={sheet} />
            ))}
      </div>
    </div>
  );
}
