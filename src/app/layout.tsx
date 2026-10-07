import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { CartProvider } from "../components/cart/cart-provider";
import { CartDrawer } from "../components/cart/cart-drawer";
import { AuthSessionProvider } from "../components/auth/session-provider";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Lunehra",
    template: "%s | Lunehra",
  },
  description:
    "Lunehra is a premium Bangladesh-based destination for ladies fashion, clothing and curated lifestyle collections.",
  applicationName: "Lunehra",
  keywords: [
    "Lunehra",
    "ladies fashion Bangladesh",
    "three piece Bangladesh",
    "kurti Bangladesh",
    "gown Bangladesh",
    "women clothing Bangladesh",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorantGaramond.variable} ${dmSans.variable}`}>
        <AuthSessionProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}