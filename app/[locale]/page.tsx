import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/locales';
import { StrataRule } from '@/components/ui/StrataRule';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Step 1 shell only — the seven sections land in step 3, once the typed
  // content layer exists. This renders the primitives so the token layer,
  // the type scale and both directions can be checked before anything is
  // built on top of them.
  return (
    <main className="content section-y">
      <Label index="01">Shell check</Label>
      <h1 className="t-display-xl mt-6">Materials.</h1>
      <p className="t-body-l text-ink-soft mt-6 max-w-[46ch]">
        Token layer, type scale and layout primitives. Sections follow.
      </p>
      <StrataRule className="my-12" />
      <Button href="#">Discuss a project</Button>
    </main>
  );
}
