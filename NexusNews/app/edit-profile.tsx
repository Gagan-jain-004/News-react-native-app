import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { COLORS, SIZES } from '@/constants/theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile, isLoading, error, clearError } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  
  const bgColor = isDarkMode ? COLORS.dark.background : COLORS.background;
  const textColor = isDarkMode ? COLORS.dark.text : COLORS.text;
  const cardBgColor = isDarkMode ? COLORS.dark.card : COLORS.card;
  const borderCol = isDarkMode ? COLORS.dark.border : COLORS.border;

  const handleSave = async () => {
    await updateProfile({ name, bio });
    if (!error) {
       router.back();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <X color={textColor} size={24} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: textColor }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: cardBgColor, color: textColor, borderColor: borderCol }]}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (error) clearError();
              }}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: textColor }]}>Bio</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: cardBgColor, color: textColor, borderColor: borderCol }]}
              value={bio}
              onChangeText={(text) => {
                setBio(text);
                if (error) clearError();
              }}
              placeholder="Tell us about yourself"
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isLoading || !name}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    padding: SIZES.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: SIZES.lg,
  },
  inputContainer: {
    marginBottom: SIZES.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SIZES.sm,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: SIZES.md,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.md,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SIZES.md,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.md,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
