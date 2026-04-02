import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Share } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';
import { Article } from '@/store/bookmarkStore';
import { useThemeStore } from '@/store/themeStore';
import { Bookmark, Clock, Share2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useBookmarkStore } from '@/store/bookmarkStore';

interface ArticleCardProps {
  article: Article;
  onPress: () => void;
  index?: number;
}

export default function ArticleCard({ article, onPress, index = 0 }: ArticleCardProps) {
  const { isDarkMode } = useThemeStore();
  const saved = useBookmarkStore((state) => state.savedArticles.some((a) => a.id === article.id));
  const saveArticle = useBookmarkStore((state) => state.saveArticle);
  const removeArticle = useBookmarkStore((state) => state.removeArticle);

  const textColor = isDarkMode ? COLORS.dark.text : COLORS.text;
  const textSecondaryColor = isDarkMode ? COLORS.dark.textSecondary : COLORS.textSecondary;
  const cardBgColor = isDarkMode ? COLORS.dark.card : COLORS.card;

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (saved) {
      removeArticle(article.id);
    } else {
      saveArticle(article);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this news: ${article.title}\n\n${article.url}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 10) * 100).springify().damping(14)}>
      <TouchableOpacity 
        style={[styles.container, { backgroundColor: cardBgColor }]} 
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        activeOpacity={0.7}
      >
        <Image source={{ uri: article.imageUrl }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.category, { color: COLORS.primary }]}>{article.category}</Text>
          <View style={styles.timeContainer}>
            <Clock size={12} color={textSecondaryColor} style={{ marginRight: 4 }} />
            <Text style={[styles.time, { color: textSecondaryColor }]}>{article.publishedAt}</Text>
          </View>
        </View>
        
        <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
          {article.title}
        </Text>
        
        <View style={styles.footerRow}>
          <Text style={[styles.author, { color: textSecondaryColor }]}>By {article.author}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity 
              onPress={handleShare} 
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ marginRight: 16 }}
            >
              <Share2 size={18} color={textSecondaryColor} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleBookmark} 
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {saved ? (
                <Bookmark size={20} color={COLORS.primary} strokeWidth={2} fill={COLORS.primary} />
              ) : (
                <Bookmark size={20} color={COLORS.primary} strokeWidth={2} fill="transparent" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: SIZES.md,
    padding: SIZES.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    marginLeft: SIZES.sm,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  author: {
    fontSize: 13,
    fontWeight: '500',
  },
});
