import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, RefreshControl, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { Article } from '@/store/bookmarkStore';
import { NewsAPI } from '@/utils/api';
import { CATEGORIES } from '@/utils/mockData';
import ArticleCard from '@/components/ArticleCard';
import TrendingCard from '@/components/TrendingCard';
import { Moon, Sun } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  
  const [trending, setTrending] = useState<Article[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const bgColor = isDarkMode ? COLORS.dark.background : COLORS.background;
  const textColor = isDarkMode ? COLORS.dark.text : COLORS.text;
  const textSecondaryColor = isDarkMode ? COLORS.dark.textSecondary : COLORS.textSecondary;
  const cardBgColor = isDarkMode ? COLORS.dark.card : COLORS.white;

  const fetchData = async (pageNum = 1, isRefresh = false) => {
    try {
      const [trendingData, articlesData] = await Promise.all([
        NewsAPI.getTrendingNews(),
        NewsAPI.getNewsByCategory(activeCategory, pageNum)
      ]);
      setTrending(trendingData);
      if (isRefresh || pageNum === 1) {
        setArticles(articlesData);
      } else {
        setArticles(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          const newArticles = articlesData.filter(a => !existingIds.has(a.id));
          return [...prev, ...newArticles];
        });
      }
      setPage(pageNum);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData(1, true);
  }, [activeCategory]);

  const onRefresh = () => {
    setRefreshing(true);
    const randomPage = Math.floor(Math.random() * 5) + 1;
    fetchData(randomPage, true);
  };

  const handleLoadMore = () => {
    if (!loading && !isFetchingMore && articles.length > 0) {
      setIsFetchingMore(true);
      fetchData(page + 1, false);
    }
  };

  const handleArticlePress = (article: Article) => {
    // Navigate to article detail passing the object
    router.push({ 
      pathname: '/article/[id]', 
      params: { 
        id: article.id,
        articleData: JSON.stringify(article)
      } 
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 17) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={{ color: COLORS.primary, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1 }}>
          {currentDate}
        </Text>
        <Text style={[styles.greeting, { color: textSecondaryColor }]}>
          {getGreeting()}
        </Text>
        <Text style={[styles.username, { color: textColor }]}>
          {user?.name || 'Guest'}
        </Text>
      </View>
      <TouchableOpacity 
        style={[styles.notificationBtn, { backgroundColor: cardBgColor }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          toggleTheme();
        }}
      >
        {isDarkMode ? (
          <Sun size={20} color={COLORS.warning} />
        ) : (
          <Moon size={20} color={COLORS.textSecondary} />
        )}
      </TouchableOpacity>
    </View>
  );

  const renderTrendingSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Trending</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/discover')}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={trending}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrendingCard article={item} onPress={() => handleArticlePress(item)} />
        )}
      />
    </View>
  );

  const renderCategories = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.categoriesContainer}
      contentContainerStyle={{ paddingHorizontal: SIZES.lg }}
    >
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        return (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryPill,
              isActive ? styles.activeCategoryPill : { backgroundColor: isDarkMode ? COLORS.dark.card : COLORS.white }
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text style={[
              styles.categoryText, 
              isActive ? styles.activeCategoryText : { color: textSecondaryColor }
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <FlatList
        data={articles}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderTrendingSection()}
            {renderCategories()}
            <View style={styles.sectionHeaderList}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Recent News</Text>
            </View>
          </>
        }
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ArticleCard article={item} index={index} onPress={() => handleArticlePress(item)} />
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={{ color: textSecondaryColor }}>No articles found for this category.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.sm,
    paddingBottom: SIZES.md,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  username: {
    fontSize: 24,
    fontWeight: '800',
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.error,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  section: {
    marginBottom: SIZES.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.md,
  },
  sectionHeaderList: {
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.sm,
    marginTop: SIZES.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalList: {
    paddingLeft: SIZES.lg,
    paddingRight: SIZES.md,
  },
  categoriesContainer: {
    marginBottom: SIZES.md,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: SIZES.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  activeCategoryPill: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeCategoryText: {
    color: COLORS.white,
  },
  emptyContainer: {
    padding: SIZES.xl,
    alignItems: 'center',
  },
});
