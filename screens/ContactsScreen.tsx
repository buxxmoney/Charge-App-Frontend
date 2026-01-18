import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
} from 'react-native';
import { borderRadius, colors, spacing, typography } from '../constants/theme';
import { useWallet } from '../hooks/useWallet';
import { api } from '../services/api';

interface Contact {
  id: string;
  chargeId: string;
  name: string;
  phoneNumber?: string;
}

export const ContactsScreen: React.FC = () => {
  const { contacts, loading, user, refreshContacts } = useWallet();
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      refreshContacts();
    }
  }, [user?.id]);

  const handleSearch = async () => {
    if (!searchName && !searchPhone) {
      Alert.alert('Error', 'Enter a name or phone number');
      return;
    }

    setIsSearching(true);
    try {
      let result = null;

      if (searchPhone) {
        result = await api.lookupUserByPhone(searchPhone);
      } else if (searchName) {
        result = await api.lookupUserByName(searchName);
      }

      if (result) {
        setFoundUser(result);
      } else {
        Alert.alert('Not Found', 'User not found');
        setFoundUser(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search user');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddContact = async () => {
    if (!foundUser || !user?.id) return;

    try {
      const result = await api.addContact(
        user.id,
        foundUser.id,
        foundUser.name,
        foundUser.phoneNumber
      );

      if (result.success) {
        Alert.alert('Success', 'Contact added');
        setIsAddingContact(false);
        setSearchName('');
        setSearchPhone('');
        setFoundUser(null);
        refreshContacts();
      } else {
        Alert.alert('Error', result.error || 'Failed to add contact');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add contact');
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    Alert.alert('Delete Contact', 'Are you sure?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const result = await api.deleteContact(contactId);
            if (result.success) {
              Alert.alert('Success', 'Contact deleted');
              refreshContacts();
            } else {
              Alert.alert('Error', result.error || 'Failed to delete contact');
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to delete contact');
          }
        },
      },
    ]);
  };

  const renderContactCard = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={viewStyles.contactCard}>
      <View style={viewStyles.contactAvatar}>
        <Text style={textStyles.avatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={viewStyles.contactInfo}>
        <Text style={textStyles.contactName}>{item.name}</Text>
        {item.phoneNumber && (
          <Text style={textStyles.contactPhone}>{item.phoneNumber}</Text>
        )}
      </View>
      <TouchableOpacity
        style={viewStyles.deleteButton}
        onPress={() => handleDeleteContact(item.id)}
      >
        <Feather name="trash-2" size={18} color="#FF3B30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={viewStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        style={viewStyles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={viewStyles.header}>
          <Text style={textStyles.headerTitle}>Contacts</Text>
          <TouchableOpacity
            style={viewStyles.addButton}
            onPress={() => setIsAddingContact(true)}
          >
            <Feather name="plus" size={24} color={colors.background} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={viewStyles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : contacts.length === 0 ? (
          <View style={viewStyles.emptyStateContainer}>
            <Feather
              name="users"
              size={48}
              color={colors.textTertiary}
              style={viewStyles.emptyIcon}
            />
            <Text style={textStyles.emptyStateTitle}>No contacts yet</Text>
            <Text style={textStyles.emptyStateSubtitle}>
              Add contacts to make transfers easier
            </Text>
          </View>
        ) : (
          <FlatList
            data={contacts}
            renderItem={renderContactCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={viewStyles.listContainer}
          />
        )}
      </ScrollView>

      {/* Add Contact Modal */}
      <Modal
        visible={isAddingContact}
        animationType="slide"
        transparent={true}
      >
        <SafeAreaView style={viewStyles.modalContainer}>
          <View style={viewStyles.modalHeader}>
            <TouchableOpacity onPress={() => setIsAddingContact(false)}>
              <Text style={textStyles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={textStyles.modalTitle}>Add Contact</Text>
            <View style={{ width: 50 }} />
          </View>

          <ScrollView style={viewStyles.modalContent}>
            <View style={viewStyles.inputSection}>
              <Text style={textStyles.inputLabel}>Search by Name</Text>
              <TextInput
                style={textStyles.input}
                placeholder="Enter name"
                value={searchName}
                onChangeText={setSearchName}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <Text style={textStyles.orText}>OR</Text>

            <View style={viewStyles.inputSection}>
              <Text style={textStyles.inputLabel}>Search by Phone</Text>
              <TextInput
                style={textStyles.input}
                placeholder="Enter phone number"
                value={searchPhone}
                onChangeText={setSearchPhone}
                keyboardType="phone-pad"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <TouchableOpacity
              style={viewStyles.searchButton}
              onPress={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={textStyles.searchButtonText}>Search</Text>
              )}
            </TouchableOpacity>

            {foundUser && (
              <View style={viewStyles.foundUserContainer}>
                <View style={viewStyles.foundUserAvatar}>
                  <Text style={textStyles.avatarText}>
                    {foundUser.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={viewStyles.foundUserInfo}>
                  <Text style={textStyles.foundUserName}>{foundUser.name}</Text>
                  {foundUser.phoneNumber && (
                    <Text style={textStyles.foundUserPhone}>
                      {foundUser.phoneNumber}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={viewStyles.addFoundButton}
                  onPress={handleAddContact}
                >
                  <Feather name="check" size={20} color={colors.background} />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    minHeight: 400,
  },
  emptyIcon: {
    marginBottom: spacing.lg,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  inputSection: {
    marginBottom: spacing.lg,
  },
  searchButton: {
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  foundUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  foundUserAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  foundUserInfo: {
    flex: 1,
  },
  addFoundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const textStyles = StyleSheet.create({
  headerTitle: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.h1.lineHeight,
    color: colors.text,
  },
  emptyStateTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.h3.lineHeight,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.caption.lineHeight,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  avatarText: {
    fontSize: typography.h3.fontSize,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: typography.h3.lineHeight,
    color: colors.background,
  },
  contactName: {
    fontSize: typography.body.fontSize,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
    color: colors.text,
  },
  contactPhone: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.caption.lineHeight,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  modalCancel: {
    fontSize: typography.body.fontSize,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
    color: colors.primary,
  },
  modalTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.h2.lineHeight,
    color: colors.text,
  },
  inputLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    color: colors.text,
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
  },
  orText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: typography.caption.lineHeight,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  searchButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
    color: colors.background,
  },
  foundUserName: {
    fontSize: typography.body.fontSize,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: typography.body.lineHeight,
    color: colors.text,
  },
  foundUserPhone: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.caption.lineHeight,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});