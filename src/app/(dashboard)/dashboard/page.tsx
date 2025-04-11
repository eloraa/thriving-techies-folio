import { buttonVariants } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { SearchIcon, UserIcon } from 'lucide-react';

export default function Dasboard() {
  return (
    <main className="py-4">
      <div className="flex items-center justify-between md:pr-14">
        <h1 className="md:text-lg">Posts</h1>

        <div className="-mx-2">
          <Select defaultValue="all">
            <SelectTrigger
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'focus:ring-0 !ring-0 focus-visible:right-0 focus-within:ring-0 !border-0 focus:border-0 focus-within:border-0 focus-visible:border-0 hover:text-foreground text-foreground/80 font-semibold rounded-full'
              )}
            >
              <UserIcon />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end" className="p-0.5">
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="only_me">Only Me</SelectItem>
              <SelectSeparator />
              <SelectItem value="specific">
                <div className="flex items-center flex-row gap-2 w-full">
                  <SearchIcon className="size-4" />
                  Specific User
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </main>
  );
}
