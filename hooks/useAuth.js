import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  const { logged, loading } = AuthContext();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      switch (pathname) {
        case "/":
        case "/login":
          if (logged) {
            router.push("/dashboard");
          }
          break;
        case "/settings":
        case "/no-access":
        case "/subscriptions":
        case "/dashboard":
          if (!logged) {
            router.push("/");
          }
          break;
        case "/dashboard/feature-a":
        case "/dashboard/feature-b":
        case "/dashboard/feature-c":
        case "/dashboard/feature-d":
          if (!logged) {
            router.push("/");
          }
          break;
        default:
      }
    }
  }, [logged, loading]);
}
