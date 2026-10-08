import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/shell/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tata Neu",
  description: "Tell us what's happening. We'll line up what you need.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <div className="canvas">
          <div className="phone">
            <div id="main">{children}</div>
            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}
