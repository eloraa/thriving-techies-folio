import { Filter } from './filter';

export const users = [
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8',
    name: 'Elora',
    username: 'elora',
    avatar: '/elora.png',
    posts: 14,
  },
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d9',
    name: 'John Doe',
    username: 'johndoe',
    avatar: '/john.png',
    posts: 4,
  },
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d0',
    name: 'Neon',
    username: 'neon',
    avatar: '/neon.png',
    posts: 0,
  },
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d2',
    name: 'Jane Doe',
    username: 'janedoe',
    avatar: '/jane.png',
    posts: 0,
  },
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d3',
    name: 'John Smith',
    username: 'johnsmith',
    avatar: '/john.png',
    posts: 0,
  },
];

export const posts = [
  // Elora's posts (14)
  { id: 'post-1', title: 'Morning vibes 🌅', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-10T08:00:00Z' },
  { id: 'post-2', title: 'Coffee time ☕', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-10T09:30:00Z' },
  { id: 'post-3', title: 'Nature walk 🍃', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-09T14:20:00Z' },
  { id: 'post-4', title: 'Sketch dump ✏️', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-08T18:10:00Z' },
  { id: 'post-5', title: 'Mood board 💭', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-08T10:00:00Z' },
  { id: 'post-6', title: 'Throwback to last weekend 🌊', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-07T11:00:00Z' },
  { id: 'post-7', title: 'What I’m reading 📚', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-06T16:45:00Z' },
  { id: 'post-8', title: 'Late night sketching 🎨', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-05T22:15:00Z' },
  { id: 'post-9', title: 'Rainy day playlist ☔', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-04T14:00:00Z' },
  { id: 'post-10', title: 'Workspace setup 💻', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-04T08:40:00Z' },
  { id: 'post-11', title: 'Trying a new art style 🖌️', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-03T17:00:00Z' },
  { id: 'post-12', title: 'Lunch spot find 🥗', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-02T12:30:00Z' },
  { id: 'post-13', title: 'Art book recs ✨', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-01T15:20:00Z' },
  { id: 'post-14', title: 'Sunset timelapse 🌇', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-03-31T19:50:00Z' },

  // John Doe's posts (4)
  { id: 'post-15', title: 'First post! 👋', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d9', created_at: '2025-04-10T12:00:00Z' },
  { id: 'post-16', title: 'Weekend hike 🥾', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d9', created_at: '2025-04-09T08:30:00Z' },
  { id: 'post-17', title: 'Random thoughts 💭', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d9', created_at: '2025-04-08T19:00:00Z' },
  { id: 'post-18', title: 'Favorite movie scenes 🎬', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d9', created_at: '2025-04-07T21:15:00Z' },
];

export default function Dashboard() {
  return (
    <main className="py-4">
      <div className="flex items-center justify-between md:pr-14">
        <h1 className="md:text-lg">Posts</h1>

        <div className="-mx-2">
          <Filter />
        </div>
      </div>

      <div className="grid"></div>
    </main>
  );
}
