import ListingGenerator from '@/components/ListingGenerator';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-black font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white mt-12">
            E-Com Auto-Lister
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Generate sales-optimized listings for Indonesian Marketplaces
          </p>
        </header>

        <ListingGenerator />
      </div>
    </main>
  );
}
