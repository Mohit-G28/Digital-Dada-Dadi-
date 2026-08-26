/*
========================================================================
   DIGITAL DADA DADI HELP MANAGEMENT DESK - SUPABASE CONFIG & CLIENT
========================================================================
   This file initializes the Supabase client using the publishable ANON key
   and provides helper functions for database operations.
*/

(function () {
    // 1. Supabase Project Configuration
    // Replace these credentials with your actual project values from https://supabase.com/dashboard/project/_/settings/api
    const SUPABASE_URL = window.SUPABASE_URL || "https://deogpymrakboaohhlffy.supabase.co";
    const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "sb_publishable_YRACj6yu3CjBvjZzFwTtdA_txFPAnZ8";

    // 2. Check if valid credentials are supplied
    const isConfigured = function () {
        return SUPABASE_URL && 
               !SUPABASE_URL.includes("your-supabase-project-id") && 
               SUPABASE_ANON_KEY && 
               !SUPABASE_ANON_KEY.includes("placeholderKey");
    };

    // 3. Initialize Supabase Client
    let client = null;
    if (typeof supabase !== 'undefined' && isConfigured()) {
        try {
            client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log("✅ Supabase client successfully initialized.");
        } catch (err) {
            console.error("⚠️ Failed to initialize Supabase client:", err);
        }
    }

    // 4. Supabase Database Operations Helper Module
    window.SupabaseDB = {
        isConfigured: isConfigured,
        getClient: function () {
            return client;
        },

        // --- USERS TABLE (Senior Citizens) ---
        getUsers: async function () {
            if (!client) return null;
            const { data, error } = await client.from('users').select('*').order('created_at', { ascending: false });
            if (error) {
                console.error("Error fetching users from Supabase:", error);
                throw error;
            }
            return data;
        },

        getUserByEmail: async function (email) {
            if (!client) return null;
            const { data, error } = await client.from('users').select('*').ilike('email', email.trim()).single();
            if (error && error.code !== 'PGRST116') { // PGRST116 = row not found
                console.error("Error fetching user by email from Supabase:", error);
                throw error;
            }
            return data || null;
        },

        createUser: async function (user) {
            if (!client) return null;
            const { data, error } = await client.from('users').insert([{
                full_name: user.full_name,
                age: parseInt(user.age),
                gender: user.gender,
                mobile_number: user.mobile_number,
                address: user.address,
                email: user.email.toLowerCase().trim(),
                password: user.password
            }]).select().single();

            if (error) {
                console.error("Error creating user in Supabase:", error);
                throw error;
            }
            return data;
        },

        updateUser: async function (id, userData) {
            if (!client) return null;
            const { data, error } = await client.from('users').update({
                full_name: userData.full_name,
                age: parseInt(userData.age),
                gender: userData.gender,
                mobile_number: userData.mobile_number,
                address: userData.address,
                email: userData.email.toLowerCase().trim()
            }).eq('id', id).select().single();

            if (error) {
                console.error("Error updating user in Supabase:", error);
                throw error;
            }
            return data;
        },

        deleteUser: async function (id) {
            if (!client) return null;
            const { error } = await client.from('users').delete().eq('id', id);
            if (error) {
                console.error("Error deleting user from Supabase:", error);
                throw error;
            }
            return true;
        },

        // --- ADMINS TABLE ---
        getAdminByUsername: async function (username) {
            if (!client) return null;
            const { data, error } = await client.from('admins').select('*').ilike('username', username.trim()).single();
            if (error && error.code !== 'PGRST116') {
                console.error("Error fetching admin from Supabase:", error);
                throw error;
            }
            return data || null;
        },

        // --- HELP REQUESTS TABLE ---
        getHelpRequests: async function () {
            if (!client) return null;
            const { data, error } = await client
                .from('help_requests')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                console.error("Error fetching help requests from Supabase:", error);
                throw error;
            }
            return data;
        },

        getHelpRequestsByUserId: async function (userId) {
            if (!client) return null;
            const { data, error } = await client
                .from('help_requests')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (error) {
                console.error("Error fetching help requests for user from Supabase:", error);
                throw error;
            }
            return data;
        },

        createHelpRequest: async function (reqData) {
            if (!client) return null;
            const { data, error } = await client.from('help_requests').insert([{
                user_id: reqData.user_id,
                request_type: reqData.request_type,
                description: reqData.description,
                status: reqData.status || 'Pending'
            }]).select().single();

            if (error) {
                console.error("Error creating help request in Supabase:", error);
                throw error;
            }
            return data;
        },

        updateHelpRequestStatus: async function (id, status) {
            if (!client) return null;
            const { data, error } = await client
                .from('help_requests')
                .update({ status: status })
                .eq('id', id)
                .select().single();

            if (error) {
                console.error("Error updating help request status in Supabase:", error);
                throw error;
            }
            return data;
        },

        deleteHelpRequest: async function (id) {
            if (!client) return null;
            const { error } = await client.from('help_requests').delete().eq('id', id);
            if (error) {
                console.error("Error deleting help request from Supabase:", error);
                throw error;
            }
            return true;
        },

        // --- CONTACT MESSAGES TABLE ---
        getContactMessages: async function () {
            if (!client) return null;
            const { data, error } = await client.from('contact_messages').select('*').order('created_at', { ascending: false });
            if (error) {
                console.error("Error fetching contact messages from Supabase:", error);
                throw error;
            }
            return data;
        },

        createContactMessage: async function (msgData) {
            if (!client) return null;
            const { data, error } = await client.from('contact_messages').insert([{
                name: msgData.name,
                email: msgData.email,
                message: msgData.message
            }]).select().single();

            if (error) {
                console.error("Error submitting contact message to Supabase:", error);
                throw error;
            }
            return data;
        }
    };
})();
