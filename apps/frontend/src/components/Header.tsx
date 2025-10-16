import { useTheme } from '../theme/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Activate ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 transition hover:border-emerald-500 hover:text-emerald-500 dark:border-slate-600 dark:text-slate-100 dark:hover:border-emerald-400"
    >
      <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
      {theme === 'dark' ? 'Dark' : 'Light'} mode
    </button>
  );
};

export const Header = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/30 bg-slate-50/80 backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-300">
            Art Explorer
          </span>
          <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            The Met Collection
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};
