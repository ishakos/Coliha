"use client";

import Link from "next/link";
import { AuthContext, ProfilePicContext } from "../context/AuthContext";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Header() {
  const { logged, loading, purchasedOffer, setOrders } = AuthContext();
  const { imageUrl, pfpLoading } = ProfilePicContext();
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setOrders([]);
    router.push("/");
  };

  const features = () => {
    if (!purchasedOffer || loading) return null;
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
        {purchasedOffer.noAccess && (
          <Link
            href="/no-access"
            className="text-white hover:text-teal-300 transition duration-300 no-underline"
          >
            {purchasedOffer.noAccess}
          </Link>
        )}
      </div>
    );
  };

  const headerItem = () => {
    if (
      /^\/(email-verification|reset-password)\/[^\/]+\/[^\/]+$/.test(
        pathname
      ) ||
      ["/forgot-password", "/reset-password"].includes(pathname)
    ) {
      return null;
    }

    if (loading) {
      return (
        <header className="text-center text-white py-4 bg-gray-800">
          Loading Header...
        </header>
      );
    }

    return (
      <header className="bg-gray-900 text-white shadow-lg py-4 px-6 flex flex-col md:flex-row justify-between items-center border-b border-gray-700">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href={logged ? "/dashboard" : "/"}
            className="text-xl font-bold text-white hover:text-teal-400 transition duration-300 no-underline"
          >
            {pathname === "/" ? "Home" : "Go Home"}
          </Link>
          {logged && (
            <Link
              href="/dashboard"
              className="text-white hover:text-teal-400 transition duration-300 no-underline"
            >
              Dashboard
            </Link>
          )}
          {logged && features()}
          {logged && (
            <Link
              href="/subscriptions"
              className="text-white hover:text-teal-400 transition duration-300 no-underline"
            >
              Subscriptions
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          {logged ? (
            <>
              {!pfpLoading ? (
                <div
                  className="w-12 h-12 bg-gray-400 rounded-full bg-cover bg-center border-2 border-white"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                ></div>
              ) : (
                <p className="text-sm">Pfp loading...</p>
              )}
              <Link
                href="/settings"
                className="text-white hover:text-teal-400 transition duration-300 no-underline"
              >
                Settings
              </Link>
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
