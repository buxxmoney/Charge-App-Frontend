import { supabase } from './supabase';

export const api = {
  // Get user balance (on-chain or from a balance cache table if you have one)
  async getBalance(userId: string): Promise<{ zarBalance: number; usdBalance: number; currency: string }> {
    try {
      // TODO: Implement balance fetching from blockchain or balance table
      // For now, return mock data
      return {
        zarBalance: 0,
        usdBalance: 0,
        currency: 'ZAR',
      };
    } catch (error) {
      console.error('Error fetching balance:', error);
      return { zarBalance: 0, usdBalance: 0, currency: 'ZAR' };
    }
  },

  // Get transaction history
  async getTransactions(userId: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map((tx: any) => ({
        id: tx.id,
        from: tx.sender_id,
        to: tx.receiver_id,
        amount: tx.amount,
        currency: tx.asset_symbol,
        timestamp: tx.created_at,
        status: tx.status,
        notes: tx.error_message,
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  },

  // Get user's contacts
  async getContacts(userId: string) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          id,
          contact_user_id,
          contact_name,
          contact_phone,
          profiles!contacts_contact_user_id_fkey (
            public_key
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      return data.map((contact: any) => ({
        id: contact.id,
        chargeId: contact.contact_user_id,
        name: contact.contact_name,
        phoneNumber: contact.contact_phone,
      }));
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  },

  // Lookup user by phone number
  async lookupUserByPhone(phoneNumber: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, phone_number, public_key')
        .eq('phone_number', phoneNumber)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        chargeId: data.id,
        phoneNumber: data.phone_number,
      };
    } catch (error) {
      console.error('Error looking up user:', error);
      return null;
    }
  },

  // Lookup user by name
  async lookupUserByName(name: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, phone_number, public_key')
        .or(`first_name.ilike.%${name}%,last_name.ilike.%${name}%`)
        .limit(1)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        chargeId: data.id,
        phoneNumber: data.phone_number,
      };
    } catch (error) {
      console.error('Error looking up user:', error);
      return null;
    }
  },

  // Add contact
  async addContact(userId: string, contactUserId: string, contactName: string, contactPhone?: string) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([
          {
            user_id: userId,
            contact_user_id: contactUserId,
            contact_name: contactName,
            contact_phone: contactPhone,
          },
        ])
        .select();

      if (error) throw error;

      return {
        success: true,
        contact: data[0],
      };
    } catch (error: any) {
      console.error('Error adding contact:', error);
      return {
        success: false,
        error: error.message || 'Failed to add contact',
      };
    }
  },

  // Delete contact
  async deleteContact(contactId: string) {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete contact',
      };
    }
  },

  // Get user profile
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        phoneNumber: data.phone_number,
        publicKey: data.public_key,
        haultRegistered: data.hault_registered,
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  // Get on-chain keypair info
  async getOnChainInfo(userId: string) {
    try {
      const { data, error } = await supabase
        .from('on_chain')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return {
        devicePublic: data.device_public,
        backendPublic: data.backend_public,
        viewKey: data.view_key,
        status: data.status,
        generationIndex: data.generation_index,
      };
    } catch (error) {
      console.error('Error fetching on-chain info:', error);
      return null;
    }
  },
  // Send transaction
  async sendTransaction(
    senderId: string,
    receiverId: string,
    amount: number,
    currency: 'ZAR' | 'USD',
    notes?: string
  ) {
    try {
      const assetSymbol = currency === 'ZAR' ? 'ZARP' : 'USDC';

      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            sender_id: senderId,
            receiver_id: receiverId,
            amount: amount,
            asset_symbol: assetSymbol,
            nonce: 0,
            status: 'PENDING',
          },
        ])
        .select();

      if (error) throw error;

      return {
        success: true,
        transaction: data[0],
        message: 'Transaction created successfully',
      };
    } catch (error: any) {
      console.error('Error sending transaction:', error);
      return {
        success: false,
        error: error.message || 'Failed to send transaction',
      };
    }
  },
};