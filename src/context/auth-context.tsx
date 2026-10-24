
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Profile } from "@/types";
import { DEMO_PROFILES } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/client";
import {
  ALLOWED_EMAIL_DOMAIN,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

interface AuthContextType {
  user: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isSupabaseLive: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signUp: (data: {
    fullName: string;
    email: string;
    password?: string;
    collegeName?: string;
    department?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  switchDemoUser: (profileId: string) => void;
  availableDemoUsers: Profile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isSupabaseLive = isSupabaseConfigured();

  const [user, setUser] = useState<Profile | null>(
    isSupabaseLive ? null : DEMO_PROFILES[0]
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function initAuth() {
      if (!isSupabaseLive) {
        const savedUserId = localStorage.getItem("loopspace_demo_user_id");
        const found = DEMO_PROFILES.find((p) => p.id === savedUserId);

        if (active) {
          setUser(found ?? DEMO_PROFILES[0]);
          setIsLoading(false);
        }
        return;
      }

      const supabase = createClient();

      const loadProfile = async (userId: string) => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (!active) return;

        if (error) {
          console.error("Unable to load profile:", error.message);
          setUser(null);
          return;
        }

        setUser(data as Profile | null);
      };

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await loadProfile(session.user.id);
      } else if (active) {
        setUser(null);
      }

      if (active) setIsLoading(false);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!active) return;

        if (!session?.user) {
          setUser(null);
          return;
        }

        // Defer the profile query to avoid doing Supabase queries
        // inside the auth state-change callback.
        setTimeout(() => {
          if (active) void loadProfile(session.user.id);
        }, 0);
      });

      return subscription;
    }

    let unsubscribe: (() => void) | undefined;

    initAuth()
      .then((subscription) => {
        if (subscription) {
          unsubscribe = () => subscription.unsubscribe();
        }
      })
      .catch((error) => {
        console.error("Authentication initialization failed:", error);
        if (active) {
          setUser(null);
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [isSupabaseLive]);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);

    try {
      if (
        ALLOWED_EMAIL_DOMAIN &&
        !email.toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN.toLowerCase())
      ) {
        throw new Error(
          `Email must end with your campus domain: ${ALLOWED_EMAIL_DOMAIN}`
        );
      }

      if (isSupabaseLive) {
        if (!password) throw new Error("Please enter your password.");

        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw new Error(error.message);

        if (!data.session) {
          throw new Error("Please verify your email before signing in.");
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profileError) throw new Error(profileError.message);

        if (!profile) {
          throw new Error(
            "Your account is signed in, but its profile is missing. Please contact support."
          );
        }

        setUser(profile as Profile);
      } else {
        const found = DEMO_PROFILES.find(
          (p) => p.email.toLowerCase() === email.toLowerCase()
        );

        if (found) {
          setUser(found);
          localStorage.setItem("loopspace_demo_user_id", found.id);
        } else {
          const customUser: Profile = {
            id: `u-${Date.now()}`,
            full_name: email.split("@")[0],
            email,
            college_name: "Campus Central University",
            department: "General Studies",
            is_phone_public: false,
            impact_points: 0,
            role: email.startsWith("admin") ? "admin" : "user",
            is_suspended: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          setUser(customUser);
          localStorage.setItem("loopspace_demo_user_id", customUser.id);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: {
    fullName: string;
    email: string;
    password?: string;
    collegeName?: string;
    department?: string;
  }) => {
    if (!isSupabaseLive) {
      throw new Error(
        "Supabase is not configured. Please check your .env.local file."
      );
    }

    if (!data.password) {
      throw new Error("Please enter a password.");
    }

    setIsLoading(true);

    try {
      if (
        ALLOWED_EMAIL_DOMAIN &&
        !data.email.toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN.toLowerCase())
      ) {
        throw new Error(
          `Email must end with your campus domain: ${ALLOWED_EMAIL_DOMAIN}`
        );
      }

      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            college_name:
              data.collegeName || "State University of Technology",
            department:
              data.department || "Computer Science & Engineering",
          },
        },
      });

      if (error) throw new Error(error.message);

      // Do not set the user here. Signup must be verified first.
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseLive) {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    }

    setUser(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("loopspace_demo_user_id");
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error("Please sign in first.");

    if (isSupabaseLive) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      if (data) setUser(data as Profile);
    } else {
      setUser({
        ...user,
        ...updates,
        updated_at: new Date().toISOString(),
      });
    }
  };

  const deleteAccount = async () => {
    if (!user) throw new Error("Please sign in first.");

    if (isSupabaseLive) {
      const supabase = createClient();
      const { error } = await supabase.rpc("delete_user_account");

      if (error) throw new Error(error.message);

      await supabase.auth.signOut();
    }

    setUser(null);
    localStorage.removeItem("loopspace_demo_user_id");
  };

  const switchDemoUser = (profileId: string) => {
    if (isSupabaseLive) return;

    const found = DEMO_PROFILES.find((p) => p.id === profileId);

    if (found) {
      setUser(found);
      localStorage.setItem("loopspace_demo_user_id", found.id);
    }
  };

  const isAdmin = user?.role === "admin";
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        isSupabaseLive,
        login,
        signUp,
        logout,
        updateProfile,
        deleteAccount,
        switchDemoUser,
        availableDemoUsers: DEMO_PROFILES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
