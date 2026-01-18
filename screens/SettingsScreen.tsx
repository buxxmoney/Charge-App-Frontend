import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
} from 'react-native';
import { borderRadius, colors, spacing, typography } from '../constants/theme';

export const SettingsScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricEnabled, setBiometricEnabled] = React.useState(false);

  return (
    <SafeAreaView style={viewStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <ScrollView
        style={viewStyles.scrollView}
        contentContainerStyle={viewStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={viewStyles.header}>
          <Text style={textStyles.headerTitle}>Settings</Text>
        </View>

        {/* Account Section */}
        <View style={viewStyles.section}>
          <Text style={textStyles.sectionTitle}>Account</Text>
          <View style={viewStyles.sectionContent}>
            <TouchableOpacity style={viewStyles.settingItem}>
              <View style={viewStyles.itemLeft}>
                <Feather name="user" size={20} color={colors.text} style={viewStyles.itemIcon} />
                <View style={viewStyles.itemText}>
                  <Text style={textStyles.itemTitle}>Profile</Text>
                  <Text style={textStyles.itemSubtitle}>View and edit your profile</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Security Section */}
        <View style={viewStyles.section}>
          <Text style={textStyles.sectionTitle}>Security</Text>
          <View style={viewStyles.sectionContent}>
            <View style={viewStyles.settingItem}>
              <View style={viewStyles.itemLeft}>
                <Feather name="lock" size={20} color={colors.text} style={viewStyles.itemIcon} />
                <View style={viewStyles.itemText}>
                  <Text style={textStyles.itemTitle}>Biometric Authentication</Text>
                </View>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: '#E8E8E8', true: '#E8E8E8' }}
                thumbColor={biometricEnabled ? colors.primary : colors.textSecondary}
              />
            </View>
            <View style={viewStyles.divider} />
            <View style={viewStyles.settingItem}>
              <View style={viewStyles.itemLeft}>
                <Feather name="bell" size={20} color={colors.text} style={viewStyles.itemIcon} />
                <View style={viewStyles.itemText}>
                  <Text style={textStyles.itemTitle}>Push Notifications</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E8E8E8', true: '#E8E8E8' }}
                thumbColor={notificationsEnabled ? colors.primary : colors.textSecondary}
              />
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={viewStyles.section}>
          <Text style={textStyles.sectionTitle}>About</Text>
          <View style={viewStyles.sectionContent}>
            <TouchableOpacity style={viewStyles.settingItem}>
              <View style={viewStyles.itemLeft}>
                <Feather name="info" size={20} color={colors.text} style={viewStyles.itemIcon} />
                <View style={viewStyles.itemText}>
                  <Text style={textStyles.itemTitle}>App Version</Text>
                  <Text style={textStyles.itemSubtitle}>1.0.0</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View style={viewStyles.logoutSection}>
          <TouchableOpacity style={viewStyles.logoutButton}>
            <Text style={textStyles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const viewStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    marginRight: spacing.md,
    width: 20,
  },
  itemText: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: spacing.lg,
  },
  logoutSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  logoutButton: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
});

const textStyles = StyleSheet.create({
  headerTitle: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.h1.lineHeight,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: typography.caption.lineHeight,
    color: colors.textSecondary,
    marginLeft: spacing.lg,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  itemTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
    color: colors.text,
  },
  itemSubtitle: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.caption.lineHeight,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  logoutText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
    color: '#FF3B30',
  },
});