import { Fragment, type ReactNode } from 'react';
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface FilterDrawerProps {
  title?: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const FilterDrawer = ({
  title = 'Filters',
  description,
  isOpen,
  onClose,
  children
}: FilterDrawerProps) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-30">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
        </TransitionChild>
        <div className="fixed inset-0 flex justify-end">
          <TransitionChild
            as={Fragment}
            enter="transform transition ease-out duration-200"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in duration-150"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="flex h-full w-full max-w-md flex-col bg-white shadow-xl dark:bg-slate-950">
              <header className="flex items-start justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                <div>
                  <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {title}
                  </DialogTitle>
                  {description ? (
                    <Description className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {description}
                    </Description>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label="Close filters"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>

              <footer className="border-t border-slate-200 px-6 py-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-full border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                >
                  Close
                </button>
              </footer>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
