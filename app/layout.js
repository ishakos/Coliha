import "../styles/globals.css";
import Header from "../components/Header";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import "../styles/dashboard.css";

export const metadata = {
  title: "Home Page",
  description: "Description?",
};

export default function RootLayout({ children }) {
  const footer = <footer>Footer</footer>;

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          {children}
          {footer}
        </AuthProvider>
      </body>
    </html>
  );
}
