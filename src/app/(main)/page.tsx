import { About } from '@/components/main/about/about';
import { Banner } from '@/components/main/banner/banner';
import { Marquee } from '@/components/main/marquee/marquee';
import { Showcase } from '@/components/main/showcase/showcase';
import { Team } from '@/components/main/team/team';

export default function Home() {
  return (
    <>
      <Banner />
      <Marquee items={['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind', 'PHP', 'Laravel', 'WordPress', 'Java', 'PostgreSQL']} />
      <About />
      <Team />
      <Showcase />

      <div className="h-[200vh] flex items-center justify-center">TEMP</div>
    </>
  );
}
