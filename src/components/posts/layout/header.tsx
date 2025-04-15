import { Dropdown } from '@/components/dashboard/layout/dropdown';
import { Button } from '@/components/ui/button';
import { Editable } from '@/components/ui/editable';
import { fakeUser } from '@/lib/const';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="sticky top-0 px-2 md:px-4 py-1 border-b border-accent/10 container">
      <div className="flex items-center justify-between">
        <div className="flex w-12">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/published">
              <ArrowLeft />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
        </div>
        <div className="min-w-0 overflow-hidden px-4 truncate absolute left-1/2 -translate-x-1/2 max-w-[calc(100%-5rem)]">
          <Editable placeholder="Title" />
        </div>
        <div className="flex w-12 justify-end">
          <Dropdown user={fakeUser} />
        </div>
      </div>
    </header>
  );
};
