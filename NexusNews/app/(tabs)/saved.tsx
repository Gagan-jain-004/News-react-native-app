import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BookmarkX, Trash2 } from 'lucide-react-native';
import { COLORS, SIZES } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';
import { useBookmarkStore, Article } from '@/store/bookmarkStore';
import ArticleCard from '@/components/ArticleCard';

export default function SavedScreen() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const { savedArticles, clearAll } = useBookmarkStore();

  const bgColor = isDarkMode ? COLORS.dark.background : COLORS.background;
  const textColor = isDarkMode ? COLORS.dark.text : COLORS.text;
  const textSecondaryColor = isDarkMode ? COLORS.dark.textSecondary : COLORS.textSecondary;

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
        <View>
          <Text style={[styles.title, { color: textColor }]}>Saved</Text>
          <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
            {savedArticles.length} {savedArticles.length === 1 ? 'article' : 'articles'}
          </Text>
        </View>
        
        {savedArticles.length > 0 && (
          <TouchableOpacity onPress={clearAll} style={styles.clearBtn}>
            <Trash2 size={20} color={COLORS.error} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={savedArticles}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ArticleCard article={item} onPress={() => handleArticlePress(item)} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.iconBox, { backgroundColor: isDarkMode ? COLORS.dark.card : COLORS.white }]}>
              <BookmarkX size={48} color={COLORS.textSecondary} opacity={0.5} />
            </View>
            <Text style={[styles.emptyTitle, { color: textColor }]}>No saved articles yet</Text>
            <Text style={[styles.emptySubtitle, { color: textSecondaryColor }]}>
              Articles you bookmark will appear here so you can read them later, even offline.
            </Text>
            <TouchableOpacity 
              style={styles.exploreBtn}
              onPress={() => router.replace('/(tabs)/discover')}
            >
              <Text style={styles.exploreBtnText}>Explore News</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  clearBtn: {
    padding: 8,
    backgroundColor: `${COLORS.error}15`,
    borderRadius: 12,
  },
  listContent: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: 100,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
    marginTop: SIZES.xxl * 2,
  },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SIZES.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SIZES.xl,
  },
  exploreBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.xl,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  exploreBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
