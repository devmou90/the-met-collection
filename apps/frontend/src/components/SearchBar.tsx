import { useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  initialQuery: string;
  onSearch: (query: string) => void;
}

export const SearchBar = ({ initialQuery, onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <span className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-300">
        Q
      </span>
      <input
        ref={inputRef}
        type="search"
        placeholder="Search artworks..."
        value={query}
        onChange={event => setQuery(event.target.value)}
        className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      <button
        type="submit"
        className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-300 dark:hover:text-slate-900"
      >
        Search
      </button>
    </form>
  );
};
