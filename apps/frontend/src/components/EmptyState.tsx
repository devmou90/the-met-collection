interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>
      {action ?? null}
    </div>
  );
};
