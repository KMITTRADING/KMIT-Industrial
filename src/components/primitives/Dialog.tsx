'use client';

import { useCallback, useEffect, useRef } from 'react';

import { Button } from './Button';
import { CloseIcon } from './IconSet';
import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

/**
 * Dialog.
 *
 * Uses the native `<dialog>` element with `showModal()`, which hands the
 * browser four things that are painful to reproduce: the top-layer stacking
 * context (so it can never be clipped by an ancestor's overflow), the focus
 * trap, inert background content, and Escape to close.
 *
 * What the component adds:
 *
 * - Backdrop click closes, but only when the click actually lands on the
 *   backdrop. A pointerdown inside the panel that drifts outside on release
 *   must not dismiss the dialog, which is the classic accidental-close bug.
 * - Body scroll is locked while open.
 * - A dialog is the one component allowed the system's single shadow, because
 *   it is the one thing that genuinely floats above the page.
 */

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  closeLabel: string;
  className?: string;
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  closeLabel,
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const pointerDownOnBackdrop = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape fires the element's own `cancel`/`close`; mirror it into React state.
  const handleClose = useCallback(() => {
    if (open) onClose();
  }, [onClose, open]);

  return (
    <dialog
      ref={ref}
      onClose={handleClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onPointerDown={(event) => {
        pointerDownOnBackdrop.current = event.target === ref.current;
      }}
      onClick={(event) => {
        if (pointerDownOnBackdrop.current && event.target === ref.current) onClose();
        pointerDownOnBackdrop.current = false;
      }}
      aria-labelledby="dialog-title"
      aria-describedby={description ? 'dialog-description' : undefined}
      className={cn(
        'm-auto w-[min(34rem,calc(100vw-2rem))] rounded-md p-0',
        'border border-border-default bg-surface-page text-ink-primary shadow-raised',
        'backdrop:bg-neutral-950/45',
        'open:animate-none',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border-subtle p-6">
        <div>
          <h2 id="dialog-title" className="text-lg font-semibold text-ink-primary">
            {title}
          </h2>
          {description ? (
            <p id="dialog-description" className="mt-2 text-sm text-ink-secondary">
              {description}
            </p>
          ) : null}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label={closeLabel}
          className="-me-2 -mt-2 min-h-11 px-2"
        >
          <CloseIcon className="size-4" />
        </Button>
      </div>

      {children ? (
        <div className="measure-prose p-6 text-sm text-ink-secondary">{children}</div>
      ) : null}

      {footer ? (
        <div className="flex flex-wrap justify-end gap-3 border-t border-border-subtle p-6">
          {footer}
        </div>
      ) : null}
    </dialog>
  );
}

export default Dialog;
