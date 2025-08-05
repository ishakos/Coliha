"use client";

import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Header() {
  const {
    logged,
    setLogged,
    loading,
    purchasedOffer,
    setPurchasedOffer,
    imageUrl,
    setImageUrl,
    setOrders,
    setUser,
  } = AuthContext();
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("accessToken");
    setLogged(false);
    setPurchasedOffer([]);
    setImageUrl(null);
    setOrders([]);
    setUser({});
    router.push("/login");
  };

  // To load links of features when user is logged in
  const features = () => {
    if (!purchasedOffer?.features || loading) return null;
    const featureNames = ["Feature A", "Feature B", "Feature C", "Feature D"];

    return (
      <div className="flex flex-wrap gap-3">
        {purchasedOffer?.features?.map((feature, index) => (
          <Link
            key={index}
            href={`/dashboard/${feature}`}
            className="text-white hover:text-teal-300 transition duration-300 no-underline"
          >
            {featureNames[index]}
          </Link>
        ))}
        {purchasedOffer?.noAccess && (
          <Link
            href="/no-access"
            className="text-white hover:text-teal-300 transition duration-300 no-underline"
          >
            {purchasedOffer?.noAccess}
          </Link>
        )}
      </div>
    );
  };

  const headerItem = () => {
    // No header for specific paths
    if (
      /^\/(email-verification|reset-password)\/[^\/]+\/[^\/]+$/.test(
        pathname
      ) ||
      ["/forgot-password", "/reset-password", "/unwanted-page"].includes(
        pathname
      )
    ) {
      return null;
    }

    // if Loading, show a loading state
    if (loading) {
      return (
        <header className="text-center text-white py-4 bg-gray-800">
          Loading Header...
        </header>
      );
    }

    return (
      <header className="bg-gray-900 text-white shadow-lg py-4 px-6 flex flex-col md:flex-row justify-between items-center border-b border-gray-700">
        {/* Left side */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Home link */}
          <Link
            href={logged ? "/dashboard" : "/"}
            className="text-xl font-bold text-white hover:text-teal-400 transition duration-300 no-underline"
          >
            {logged ? "Dashboard" : "Home"}
          </Link>
          {/* Load (features + Subscriptions) links if user is logged in */}
          {logged && (
            <>
              {features()}
              <Link
                href="/subscriptions"
                className="text-white hover:text-teal-400 transition duration-300 no-underline"
              >
                Subscriptions
              </Link>
            </>
          )}
        </div>
        {/* Right side */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          {logged ? (
            <>
              {/* Profile picture */}
              {imageUrl ? (
                <div
                  className="w-12 h-12 bg-gray-400 rounded-full bg-cover bg-center border-2 border-white"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                ></div>
              ) : (
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-600 border-2 border-white text-xl font-bold">
                  <span role="img" aria-label="User">
                    👤
                  </span>
                </div>
              )}
              {/* Settings link */}
              <Link
                href="/settings"
                className="text-white hover:text-teal-400 transition duration-300 no-underline"
              >
                Settings
              </Link>
              {/* Logout Button */}
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg transition duration-300 text-white cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-teal-500 hover:bg-teal-700 px-4 py-2 rounded-lg transition duration-300 text-white no-underline"
            >
              Login
            </Link>
          )}
        </div>
      </header>
    );
  };

  return <>{headerItem()}</>;
}
