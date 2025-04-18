import { Dribbble, Github, Instagram, LinkedIn, Mastodon, Twitter } from '@/components/ui/icons';

export const getSocialIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'github':
      return Github;
    case 'linkedin':
      return LinkedIn;
    case 'twitter':
      return Twitter;
    case 'dribbble':
      return Dribbble;
    case 'instagram':
      return Instagram;
    case 'mastodon':
      return Mastodon;
    default:
      return null;
  }
};
