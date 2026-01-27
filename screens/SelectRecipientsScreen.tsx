// screens/SelectRecipientScreen.tsx

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
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

interface RecentRecipient {
  user_id: string;
  name: string;
  phone?: string;
}

interface SelectRecipientScreenProps {
  navigation?: any;
}

export const SelectRecipientScreen: React.FC<SelectRecipientScreenProps> = ({ navigation }) => {
  const { contacts, transactions, user } = useWalletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [lookupResults, setLookupResults] = useState<LookedUpUser[]>([]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Get recent recipients from transaction history (people user has sent to)
  const recentRecipients = useMemo(() => {
    if (!transactions || !user?.id) return [];
    
    const sentTransactions = transactions.filter((tx: any) => tx.from === user.id);
    const recipientMap = new Map<string, RecentRecipient>();
    
    // Get unique recipients, most recent first
    sentTransactions.forEach((tx: any) => {
      if (!recipientMap.has(tx.to)) {
        recipientMap.set(tx.to, {
          user_id: tx.to,
          name: tx.recipientName || 'Unknown',
          phone: tx.recipientPhone,
        });
      }
    });
    
    return Array.from(recipientMap.values()).slice(0, 5); // Show top 5 recent
  }, [transactions, user?.id]);

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

  // Filter recents by search query
  const filteredRecents = useMemo(() => {
    if (!searchQuery.trim()) return recentRecipients;
    
    const query = searchQuery.toLowerCase();
    return recentRecipients.filter(
      (r) =>
        r.name?.toLowerCase().includes(query) ||
        r.phone?.includes(query)
    );
  }, [recentRecipients, searchQuery]);

  // Debounced search - auto-search after user stops typing
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setLookupResults([]);
      setLookupError(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleLookup(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleLookup = async (query: string) => {
    setLookupLoading(true);
    setLookupError(null);

    try {
      const results = await api.lookupUser(query);
      if (results && results.length > 0) {
        const newUsers = results.filter(
          (result: LookedUpUser) => !contacts.find((c: any) => c.contact_user_id === result.user_id)
        );
        setLookupResults(newUsers);
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

  const handleSelectRecipient = (recipient: { user_id: string; name: string; phone?: string }) => {
    navigation?.navigate('SendAmount', {
      recipient: {
        user_id: recipient.user_id,
        name: recipient.name,
        phone: recipient.phone,
      },
    });
  };

  const handleSelectContact = (contact: any) => {
    handleSelectRecipient({
      user_id: contact.contact_user_id,
      name: contact.contact_name,
      phone: contact.contact_phone,
    });
  };

  const handleSelectLookup = (user: LookedUpUser) => {
    handleSelectRecipient({
      user_id: user.user_id,
      name: user.name,
      phone: user.phone,
    });
  };

  const handleSelectRecent = (recipient: RecentRecipient) => {
    handleSelectRecipient({
      user_id: recipient.user_id,
      name: recipient.name,
      phone: recipient.phone,
    });
  };

  const renderRecipientItem = (
    item: { user_id: string; name: string; phone?: string },
    onPress: () => void,
    isNew?: boolean
  ) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={onPress}
    >
      <View style={[styles.avatar, isNew && styles.avatarNew]}>
        <Text style={styles.avatarText}>
          {item.name?.charAt(0).toUpperCase() || '?'}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        {item.phone && (
          <Text style={styles.contactPhone}>{item.phone}</Text>
        )}
      </View>
      <Feather name="chevron-right" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="users" size={48} color={colors.textTertiary} />
      <Text style={styles.emptyTitle}>No contacts yet</Text>
      <Text style={styles.emptySubtitle}>
        Search by name or phone number{'\n'}to find someone to send to
      </Text>
    </View>
  );

  const showRecents = filteredRecents.length > 0 && !searchQuery;
  const showContacts = filteredContacts.length > 0;
  const showLookupResults = lookupResults.length > 0;
  const showEmpty = !showRecents && !showContacts && !showLookupResults && !lookupLoading;

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
        {lookupLoading && (
          <ActivityIndicator size="small" color={colors.primary} style={styles.loadingIndicator} />
        )}
      </View>

      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <>
            {/* Recents Section */}
            {showRecents && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent</Text>
                {filteredRecents.map((recipient) => (
                  <View key={recipient.user_id}>
                    {renderRecipientItem(recipient, () => handleSelectRecent(recipient))}
                  </View>
                ))}
              </View>
            )}

            {/* Lookup Results */}
            {showLookupResults && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Search Results</Text>
                {lookupResults.map((user) => (
                  <View key={user.user_id}>
                    {renderRecipientItem(user, () => handleSelectLookup(user), true)}
                  </View>
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

            {/* Contacts Section */}
            {showContacts && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contacts</Text>
                {filteredContacts.map((contact: any) => (
                  <View key={contact.id}>
                    {renderRecipientItem(
                      { user_id: contact.contact_user_id, name: contact.contact_name, phone: contact.contact_phone },
                      () => handleSelectContact(contact)
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Empty State */}
            {showEmpty && renderEmptyState()}
          </>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
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
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
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
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
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
    paddingHorizontal: spacing.lg,
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