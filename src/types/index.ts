export type Permission = 'read' | 'write' | 'delete' | 'change_status' | '*';
export type User = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  email: string;
  bio: string;
  role: string;
  permissions: Permission[];
  website: string;
  createdAt: string;
  updatedAt: string;
  socials: { type: string; url: string }[];
};
