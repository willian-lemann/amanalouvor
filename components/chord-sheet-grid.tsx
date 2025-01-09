import { createClient } from "@/utils/supabase/server";
import { ChordSheetItem } from "./chord-sheet-item";
import { UploadButton } from "./upload-button";

interface ChordSheet {
  id: string;
  title: string;
  imageUrl: string;
}

export async function ChordSheetGrid() {
  const client = await createClient();
  const { data, error } = await client.from("musicas").select("*");

  if (!data || error) return null;

  return (
    <div className="bg-background text-foreground ">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Músicas</h1>

        <UploadButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((sheet) => (
          <ChordSheetItem key={sheet.id} sheet={sheet} />
        ))}
      </div>
    </div>
  );
}
