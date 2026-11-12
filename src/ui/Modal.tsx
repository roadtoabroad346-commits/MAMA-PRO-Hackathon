import { useEffect, useRef, type ReactNode } from 'react';

export function Modal({ titleId, onDismiss, children, className = '', fallbackFocusId }: {
  titleId: string; onDismiss: () => void; children: ReactNode; className?: string; fallbackFocusId?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const initiator = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const node = dialog.current!;
    const previousOverflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      node.close();
      document.body.style.overflow = previousOverflow;
      const target = initiator?.isConnected ? initiator : fallbackFocusId ? document.getElementById(fallbackFocusId) : null;
      target?.focus({ preventScroll: true });
    };
  }, [fallbackFocusId]);
  return <dialog ref={dialog} className={`modal ${className}`} aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); onDismiss(); }}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onDismiss();
    }}>{children}</dialog>;
}
