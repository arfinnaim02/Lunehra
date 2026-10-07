import type { Metadata } from "next";
import { CartProvider } from "../components/cart/cart-provider";
import { CartDrawer } from "../components/cart/cart-drawer";
import { AuthSessionProvider } from "../components/auth/session-provider";
import "./globals.css";

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
      <body>
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