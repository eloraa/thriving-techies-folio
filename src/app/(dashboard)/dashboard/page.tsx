import { Filter } from './filter';

export default function Dashboard() {
  return (
    <main className="py-4">
      <div className="flex items-center justify-between md:pr-14">
        <h1 className="md:text-lg">Posts</h1>

        <div className="-mx-2">
          <Filter />
        </div>
      </div>
    </main>
  );
}
