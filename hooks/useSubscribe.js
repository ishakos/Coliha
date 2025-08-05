import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SubscribeContext } from "../context/subscribeContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { checkFeatureAccess, retry } from "@/lib/useSubscribeLogic";

export function useSubscribe() {
  const { loading, user, domain, setLogged } = AuthContext?.() ?? {};
  const { setFeaturesPageLoading, setAuthorized } = SubscribeContext?.() ?? {};
  const pathname = usePathname?.();
  const router = useRouter?.();

  useEffect(() => {
    if (loading) return;
    const onFeature = async () => {
      setFeaturesPageLoading(true);
      setAuthorized(false);
      const currentPage = pathname.split("/").pop();
      const offerId = user?.purchasedOffer?.offer;
      try {
        await retry(
          () => checkFeatureAccess({ domain, currentPage, offerId }),
          2,
          1000,
          () => {
            setLogged(false);
          }
        );
        setAuthorized(true);
      } catch (err) {
        if (err?.response?.status === 403) {
          router.push("/no-access");
        } else if (err?.response?.status === 500) {
          toast.error("Something went wrong, reloading...");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } finally {
        setFeaturesPageLoading(false);
      }
    };

    onFeature();
  }, [
    loading,
    domain,
    pathname,
    user?.purchasedOffer?.offer,
    router,
    setAuthorized,
    setFeaturesPageLoading,
  ]);
}
