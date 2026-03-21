import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Article {
  id: string;
  title: string;
  author: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
  content: string;
  url: string;
  category: string;
  readTime: string;
}

interface BookmarkState {
  savedArticles: Article[];
  saveArticle: (article: Article) => void;
  removeArticle: (id: string) => void;
  clearAll: () => void;
  isSaved: (id: string) => boolean;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      savedArticles: [],
      
      saveArticle: (article) => {
        set((state) => ({
          savedArticles: [...state.savedArticles, article]
        }));
      },
      
      removeArticle: (id) => {
        set((state) => ({
          savedArticles: state.savedArticles.filter(a => a.id !== id)
        }));
      },
      
      clearAll: () => {
        set({ savedArticles: [] });
      },
      
      isSaved: (id) => {
        return get().savedArticles.some(a => a.id === id);
      }
    }),
    {
      name: 'bookmark-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
