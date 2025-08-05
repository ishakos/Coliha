import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/authContext";

export function useRedirect() {
  const { logged, loading } = AuthContext?.() ?? {};
  const pathname = usePathname?.();
  const router = useRouter?.();

  useEffect(() => {
    if (loading) return;

    const guestRoutes = ["/", "/login", "/register"];
    const protectedRoutes = [
      "/settings",
      "/no-access",
      "/subscriptions",
      "/dashboard",
      "/dashboard/feature-a",
      "/dashboard/feature-b",
      "/dashboard/feature-c",
      "/dashboard/feature-d",
    ];

    if (guestRoutes?.includes?.(pathname) && logged) {
      router?.push?.("/dashboard");
    }

    if (protectedRoutes?.includes?.(pathname) && !logged) {
      router?.push?.("/login");
    }
  }, [logged, loading, pathname, router]);
}
