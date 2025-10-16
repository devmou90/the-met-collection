import { Header } from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Header />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16">
        <section className="space-y-4 text-center md:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-300">
            Curated Collections
          </span>
          <h1 className="text-4xl font-bold md:text-5xl">
            Discover masterpieces from The Met
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 md:text-lg">
            Start exploring artworks via the new backend proxy. Gallery, search, and favorites features will slot in here as we wire up the UI.
          </p>
        </section>
        <section className="rounded-2xl border border-dashed border-emerald-400/60 bg-emerald-50/40 p-6 text-sm text-emerald-700 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-emerald-200">
          <h2 className="text-lg font-semibold">Next up</h2>
          <p>Hook the frontend API client into <code className="font-mono text-xs">/api/search</code>, render the first gallery grid, and keep iterating from there.</p>
        </section>
      </main>
    </div>
  )
}

export default App
