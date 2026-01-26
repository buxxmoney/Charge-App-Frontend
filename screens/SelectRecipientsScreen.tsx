// screens/SelectRecipientScreen.tsx

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Keyboard,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useWalletContext } from '../context/WalletContext';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { api } from '../services/api';

interface LookedUpUser {
  user_id: string;
  name: string;
  phone?: string;
}

interface SelectRecipientScreenProps {
  navigation?: any;
}

export const SelectRecipientScreen: React.FC<SelectRecipientScreenProps> = ({ navigation }) => {
  const { contacts } = useWalletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [lookupResults, setLookupResults] = useState<LookedUpUser[]>([]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Filter contacts by search query (name or phone)
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    
    const query = searchQuery.toLowerCase();
    return contacts.filter(
      (c: any) =>
        c.contact_name?.toLowerCase().includes(query) ||
        c.contact_phone?.includes(query)
    );
  }, [contacts, searchQuery]);

  // Debounced search - auto-search after user stops typing
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setLookupResults([]);
      setLookupError(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleLookup(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Lookup user by phone or name
  const handleLookup = async (query: string) => {
    setLookupLoading(true);
    setLookupError(null);

    try {
      const results = await api.lookupUser(query);
      if (results && results.length > 0) {
        // Filter out users already in contacts
        const newUsers = results.filter(
          (result: LookedUpUser) => !contacts.find((c: any) => c.contact_user_id === result.user_id)
        );
        setLookupResults(newUsers);
        if (newUsers.length === 0 && results.length > 0) {
          // All found users are already contacts
          setLookupResults([]);
        }
      } else {
        setLookupResults([]);
      }
    } catch (err: any) {
      setLookupError(err.message || 'Failed to lookup user');
      setLookupResults([]);
    } finally {
      setLookupLoading(false);
    }
  };

  // Select recipient and navigate to amount screen
  const handleSelectRecipient = (recipient: { user_id: string; name: string; phone?: string }) => {
    navigation?.navigate('SendAmount', {
      recipient: {
        user_id: recipient.user_id,
        name: recipient.name,
        phone: recipient.phone,
      },
    });
  };

  // Select from existing contact
  const handleSelectContact = (contact: any) => {
    handleSelectRecipient({
      user_id: contact.contact_user_id,
      name: contact.contact_name,
      phone: contact.contact_phone,
    });
  };

  // Select from lookup result
  const handleSelectLookup = (user: LookedUpUser) => {
    handleSelectRecipient({
      user_id: user.user_id,
      name: user.name,
      phone: user.phone,
    });
  };

  const renderContact = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleSelectContact(item)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.contact_name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.contact_name}</Text>
        {item.contact_phone && (
          <Text style={styles.contactPhone}>{item.contact_phone}</Text>
        )}
      </View>
      <Feather name="chevron-right" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderEmptyContacts = () => (
    <View style={styles.emptyState}>
      <Feather name="users" size={48} color={colors.textTertiary} />
      <Text style={styles.emptyTitle}>No contacts yet</Text>
      <Text style={styles.emptySubtitle}>
        Search by name or phone number{'\n'}to find someone to send to
      </Text>
    </View>
  );

  const renderSearchEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No matches</Text>
      <Text style={styles.emptySubtitle}>
        Try a different name or phone number
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Feather name="x" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send to</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name or phone number"
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setLookupResults([]);
                setLookupError(null);
              }}
            >
              <Feather name="x-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Loading indicator */}
        {lookupLoading && (
          <ActivityIndicator size="small" color={colors.primary} style={styles.loadingIndicator} />
        )}
      </View>

      {/* Lookup Results */}
      {lookupResults.length > 0 && (
        <View style={styles.lookupResultSection}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          {lookupResults.map((user) => (
            <TouchableOpacity
              key={user.user_id}
              style={styles.contactItem}
              onPress={() => handleSelectLookup(user)}
            >
              <View style={[styles.avatar, styles.avatarNew]}>
                <Text style={styles.avatarText}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{user.name}</Text>
                {user.phone && (
                  <Text style={styles.contactPhone}>{user.phone}</Text>
                )}
              </View>
              <Feather name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Lookup Error */}
      {lookupError && (
        <View style={styles.lookupError}>
          <Feather name="alert-circle" size={16} color="#D00" />
          <Text style={styles.lookupErrorText}>{lookupError}</Text>
        </View>
      )}

      {/* Contacts List */}
      <View style={styles.contactsSection}>
        {contacts.length > 0 && (
          <Text style={styles.sectionTitle}>Your Contacts</Text>
        )}
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContact}
          ListEmptyComponent={
            searchQuery.length > 0 && lookupResults.length === 0 && !lookupLoading
              ? renderSearchEmpty
              : contacts.length === 0
              ? renderEmptyContacts
              : null
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  } as TextStyle,
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  loadingIndicator: {
    marginLeft: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.xs,
  } as TextStyle,
  lookupButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    minWidth: 80,
    alignItems: 'center',
  },
  lookupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  } as TextStyle,
  lookupResultSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  } as TextStyle,
  lookupError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: '#FFE5E5',
    borderRadius: borderRadius.md,
  },
  lookupErrorText: {
    ...typography.body,
    color: '#D00',
    flex: 1,
  } as TextStyle,
  contactsSection: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    flexGrow: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarNew: {
    backgroundColor: '#34C759',
  },
  avatarText: {
    ...typography.h3,
    color: '#fff',
    fontWeight: '600',
  } as TextStyle,
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  } as TextStyle,
  contactPhone: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  } as TextStyle,
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
  } as TextStyle,
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  } as TextStyle,
});

export default SelectRecipientScreen;