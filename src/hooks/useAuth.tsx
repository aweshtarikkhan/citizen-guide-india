import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  rolesChecked: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  profileName: string;
  profileAvatar: string;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  rolesChecked: false,
  isAdmin: false,
  isEditor: false,
  profileName: "",
  profileAvatar: "",
  refreshProfile: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [rolesChecked, setRolesChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");

  const checkRoles = async (userId: string) => {
    const [adminRes, editorRes] = await Promise.allSettled([
      supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
      supabase.rpc("has_role", { _user_id: userId, _role: "editor" }),
    ]);

    const adminValue =
      adminRes.status === "fulfilled" && !adminRes.value.error
        ? Boolean(adminRes.value.data)
        : false;

    const editorValue =
      editorRes.status === "fulfilled" && !editorRes.value.error
        ? Boolean(editorRes.value.data)
        : false;

    setIsAdmin(adminValue);
    setIsEditor(editorValue);
    setRolesChecked(true);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", userId)
      .single();
    if (data) {
      setProfileName(data.full_name || "");
      setProfileAvatar(data.avatar_url || "");
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        setRolesChecked(false);
        void checkRoles(nextSession.user.id);
        void fetchProfile(nextSession.user.id);
      } else {
        setIsAdmin(false);
        setIsEditor(false);
        setRolesChecked(true);
        setProfileName("");
        setProfileAvatar("");
      }

      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        setRolesChecked(false);
        void checkRoles(initialSession.user.id);
        void fetchProfile(initialSession.user.id);
      } else {
        setIsAdmin(false);
        setIsEditor(false);
        setRolesChecked(true);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsEditor(false);
    setRolesChecked(true);
    setProfileName("");
    setProfileAvatar("");
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, rolesChecked, isAdmin, isEditor, profileName, profileAvatar, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
