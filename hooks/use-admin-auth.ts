import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthUser {
  _id: string;
  email: string;
  role: "admin" | "moderator";
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  authenticated: boolean;
}

export function useAdminAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    authenticated: false,
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if localStorage has the auth flag
        const localAuth = localStorage.getItem("adminAuth");
        if (localAuth !== "authenticated") {
          setAuthState({ user: null, loading: false, authenticated: false });
          return;
        }

        // Then verify with the server
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setAuthState({
              user: data.user,
              loading: false,
              authenticated: true,
            });
          } else {
            // Server says not authenticated, clear localStorage
            localStorage.removeItem("adminAuth");
            setAuthState({ user: null, loading: false, authenticated: false });
          }
        } else {
          // Server error, clear localStorage
          localStorage.removeItem("adminAuth");
          setAuthState({ user: null, loading: false, authenticated: false });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("adminAuth");
        setAuthState({ user: null, loading: false, authenticated: false });
      }
    };

    checkAuth();
  }, []);

  const redirectToLogin = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  return {
    ...authState,
    redirectToLogin,
  };
}
