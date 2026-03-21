import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';
import { Article } from '@/store/bookmarkStore';
import { LinearGradient } from 'expo-linear-gradient';

interface TrendingCardProps {
  article: Article;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

export default function TrendingCard({ article, onPress }: TrendingCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <ImageBackground
        source={{ uri: article.imageUrl }}
        style={styles.container}
        imageStyle={{ borderRadius: 24 }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{article.category}</Text>
          </View>
          
          <Text style={styles.title} numberOfLines={3}>{article.title}</Text>
          
          <View style={styles.footer}>
            <Text style={styles.author}>{article.author}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.time}>{article.readTime}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: 220,
    marginRight: SIZES.md,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  gradient: {
    flex: 1,
    borderRadius: 24,
    padding: SIZES.lg,
    justifyContent: 'flex-end',
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: SIZES.sm,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: SIZES.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  author: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.8,
  },
  dot: {
    color: COLORS.white,
    fontSize: 12,
    marginHorizontal: 8,
    opacity: 0.8,
  },
  time: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.8,
  },
});
