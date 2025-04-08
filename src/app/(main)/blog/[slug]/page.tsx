import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { Share } from './share';
// import Blog from './blog.mdx';
// import { readFileSync } from 'fs';
// import { join } from 'path';
import { MarkdownPreview } from '@/components/markdown/markdown';
import { blog } from './blog';

// const blog = readFileSync(join(process.cwd(), 'src/app/(main)/blog/[slug]/blog.md', 'blog.md'), 'utf-8');

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  console.log(slug);

  return (
    <main className="container py-10 md:max-w-3xl mx-auto">
      <div className="flex items-center justify-center flex-col border-b pb-8 border-foreground/15">
        <figure className="relative h-72 w-full md:max-w-lg overflow-hidden rounded-2xl">
          <Image className="object-cover" src="/images/cover2.png" fill alt="Pixels and Poetry: The Beauty of Shaders in Digital Art" />
        </figure>
        <div className="space-y-2">
          <h1 className="text-center mt-8 text-lg lg:text-3xl font-semibold max-w-lg mx-auto">Pixels and Poetry: The Beauty of Shaders in Digital Art</h1>
          <div className="flex items-center gap-6 flex-wrap text-center justify-center text-sm uppercase font-mono text-foreground/50 font-medium">
            <p>Shader</p>
            <p>WebGL</p>
            <p>Math</p>
          </div>
        </div>
      </div>

      <div className="py-3 flex items-center justify-between">
        <div className="space-x-4 flex items-center">
          <Button variant="ghost" size="sm" className="px-0 h-auto rounded-none">
            <Play />
            Listen to article
          </Button>
          <span className="h-4 border-l border-accent/15"></span>
          <h2 className="text-sm font-mono">05:42:03</h2>
        </div>
        <Share content={typeof window !== 'undefined' ? window.location.href : ''} />
      </div>

      <div className="mt-10">
        <MarkdownPreview content={decodeURIComponent(blog)} />
      </div>
    </main>
  );
}
