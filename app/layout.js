import "../styles/globals.css";
import Header from "../components/Header";
import { AuthProvider } from "@/context/authContext";
import { SubscribeProvider } from "../context/subscribeContext";
import ErrorBoundaryWrapper from "@/components/errorBoundary/ErrorBoundaryWrapper";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Coliha",
  description:
    "The all-in-one dashboard for Foorweb sellers. Easily manage your products and send packages directly to shipping companies like ZR Express—no hassle, just growth.",
  icons: {
    icon: "../public/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SubscribeProvider>
            <ErrorBoundaryWrapper>
              <Toaster />
              <Header />
              {children}
            </ErrorBoundaryWrapper>
          </SubscribeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
