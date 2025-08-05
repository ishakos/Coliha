"use client";

import { AuthContext } from "../../context/authContext";
import OrdersAnalytics from "./OrdersAnalytics";

export default function Dashboard() {
  const { orders, user, purchasedOffer } = AuthContext();

  return (
    <>
      {!user?.verified ? (
        <p className="text-yellow-500 text-center mt-5">
          You need to verify your email. No Link? Re-send in settings.
        </p>
      ) : (
        <>
          {purchasedOffer && Object.keys(purchasedOffer).length === 0 ? (
            <p className="text-red-600 text-center mt-5">
              Your subscription has expired, please buy another one if you wish
              to use our features again
            </p>
          ) : (
            <>
              <div className="grid gap-6 w-full max-w-4xl mx-auto p-6">
                <>
                  {/* Orders Analytics Section */}
                  <div className="bg-white shadow-md rounded-lg p-6">
                    <OrdersAnalytics orders={orders} />
                  </div>
                </>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
