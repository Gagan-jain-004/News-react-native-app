import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, interpolate, Extrapolation } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bookmark, BookmarkCheck, PlayCircle, StopCircle } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { COLORS, SIZES } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { Article } from '@/store/bookmarkStore';
import { NewsAPI } from '@/utils/api';
import TrendingCard from '@/components/TrendingCard';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 380;

export default function ArticleDetailScreen() {
  const { id, articleData } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const { isSaved, saveArticle, removeArticle } = useBookmarkStore();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const scrollY = useSharedValue(0);
  const scrollProgress = useSharedValue(0);

  const bgColor = isDarkMode ? COLORS.dark.background : COLORS.background;
  const textColor = isDarkMode ? COLORS.dark.text : COLORS.text;
  const textSecondaryColor = isDarkMode ? COLORS.dark.textSecondary : COLORS.textSecondary;
  const dividerColor = isDarkMode ? COLORS.dark.border : COLORS.border;

  useEffect(() => {
    const fetchArticle = async () => {
      let dataToUse: Article | null = null;
      if (articleData && typeof articleData === 'string') {
        try {
          dataToUse = JSON.parse(articleData);
        } catch (e) {
          console.error('Failed to parse article data', e);
        }
      }
      
      if (!dataToUse && id && typeof id === 'string') {
        dataToUse = await NewsAPI.getArticleById(id) || null;
      }
      
      if (dataToUse) {
        setArticle(dataToUse);
        try {
          const related = await NewsAPI.getNewsByCategory(dataToUse.category, 1);
          setRelatedArticles(related.filter(a => a.id !== dataToUse!.id).slice(0, 5));
        } catch(e) {}
      }
      
      setLoading(false);
    };
    fetchArticle();

    // Cleanup speech on unmount
    return () => {
      Speech.stop();
    };
  }, [id, articleData]);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
    const scrollableHeight = event.contentSize.height - event.layoutMeasurement.height;
    if (scrollableHeight > 0) {
      scrollProgress.value = Math.max(0, Math.min(1, event.contentOffset.y / scrollableHeight));
    }
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${scrollProgress.value * 100}%`,
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-100, 0, HEADER_HEIGHT],
            [-50, 0, HEADER_HEIGHT * 0.5],
            Extrapolation.CLAMP
          )
        },
        {
          scale: interpolate(
            scrollY.value,
            [-100, 0],
            [1.5, 1],
            Extrapolation.CLAMP
          )
        }
      ]
    };
  });

  const handleBookmark = () => {
    if (!article) return;
    if (isSaved(article.id)) {
      removeArticle(article.id);
    } else {
      saveArticle(article);
    }
  };

  const handleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else if (article) {
      setIsSpeaking(true);
      Speech.speak(`${article.title}. ${article.content}`, {
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    }
  };

  if (loading || !article) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const saved = isSaved(article.id);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + SIZES.xl }}
      >
        <Animated.View style={[styles.imageContainer, headerAnimatedStyle]}>
          <Image source={{ uri: article.imageUrl }} style={styles.image} />
          <View style={styles.overlay} />
        </Animated.View>

        <View style={[styles.contentContainer, { backgroundColor: bgColor }]}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{article.category}</Text>
          </View>
          
          <Text style={[styles.title, { color: textColor }]}>{article.title}</Text>
          
          <View style={styles.metaRow}>
            <Image source={{ uri: `https://ui-avatars.com/api/?name=${article.author.split(' ').join('+')}&background=random` }} style={styles.authorAvatar} />
            <View>
              <Text style={[styles.authorName, { color: textColor }]}>{article.author}</Text>
              <Text style={[styles.dateText, { color: textSecondaryColor }]}>{article.publishedAt} • {article.readTime}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          <Text style={[
            styles.content, 
            { color: textColor, fontSize: 18, lineHeight: 30 }
          ]}>
            {article.content}
          </Text>

          {article.url && (
            <TouchableOpacity 
              style={[styles.sourceButton, { borderTopColor: dividerColor }]}
              onPress={async () => {
                const WebBrowser = await import('expo-web-browser');
                WebBrowser.openBrowserAsync(article.url);
              }}
            >
              <Text style={[styles.sourceText, { color: textSecondaryColor }]}>
                Tap to read full story at {article.source}
              </Text>
            </TouchableOpacity>
          )}

          {relatedArticles.length > 0 && (
            <View style={{ marginTop: SIZES.xxl, paddingTop: SIZES.lg, borderTopWidth: 1, borderTopColor: dividerColor }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: textColor, marginBottom: SIZES.md }}>Related News</Text>
              <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SIZES.lg }}>
                {relatedArticles.map((item, index) => (
                  <View key={item.id} style={{ marginLeft: index === 0 ? SIZES.lg : 0, marginRight: index === relatedArticles.length - 1 ? SIZES.lg : 0 }}>
                    <TrendingCard 
                      article={item} 
                      onPress={() => router.replace({ pathname: '/article/[id]' as any, params: { id: item.id, articleData: JSON.stringify(item) } })} 
                    />
                  </View>
                ))}
              </Animated.ScrollView>
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Fixed Header controls */}
      <View style={[styles.headerControls, { paddingTop: insets.top + SIZES.sm }]}>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        <View style={styles.headerRightControls}>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.5)', marginRight: SIZES.sm }]} 
            onPress={handleSpeech}
          >
            {isSpeaking ? (
              <StopCircle size={24} color={COLORS.primary} />
            ) : (
              <PlayCircle size={24} color={COLORS.white} />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]} 
            onPress={handleBookmark}
          >
            {saved ? (
              <BookmarkCheck size={20} color={COLORS.primary} />
            ) : (
              <Bookmark size={20} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Reading Progress Bar */}
      <View style={{ position: 'absolute', top: insets.top + SIZES.sm + 44 + SIZES.sm, left: 0, right: 0, height: 3, backgroundColor: 'rgba(0,0,0,0.1)' }}>
        <Animated.View style={[{ height: '100%', backgroundColor: COLORS.primary }, progressStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width,
    height: HEADER_HEIGHT,
    position: 'absolute',
    top: 0,
    zIndex: -1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  contentContainer: {
    marginTop: HEADER_HEIGHT - 40,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.xl,
    minHeight: Dimensions.get('window').height,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: SIZES.md,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    marginBottom: SIZES.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: SIZES.sm,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginBottom: SIZES.lg,
  },
  content: {
    fontWeight: '400',
  },
  headerControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    zIndex: 10,
  },
  headerRightControls: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceButton: {
    marginTop: SIZES.xl,
    paddingTop: SIZES.lg,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  sourceText: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
});
