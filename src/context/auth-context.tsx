"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Profile } from "@/types";
import { DEMO_PROFILES } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/client";
import { ALLOWED_EMAIL_DOMAIN, isSupabaseConfigured } from "@/lib/supabase/config";

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
  const [user, setUser] = useState<Profile | null>(DEMO_PROFILES[0]); // Default to Alex Chen for instant interactivity
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isSupabaseLive = isSupabaseConfigured();

  useEffect(() => {
    async function initAuth() {
      if (isSupabaseLive) {
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profile) {
              setUser(profile as Profile);
            }
          } else {
            // Check localStorage demo user or keep default
            const savedUserId = localStorage.getItem("loopspace_demo_user_id");
            const found = DEMO_PROFILES.find((p) => p.id === savedUserId);
            if (found) setUser(found);
          }
        } catch {
          // Fallback to local
        }
      } else {
        const savedUserId = typeof window !== "undefined" ? localStorage.getItem("loopspace_demo_user_id") : null;
        const found = DEMO_PROFILES.find((p) => p.id === savedUserId);
        if (found) setUser(found);
      }
      setIsLoading(false);
    }

    initAuth();
  }, [isSupabaseLive]);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);

    if (ALLOWED_EMAIL_DOMAIN && !email.toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN.toLowerCase())) {
      setIsLoading(false);
      throw new Error(`Email must end with your campus domain: ${ALLOWED_EMAIL_DOMAIN}`);
    }

    if (isSupabaseLive && password) {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setIsLoading(false);
        throw new Error(error.message);
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
        if (profile) setUser(profile as Profile);
      }
    } else {
      // In demo mode, match demo profile or create dynamic session
      const found = DEMO_PROFILES.find((p) => p.email.toLowerCase() === email.toLowerCase());
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
    setIsLoading(false);
  };

  const signUp = async (data: {
    fullName: string;
    email: string;
    password?: string;
    collegeName?: string;
    department?: string;
  }) => {
    setIsLoading(true);

    if (ALLOWED_EMAIL_DOMAIN && !data.email.toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN.toLowerCase())) {
      setIsLoading(false);
      throw new Error(`Email must end with your campus domain: ${ALLOWED_EMAIL_DOMAIN}`);
    }

    if (isSupabaseLive && data.password) {
      const supabase = createClient();
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            college_name: data.collegeName || "Campus Central University",
            department: data.department || "General Studies",
          },
        },
      });

      if (error) {
        setIsLoading(false);
        throw new Error(error.message);
      }

      if (authData.user) {
        const newProfile: Profile = {
          id: authData.user.id,
          full_name: data.fullName,
          email: data.email,
          college_name: data.collegeName || "Campus Central University",
          department: data.department || "General Studies",
          is_phone_public: false,
          impact_points: 0,
          role: "user",
          is_suspended: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(newProfile);
      }
    } else {
      const newProfile: Profile = {
        id: `u-${Date.now()}`,
        full_name: data.fullName,
        email: data.email,
        college_name: data.collegeName || "State University of Technology",
        department: data.department || "Computer Science & Engineering",
        is_phone_public: false,
        impact_points: 0,
        role: data.email.startsWith("admin") ? "admin" : "user",
        is_suspended: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(newProfile);
      localStorage.setItem("loopspace_demo_user_id", newProfile.id);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    if (isSupabaseLive) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("loopspace_demo_user_id");
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
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
      setUser({ ...user, ...updates, updated_at: new Date().toISOString() });
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    if (isSupabaseLive) {
      const supabase = createClient();
      await supabase.rpc("delete_user_account");
      await supabase.auth.signOut();
    }
    logout();
  };

  const switchDemoUser = (profileId: string) => {
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
