import { Article } from '../store/bookmarkStore';

export const CATEGORIES = ['All', 'Technology', 'Business', 'Sports', 'Entertainment', 'Science'];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Future of AI: How Neural Networks are Changing the World',
    author: 'Sarah Jenkins',
    source: 'Tech Insider',
    publishedAt: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80',
    content: 'Artificial intelligence is rapidly evolving. Neural networks and large language models are transforming how we work, communicate, and solve complex problems. From generative art to advanced medical research, the implications are profound...',
    url: 'https://example.com/ai-future',
    category: 'Technology',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'Global Markets Rally as Inflation Cools Down',
    author: 'James Wright',
    source: 'Financial Times',
    publishedAt: '5 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a223690?auto=format&fit=crop&q=80',
    content: 'Stock markets around the world saw significant gains today following new data suggesting that inflation might finally be under control. Investors are optimistic about the upcoming quarter...',
    url: 'https://example.com/markets',
    category: 'Business',
    readTime: '4 min read'
  },
  {
    id: '3',
    title: 'Championship Finals: A Historic Victory for the Underdogs',
    author: 'Michael Bradley',
    source: 'Sports Network',
    publishedAt: '12 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80',
    content: 'In an unprecedented turn of events, the underdog team secured a historic victory in last night\'s championship... The atmosphere in the stadium was electric as the final whistle blew.',
    url: 'https://example.com/sports-finals',
    category: 'Sports',
    readTime: '7 min read'
  },
  {
    id: '4',
    title: 'New Exoplanet Discovered in Habitable Zone',
    author: 'Dr. Elena Rossi',
    source: 'Space Daily',
    publishedAt: '1 day ago',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    content: 'Astronomers using the James Webb Space Telescope have identified a new exoplanet situated in the habitable zone of its star. The planet, named Kepler-452b-prime, exhibits signs of water vapor...',
    url: 'https://example.com/space',
    category: 'Science',
    readTime: '6 min read'
  },
  {
    id: '5',
    title: 'Summer Blockbuster Breaks Box Office Records',
    author: 'Amanda Klein',
    source: 'Hollywood Reporter',
    publishedAt: '2 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80',
    content: 'This weekend\'s premier of the highly anticipated action movie broke multiple box office records. Audiences are praising the stunning visual effects and compelling storyline...',
    url: 'https://example.com/movie',
    category: 'Entertainment',
    readTime: '3 min read'
  }
];

export const TRENDING_ARTICLES = MOCK_ARTICLES.slice(0, 3);
