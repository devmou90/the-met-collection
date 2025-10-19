import { NavLink } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../theme/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={`Activate ${isDark ? 'light' : 'dark'} mode`}
      className="relative inline-flex h-9 w-16 items-center rounded-full border border-slate-300 bg-slate-100 transition hover:border-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-slate-600 dark:bg-slate-800"
    >
      <span
        aria-hidden
        className={`pointer-events-none flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition-transform dark:bg-slate-900 ${
          isDark ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        {isDark ? (
          <MoonIcon className="h-4 w-4 text-slate-100" />
        ) : (
          <SunIcon className="h-4 w-4 text-amber-500" />
        )}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute left-2 flex h-5 w-5 items-center justify-center text-slate-500 transition-opacity dark:text-slate-400"
      >
        <SunIcon
          className={`h-4 w-4 ${isDark ? 'opacity-0' : 'opacity-100'}`}
        />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-2 flex h-5 w-5 items-center justify-center text-slate-400 transition-opacity"
      >
        <MoonIcon
          className={`h-4 w-4 ${isDark ? 'opacity-100' : 'opacity-0'}`}
        />
      </span>
    </button>
  );
};

export const Header = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition ${
      isActive
        ? 'bg-emerald-500 text-white shadow-sm dark:bg-emerald-400 dark:text-slate-900'
        : 'text-slate-600 hover:text-emerald-500 dark:text-slate-300 dark:hover:text-emerald-300'
    }`;

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
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navLinkClass} end>
              Explore
            </NavLink>
            <NavLink to="/favorites" className={navLinkClass}>
              Favorites
            </NavLink>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
