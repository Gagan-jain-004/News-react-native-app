import { Article } from '../store/bookmarkStore';
import { MOCK_ARTICLES } from './mockData';
import axiosClient from './axiosClient';

const mapGNewsToArticle = (article: any, defaultCategory: string): Article => {
  return {
    id: (article.url || Math.random().toString(36).substring(7)).replace(/[^a-zA-Z0-9]/g, ''),
    title: article.title,
    author: article.source.name,
    source: article.source.name,
    publishedAt: (() => {
      try {
        if (!article.publishedAt) return 'Just now';
        const d = new Date(article.publishedAt);
        if (isNaN(d.getTime())) return article.publishedAt;
        return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
      } catch (e) {
        return article.publishedAt || 'Just now';
      }
    })(),
    imageUrl: article.urlToImage || article.image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=60',
    content: (article.content || article.description || '').replace(/\s*\[\+\d+\s*chars\]\s*$/, ''),
    url: article.url,
    category: defaultCategory,
    readTime: `${Math.max(1, Math.floor(Math.random() * 8) + 2)} min read`, // simulated
  };
};

export const NewsAPI = {
  getTopHeadlines: async (): Promise<Article[]> => {
    try {
      const res = await axiosClient.get('/news/trending?max=10');
      return res.data.articles.map((a: any) => mapGNewsToArticle(a, 'General'));
    } catch (e) {
      console.warn('Failed to fetch from backend, returning empty', e);
      return [];
    }
  },
  
  getTrendingNews: async (): Promise<Article[]> => {
    try {
      const res = await axiosClient.get('/news/trending?category=technology&max=5');
      return res.data.articles.map((a: any) => mapGNewsToArticle(a, 'Trending'));
    } catch (e) {
      return [];
    }
  },

  getArticleById: async (id: string): Promise<Article | undefined> => {
    // GNews doesn't support fetch by ID normally, usually we pass the whole article object.
    // For this mockup, if we search by url, we might just return mock if not found in state.
    // Ideally this is handled by Zustand store caching.
    return MOCK_ARTICLES.find(a => a.id === id); 
  },

  getNewsByCategory: async (category: string, page: number = 1): Promise<Article[]> => {
    try {
      if (category === 'All') category = 'general';
      const res = await axiosClient.get(`/news/trending?category=${category.toLowerCase()}&max=10&page=${page}`);
      return res.data.articles.map((a: any) => mapGNewsToArticle(a, category));
    } catch (e) {
      return [];
    }
  },

  searchNews: async (query: string): Promise<Article[]> => {
    try {
      const res = await axiosClient.get(`/news/search?q=${query}&max=10`);
      return res.data.articles.map((a: any) => mapGNewsToArticle(a, 'Search'));
    } catch (e) {
      return [];
    }
  }
};
