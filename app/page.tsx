import { createClient } from "@/utils/supabase/server";
import { ChordSheetGrid } from "../components/chord-sheet-grid";
import { redirect } from "next/navigation";

type HomePageProps = {
  searchParams: Promise<{
    page: number;
    q: string;
  }>;
};

export default async function Page(props: HomePageProps) {
  const searchParams = await props.searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-background dark">
      <div className="md:mt-4">
        <ChordSheetGrid searchParams={searchParams} />
      </div>
    </main>
  );
}
