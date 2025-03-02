"use client";

import Link from "next/link";
import { AuthContext, ProfilePicContext } from "../context/AuthContext";
import { usePathname } from "next/navigation";

export default function Header() {
  const { logged, loading, purchasedOffer, setOrders } = AuthContext();
  const { imageUrl, pfpLoading } = ProfilePicContext();
  const pathname = usePathname();

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setOrders([]);
  };

  const features = () => {
    if (!purchasedOffer || loading) return <></>;
    const featureNames = ["Feature A", "Feature B", "Feature C", "Feature D"];

    return (
      <>
        {purchasedOffer?.features?.map((feature, index) => {
          return (
            <Link key={index} href={`/dashboard/${feature}`}>
              {featureNames[index]}
            </Link>
          );
        })}
        {purchasedOffer.noAccess ? (
          <Link href={"/no-access"}>{purchasedOffer.noAccess}</Link>
        ) : (
          <></>
        )}
      </>
    );
  };

  const headerItem = () => {
    //"email-verifcation/[token]/[id]" route
    if (/^\/email-verification\/[^\/]+\/[^\/]+$/.test(pathname)) {
      return <></>;
    }
    //"reset-password/[token]/[id]" route
    if (/^\/reset-password\/[^\/]+\/[^\/]+$/.test(pathname)) {
      return <></>;
    }
    if (pathname === "/forgot-password") {
      return <></>;
    }
    if (pathname === "/reset-password") {
      return <></>;
    }
    if (loading) {
      return <header>Loading Header...</header>;
    } else {
      switch (pathname) {
        case "/":
          return (
            <header>
              <p>Home</p>
              <p>header</p>
              {!logged ? (
                <Link href="/login">Login</Link>
              ) : (
                <p>Logging in...</p>
              )}
            </header>
          );
        case "/login":
          return (
            <header>
              {!logged ? <Link href={"/"}>Go home</Link> : <p>Logging in...</p>}
              <p>header</p>
              <p>Fill your infos</p>
            </header>
          );
        case "/register":
          return (
            <header>
              <Link href={logged ? "/dashboard" : "/"}>Go home</Link>
              <p>header</p>
              <Link href="/login">Login</Link>
            </header>
          );
        case "/unwanted-page":
          return (
            <header>
              <Link href={logged ? "/dashboard" : "/"}>Go home</Link>
              <p>header</p>
              <p>Error Page</p>
            </header>
          );
        case "/no-access":
        case "/settings":
        case "/subscriptions":
        case "/dashboard":
        case "/dashboard/feature-a":
        case "/dashboard/feature-b":
        case "/dashboard/feature-c":
        case "/dashboard/feature-d":
          if (logged) {
            return (
              <header>
                <Link href="/dashboard">Dashboard</Link>
                {features()}
                <Link href="/subscriptions">Subscriptions</Link>
                {!pfpLoading ? (
                  <div
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "50% 50%",
                      width: "60px", // Add width and height to see the background image
                      height: "60px",
                      borderRadius: "100%",
                    }}
                  ></div>
                ) : (
                  <p>Pfp loading...</p>
                )}
                <Link href="/settings">Settings</Link>
                <Link href="/" onClick={logout}>
                  Logout
                </Link>
              </header>
            );
          } else {
            return (
              <header>
                <p>Dashboard</p>
                <p>header</p>
                <p>Logging out...</p>
              </header>
            );
          }
        default:
          return <></>;
      }
    }
  };

  return <>{headerItem()}</>;
}
