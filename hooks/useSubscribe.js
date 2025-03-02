import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { AuthContext, SubscribeContext } from "../context/AuthContext";

export function useSubscribe() {
  const {  loading, purchasedOffer } = AuthContext();
  const { setFeaturesLoading, setAuthorized } =
    SubscribeContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setFeaturesLoading(true);
    if (loading) return;
    const routes = pathname.split("/");
    const currentPage = routes[routes.length - 1];
    if (purchasedOffer?.features?.includes(currentPage)) {
      setAuthorized(true);
    } else {
      router.push("/dashboard");
      setAuthorized(false);
    }
    setFeaturesLoading(false);
  }, [loading, purchasedOffer]);
}
