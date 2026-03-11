import type { PropsWithChildren } from 'react';

export function Card({ children }: PropsWithChildren) {
  return <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">{children}</section>;
}
