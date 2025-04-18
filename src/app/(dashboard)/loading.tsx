import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <main className="fixed flex items-center justify-center inset-0 z-50">
      <Spinner className="size-10" />
    </main>
  );
}
