import { Button } from '@/components/ui/button';
import { Title } from '@/components/ui/title';
import { generateColor } from '@/lib/utils';
import { formatDistance } from 'date-fns';
import Link from 'next/link';

const randomDate = () => {
  const start = new Date('2020-01-01');
  const end = new Date('2025-01-01');
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const posts = [
  {
    title: 'Pixels and Poetry: The Beauty of Shaders in Digital Art',
    created_at: randomDate(),
  },
  {
    title: 'The Fusion of Programming and Math Exploring the Synergy',
    created_at: randomDate(),
  },
  {
    title: 'Cracking the Code: Mathematics in Programming',
    created_at: randomDate(),
  },
  {
    title: 'From Algorithms to Equations: Bridging the Gap Between Math...',
    created_at: randomDate(),
  },
  {
    title: 'Decoding Logic: How Math Powers Modern Software',
    created_at: randomDate(),
  },
  {
    title: 'Data Structures Through a Mathematical Lens',
    created_at: randomDate(),
  },
  {
    title: 'The Art of Problem Solving in Code and Calculus',
    created_at: randomDate(),
  },
  {
    title: 'Why Every Developer Should Learn Discrete Math',
    created_at: randomDate(),
  },
  {
    title: 'Math Behind Machine Learning Algorithms',
    created_at: randomDate(),
  },
  {
    title: 'Code, Curves, and Calculations: A Developer’s Guide to Math',
    created_at: randomDate(),
  },
  {
    title: 'From Zeroes to Ones: Understanding Binary with Math',
    created_at: randomDate(),
  },
];

export const BlogSection = () => {
  return (
    <section id="blog" className="container py-8 md:py-20">
      <Title>Our Blog</Title>

      <div className="mt-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post, index) => (
            <div key={index} className="flex flex-col border border-foreground/15">
              <figure className="h-64 md:h-72" style={{ backgroundColor: generateColor() }}>
                {/* image goes here */}
              </figure>
              <div className="space-y-2 p-4">
                <Link href="/blog/pixels-and-poetry">{post.title}</Link>
                <p className="text-sm text-foreground/80">
                  By{' '}
                  <Link href="/profile/elora" className="font-medium text-primary">
                    Elora
                  </Link>
                </p>
                <h4 className="font-mono text-xs uppercase">{formatDistance(post.created_at, new Date(), { addSuffix: true })}</h4>
              </div>
            </div>
          ))}
        </div>
        <div className="flex text-center justify-center mt-8">
          <Button className="font-mono uppercase" variant="outline" asChild>
            <Link href="/blogs">View All</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
