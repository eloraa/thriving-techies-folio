import Image from 'next/image';
import { Share } from './share';
import { MarkdownPreview } from '@/components/markdown/markdown';
import { blog } from './blog';
import Link from 'next/link';
import { TextToSpeech } from '@/app/(main)/blog/[slug]/text-to-speech';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  console.log(slug);

  return (
    <main className="container py-10 md:max-w-3xl mx-auto">
      <div className="flex items-center justify-center flex-col border-b pb-8 border-foreground/15">
        <figure className="relative h-72 w-full md:max-w-lg overflow-hidden rounded-2xl">
          <Image className="object-contain" src="/images/cover2.png" fill alt="Pixels and Poetry: The Beauty of Shaders in Digital Art" />
        </figure>
        <div className="space-y-2">
          <h1 className="text-center mt-8 text-lg lg:text-3xl font-semibold max-w-lg mx-auto">Pixels and Poetry: The Beauty of Shaders in Digital Art</h1>
          <div className="flex items-center gap-2 justify-center">
            <p className="text-center py-1 text-sm text-foreground/80">March 14, 2024</p>
            <span className="h-4 border-l border-accent/15"></span>
            <p className="text-center py-1 text-sm text-foreground/80">
              By{' '}
              <Link href="/profile/elora" className="font-medium text-primary">
                Elora
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-6 flex-wrap text-center justify-center text-sm uppercase font-mono text-foreground/50 font-medium">
            <p>Shader</p>
            <p>WebGL</p>
            <p>Math</p>
          </div>
        </div>
      </div>

      <div className="py-3 flex items-center justify-between">
        <TextToSpeech text={decodeURIComponent(blog)} />
        <Share content={typeof window !== 'undefined' ? window.location.href : ''} />
      </div>

      <div className="mt-10">
        <MarkdownPreview content={decodeURIComponent(blog)} />
      </div>
    </main>
  );
}
