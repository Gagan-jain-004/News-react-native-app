import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import { COLORS, SIZES } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';
import { Article } from '@/store/bookmarkStore';
import { NewsAPI } from '@/utils/api';
import ArticleCard from '@/components/ArticleCard';

const POPULAR_TAGS = ['Technology', 'AI', 'Finance', 'Startups', 'Sports', 'Space'];

export default function DiscoverScreen() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const bgColor = isDarkMode ? COLORS.dark.background : COLORS.background;
  const cardBgColor = isDarkMode ? COLORS.dark.card : COLORS.card;
  const textColor = isDarkMode ? COLORS.dark.text : COLORS.text;
  const textSecondaryColor = isDarkMode ? COLORS.dark.textSecondary : COLORS.textSecondary;

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      setLoading(true);
      const data = await NewsAPI.searchNews(text);
      setResults(data);
      setSearched(true);
      setLoading(false);
    } else {
      setResults([]);
      setSearched(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
  };

  const handleArticlePress = (article: Article) => {
    router.push({ 
      pathname: '/article/[id]', 
      params: { 
        id: article.id,
        articleData: JSON.stringify(article)
      } 
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Discover</Text>
        <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
          News from all around the world
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: cardBgColor }]}>
          <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search for articles, topics..."
            placeholderTextColor={COLORS.textSecondary}
            value={query}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!searched && query.length === 0 ? (
        <View style={styles.tagsContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Popular Topics</Text>
          <View style={styles.tagsWrapper}>
            {POPULAR_TAGS.map((tag) => (
              <TouchableOpacity 
                key={tag} 
                style={[styles.tag, { backgroundColor: cardBgColor }]}
                onPress={() => handleSearch(tag)}
              >
                <Text style={{ color: textColor, fontWeight: '500' }}>#{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Search Results</Text>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
          ) : (
            <FlatList
              data={results}
              contentContainerStyle={styles.listContent}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <ArticleCard article={item} onPress={() => handleArticlePress(item)} />
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={{ color: textSecondaryColor, textAlign: 'center' }}>
                    No results found for "{query}".{'\n'}Try another keyword.
                  </Text>
                </View>
              }
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.sm,
    paddingBottom: SIZES.md,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  searchContainer: {
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: SIZES.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: SIZES.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  clearIcon: {
    padding: 4,
  },
  tagsContainer: {
    paddingHorizontal: SIZES.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SIZES.md,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
  },
  listContent: {
    paddingBottom: 100,
  },
  loader: {
    marginTop: SIZES.xl,
  },
  emptyContainer: {
    padding: SIZES.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.xl,
  },
});
