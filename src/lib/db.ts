import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface Post {
  id: string;
  title: string;
  content: string;
  coverPhoto: string | null;
  tags: string[];
  slug: string;
  status: 'draft' | 'published';
  createdAt: number;
  updatedAt: number;
}

interface MyDB extends DBSchema {
  posts: {
    key: string;
    value: Post;
    indexes: {
      'by-slug': string;
    };
  };
  currentDraft: {
    key: string;
    value: Post;
  };
}

let db: IDBPDatabase<MyDB> | null = null;

const initDB = async () => {
  if (db) return db;

  db = await openDB<MyDB>('thriving-techies', 2, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (oldVersion === 0) {
        const postsStore = db.createObjectStore('posts', { keyPath: 'id' });
        postsStore.createIndex('by-slug', 'slug', { unique: true });
        db.createObjectStore('currentDraft', { keyPath: 'id' });
        return;
      }

      if (oldVersion === 1) {
        const postsStore = transaction.objectStore('posts');
        if (!postsStore.indexNames.contains('by-slug')) {
          postsStore.createIndex('by-slug', 'slug', { unique: true });
        }
      }
    },
  });

  return db;
};

export const savePost = async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
  const dbInstance = await initDB();
  const tx = dbInstance.transaction(['posts', 'currentDraft'], 'readwrite');
  const postsStore = tx.objectStore('posts');
  const draftStore = tx.objectStore('currentDraft');
  
  try {
    // Try to find existing post by slug
    const slugIndex = postsStore.index('by-slug');
    const existingPost = await slugIndex.get(post.slug);
    
    let savedPost: Post;
    if (existingPost) {
      // Update existing post
      savedPost = {
        ...existingPost,
        ...post,
        updatedAt: Date.now(),
      };
      await postsStore.put(savedPost);
    } else {
      // Create new post
      const id = crypto.randomUUID();
      savedPost = {
        ...post,
        id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await postsStore.put(savedPost);
    }

    // If this is a draft, also save it as the current draft
    if (post.status === 'draft') {
      const currentDraftData: Post = {
        ...savedPost,
        id: 'current'
      };
      await draftStore.put(currentDraftData);
    } else {
      // If publishing, clear the current draft
      await draftStore.delete('current');
    }

    await tx.done;
    return savedPost;
  } catch (error) {
    tx.abort();
    throw error;
  }
};

export const saveCurrentDraft = async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
  const dbInstance = await initDB();
  const tx = dbInstance.transaction(['currentDraft', 'posts'], 'readwrite');
  const store = tx.objectStore('currentDraft');
  const postsStore = tx.objectStore('posts');
  
  try {
    const slugIndex = postsStore.index('by-slug');
    const existingPost = await slugIndex.get(post.slug);
    
    const postData: Post = {
      ...post,
      id: 'current',
      createdAt: existingPost?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    
    await store.put(postData);
    await tx.done;
    return postData;
  } catch (error) {
    tx.abort();
    throw error;
  }
};

export const getCurrentDraft = async () => {
  const dbInstance = await initDB();
  const tx = dbInstance.transaction('currentDraft', 'readonly');
  const store = tx.objectStore('currentDraft');
  const draft = await store.get('current');
  return draft;
};

export const deleteCurrentDraft = async () => {
  const dbInstance = await initDB();
  const tx = dbInstance.transaction('currentDraft', 'readwrite');
  const store = tx.objectStore('currentDraft');
  await store.delete('current');
  await tx.done;
};

export const getAllPosts = async () => {
  const dbInstance = await initDB();
  const tx = dbInstance.transaction('posts', 'readonly');
  const store = tx.objectStore('posts');
  return store.getAll();
};

export const getPost = async (id: string) => {
  const dbInstance = await initDB();
  const tx = dbInstance.transaction('posts', 'readonly');
  const store = tx.objectStore('posts');
  return store.get(id);
};

export const updatePost = async (id: string, post: Partial<Post>) => {
  const db = await initDB();
  const existingPost = await db.get('posts', id);

  if (!existingPost) return null;

  const updatedPost = {
    ...existingPost,
    ...post,
    updatedAt: Date.now(),
  };

  await db.put('posts', updatedPost);
  return updatedPost;
};

export const deletePost = async (ids: string | string[]) => {
  const dbInstance = await initDB();
  const tx = dbInstance.transaction(['posts', 'currentDraft'], 'readwrite');
  const postsStore = tx.objectStore('posts');
  const draftStore = tx.objectStore('currentDraft');

  try {
    if (Array.isArray(ids)) {
      // Delete multiple posts
      await Promise.all(ids.map(id => postsStore.delete(id)));
      
      // If current draft is one of the deleted posts, delete it too
      const currentDraft = await draftStore.get('current');
      if (currentDraft && ids.includes(currentDraft.id)) {
        await draftStore.delete('current');
      }
    } else {
      // Delete single post
      await postsStore.delete(ids);
      
      // If current draft is the deleted post, delete it too
      const currentDraft = await draftStore.get('current');
      if (currentDraft && currentDraft.id === ids) {
        await draftStore.delete('current');
      }
    }
    
    await tx.done;
  } catch (error) {
    tx.abort();
    throw error;
  }
};
