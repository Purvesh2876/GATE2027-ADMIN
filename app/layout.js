import { Plus_Jakarta_Sans } from "next/font/google";
import { connection } from "next/server";
import "./tokens.css";
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SessionWatcher from "./components/SessionWatcher";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Book your stall · GATE 2027",
    template: "%s · GATE 2027",
  },
  description:
    "Book your stall at GATE 2027, the GCCI Annual Trade Expo, 22–24 April 2027 at Helipad Exhibition Centre, Gandhinagar.",
  // Kept out of search engines until the panel is launched.
  robots: { index: false, follow: false },
};

export const viewport = {
  themeColor: "#FFFFFF",
};

export default async function RootLayout({ children }) {
  // Every page is built fresh for each visitor. The security policy in
  // proxy.js carries a one-time code that Next.js can only attach to pages
  // built per request.
  await connection();

  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        <a className="skip" href="#main">Skip to main content</a>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
          <SessionWatcher />
        </AuthProvider>
      </body>
    </html>
  );
}
