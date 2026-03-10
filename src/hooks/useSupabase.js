import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

// 🔐 AUTH HOOKS
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signUp, signIn, signOut };
}

// 👤 PROFILE HOOKS
export function useProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (!error) setProfile(data);
    setLoading(false);
  };

  const createProfile = async (profileData) => {
    const { data, error } = await supabase
      .from("profiles")
      .insert([{ id: userId, ...profileData }])
      .select()
      .single();
    if (!error) setProfile(data);
    return { data, error };
  };

  const updateProfile = async (updates) => {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    if (!error) setProfile(data);
    return { data, error };
  };

  return {
    profile,
    loading,
    createProfile,
    updateProfile,
    refetch: fetchProfile,
  };
}

// 🏘️ COMMUNITIES HOOKS
export function useCommunities(userId) {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunities();
  }, [userId]);

  const fetchCommunities = async () => {
    const { data, error } = await supabase.from("communities").select(`
        *,
        community_members(user_id)
      `);
    if (!error) {
      const withJoined = data.map((c) => ({
        ...c,
        joined: c.community_members?.some((m) => m.user_id === userId) || false,
        memberCount: c.community_members?.length || 0,
      }));
      setCommunities(withJoined);
    }
    setLoading(false);
  };

  const joinCommunity = async (communityId) => {
    const { error } = await supabase
      .from("community_members")
      .insert([{ community_id: communityId, user_id: userId }]);
    if (!error) fetchCommunities();
    return { error };
  };

  const leaveCommunity = async (communityId) => {
    const { error } = await supabase
      .from("community_members")
      .delete()
      .eq("community_id", communityId)
      .eq("user_id", userId);
    if (!error) fetchCommunities();
    return { error };
  };

  return {
    communities,
    loading,
    joinCommunity,
    leaveCommunity,
    refetch: fetchCommunities,
  };
}

// 💬 REALTIME MESSAGES HOOK
export function useMessages(communityId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!communityId) return;
    fetchMessages();

    // 🔴 REALTIME SUBSCRIPTION
    const channel = supabase
      .channel(`messages:${communityId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `community_id=eq.${communityId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [communityId]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        profiles(name, id)
      `
      )
      .eq("community_id", communityId)
      .order("created_at", { ascending: true })
      .limit(50);
    if (!error) setMessages(data || []);
    setLoading(false);
  };

  const sendMessage = async (text, userId) => {
    const { error } = await supabase.from("messages").insert([
      {
        community_id: communityId,
        user_id: userId,
        text,
      },
    ]);
    return { error };
  };

  return { messages, loading, sendMessage };
}

// 📅 EVENTS HOOKS
export function useEvents(userId) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        *,
        event_attendees(user_id),
        communities(name, emoji)
      `
      )
      .order("created_at", { ascending: true });
    if (!error) {
      const withGoing = data.map((e) => ({
        ...e,
        going: e.event_attendees?.some((a) => a.user_id === userId) || false,
        attendees: e.event_attendees?.length || 0,
        community: e.communities?.name || "",
        communityEmoji: e.communities?.emoji || "",
      }));
      setEvents(withGoing);
    }
    setLoading(false);
  };

  const rsvpEvent = async (eventId) => {
    const { error } = await supabase
      .from("event_attendees")
      .insert([{ event_id: eventId, user_id: userId }]);
    if (!error) fetchEvents();
    return { error };
  };

  const unrsvpEvent = async (eventId) => {
    const { error } = await supabase
      .from("event_attendees")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", userId);
    if (!error) fetchEvents();
    return { error };
  };

  return { events, loading, rsvpEvent, unrsvpEvent, refetch: fetchEvents };
}

// 👥 DISCOVER PEOPLE HOOK
export function useProfiles(currentUserId) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, [currentUserId]);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .neq("id", currentUserId)
      .limit(20);
    if (!error) setProfiles(data || []);
    setLoading(false);
  };

  return { profiles, loading, refetch: fetchProfiles };
}

// 🤝 CONNECTIONS HOOK
export function useConnections(userId) {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchConnections();
  }, [userId]);

  const fetchConnections = async () => {
    const { data, error } = await supabase
      .from("connections")
      .select(
        `
        *,
        profiles!connections_connected_to_fkey(*)
      `
      )
      .eq("user_id", userId);
    if (!error) setConnections(data || []);
    setLoading(false);
  };

  const connect = async (targetUserId) => {
    const { error } = await supabase
      .from("connections")
      .insert([{ user_id: userId, connected_to: targetUserId }]);
    if (!error) fetchConnections();
    return { error };
  };

  const disconnect = async (targetUserId) => {
    const { error } = await supabase
      .from("connections")
      .delete()
      .eq("user_id", userId)
      .eq("connected_to", targetUserId);
    if (!error) fetchConnections();
    return { error };
  };

  const isConnected = (targetUserId) => {
    return connections.some((c) => c.connected_to === targetUserId);
  };

  return { connections, loading, connect, disconnect, isConnected };
}
