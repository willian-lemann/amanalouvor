import { ChordSheetGrid } from "../components/chord-sheet-grid";

type HomePageProps = {
  searchParams: Promise<{
    page: number;
    q: string;
  }>;
};

export default async function Page(props: HomePageProps) {
  const searchParams = await props.searchParams;

  return (
    <main className="min-h-screen bg-background dark">
      <div className="md:mt-4">
        <ChordSheetGrid searchParams={searchParams} />
      </div>
    </main>
  );
}
