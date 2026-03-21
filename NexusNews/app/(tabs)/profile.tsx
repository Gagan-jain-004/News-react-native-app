import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogOut, Bell, Moon, Sun, ChevronRight, User as UserIcon } from 'lucide-react-native';
import { COLORS, SIZES } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  const bgColor = isDarkMode ? COLORS.dark.background : COLORS.background;
  const cardBgColor = isDarkMode ? COLORS.dark.card : COLORS.card;
  const textColor = isDarkMode ? COLORS.dark.text : COLORS.text;
  const textSecondaryColor = isDarkMode ? COLORS.dark.textSecondary : COLORS.textSecondary;

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/onboarding'); // Redirect to onboarding
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <Text style={[styles.name, { color: textColor }]}>{user?.name || 'Guest User'}</Text>
          <Text style={[styles.email, { color: textSecondaryColor }]}>
            {user?.email || 'Sign in to access all features'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondaryColor }]}>APP SETTINGS</Text>
          
          <View style={[styles.card, { backgroundColor: cardBgColor }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: `${COLORS.secondary}20` }]}>
                  <Bell size={20} color={COLORS.secondary} />
                </View>
                <Text style={[styles.settingText, { color: textColor }]}>Push Notifications</Text>
              </View>
              <Switch 
                value={true} 
                onValueChange={() => {}} 
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: `${COLORS.warning}20` }]}>
                  {isDarkMode ? (
                    <Moon size={20} color={COLORS.warning} />
                  ) : (
                    <Sun size={20} color={COLORS.warning} />
                  )}
                </View>
                <Text style={[styles.settingText, { color: textColor }]}>Dark Mode</Text>
              </View>
              <Switch 
                value={isDarkMode} 
                onValueChange={toggleTheme} 
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondaryColor }]}>ACCOUNT</Text>
          
          <View style={[styles.card, { backgroundColor: cardBgColor }]}>
            <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/edit-profile')}>
              <View style={styles.settingLeft}>
                <Text style={[styles.settingText, { color: textColor }]}>Edit Profile</Text>
              </View>
              <ChevronRight size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: `${COLORS.error}20` }]}>
                  <LogOut size={20} color={COLORS.error} />
                </View>
                <Text style={[styles.settingText, { color: COLORS.error }]}>Log Out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: SIZES.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SIZES.xl,
    paddingHorizontal: SIZES.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SIZES.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  section: {
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: SIZES.sm,
    marginLeft: SIZES.sm,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    opacity: 0.5,
    marginHorizontal: SIZES.lg,
  },
});
