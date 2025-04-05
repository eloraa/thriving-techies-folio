import { Github } from '@/components/ui/icons';
import { Title } from '@/components/ui/title';
import { AsciiDisplay } from './ascii-display';
import { ScrollTriggerWrapper } from './scrolltrigger-wrapper';

import { readFileSync } from 'fs';
import Image from 'next/image';
import { join } from 'path';

const basePath = join(process.cwd(), '/src/components/main/team');

export const team = [
  {
    name: 'Rijwan',
    role: 'Chatbot Developer',
    image: '/images/team/rijwan.png',
    ascii: readFileSync(join(basePath, 'rijwan.txt'), 'utf-8'),
  },
  {
    name: 'Parves',
    role: 'Frontend Developer',
    image: '/images/team/parves.png',
    ascii: readFileSync(join(basePath, 'parves.txt'), 'utf-8'),
  },
  {
    name: 'Rabib',
    role: 'Backend Developer',
    image: '/images/team/rabib.png',
    ascii: readFileSync(join(basePath, 'rabib.txt'), 'utf-8'),
  },
  {
    name: 'Raihan',
    role: 'Graphic Designer',
    image: '/images/team/raihan.png',
    ascii: readFileSync(join(basePath, 'raihan.txt'), 'utf-8'),
  },
  {
    name: 'Hasib',
    role: 'Web Designer',
    image: '/images/team/hasib.png',
    ascii: readFileSync(join(basePath, 'hasib.txt'), 'utf-8'),
  },
  {
    name: 'Naim',
    role: 'IT Enthusiast',
    image: '/images/team/naim.png',
    ascii: readFileSync(join(basePath, 'naim.txt'), 'utf-8'),
  },
  {
    name: 'Sajib',
    role: 'Chatbot Designer',
    image: '/images/team/sajib.png',
    ascii: readFileSync(join(basePath, 'sajib.txt'), 'utf-8'),
  },
  {
    name: 'Sakib',
    role: 'Web Developer',
    image: '/images/team/sakib.png',
    ascii: readFileSync(join(basePath, 'sakib.txt'), 'utf-8'),
  },
  {
    name: 'Elora',
    role: 'Frontend Developer | UI/UX Designer',
    image: '/images/team/elora.png',
    ascii: readFileSync(join(basePath, 'elora.txt'), 'utf-8'),
    links: [
      {
        label: 'GitHub',
        icon: Github,
        url: 'https://github.com/eloraa',
      },
    ],
  },
];

export const Team = () => {
  return (
    <section id="team" className="container py-8 md:py-20">
      <Title>Meet our team</Title>
      <div className="mt-6">
        <ScrollTriggerWrapper>
          {team.map((member, i) => (
            <div key={i} className="flex-shrink-0 w-[300px] flex flex-col gap-2 overflow-hidden">
              <figure className="bg-[#4CAF50] dark:bg-[#009688] dark:text-background flex items-center justify-center overflow-hidden group h-[19rem] md:h-[21rem] relative hover:bg-accent/5 transition-colors">
                <div className="aspect-[67/76] overflow-hidden w-full h-full flex items-center justify-center">
                  <AsciiDisplay ascii={member.ascii} />
                </div>
                <Image src={member.image} alt={member.name} fill className="group-hover:opacity-100 transition-all object-contain opacity-0 pointer-events-none" />
              </figure>
              <div>
                <h3 className="dark:font-medium font-semibold">{member.name}</h3>
                <p className="text-muted-foreground text-xs md:text-sm font-unifont">{member.role}</p>
                {member.links && member.links.length && (
                  <ul className="flex items-center gap-2 mt-2">
                    {member.links.map((link, i) => (
                      <li key={i}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-accent">
                          <link.icon className="w-4 h-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </ScrollTriggerWrapper>
      </div>
    </section>
  );
};
