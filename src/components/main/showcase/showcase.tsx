import { Title } from '@/components/ui/title';
import Image from 'next/image';

const portfolioItems = [
  { src: '/images/portfolio/web-2.png', alt: 'Web Project 2' },
  { src: '/images/portfolio/web-1.jpg', alt: 'Web Project 1' },
  { src: '/images/portfolio/parves.png', alt: 'Parves Project' },
  { src: '/images/portfolio/nandine.png', alt: 'Nandine Project' },
  { src: '/images/portfolio/graphic-2.png', alt: 'Graphic Design 2' },
  { src: '/images/portfolio/graphic-1.jpg', alt: 'Graphic Design 1' },
  { src: '/images/portfolio/doob.png', alt: 'Doob Project' },
  { src: '/images/portfolio/chatbot-2.png', alt: 'Chatbot Project 2' },
  { src: '/images/portfolio/chatbot-1.png', alt: 'Chatbot Project 1' },
];

export const Showcase = () => {
  return (
    <section id="showcase" className="container py-8">
      <Title>Showcase</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {portfolioItems.map((item, index) => (
          <div
            key={index}
            className="relative aspect-video overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
};
