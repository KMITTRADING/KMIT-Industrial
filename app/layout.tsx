import type { ReactNode } from 'react';

/*
 * The real document shell is app/[locale]/layout.tsx, because `lang` and `dir`
 * differ per locale and both have to be on <html> itself. This root layout
 * exists only because the App Router requires one; it passes its children
 * through untouched.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
