import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tata Neu",
  description: "NeuPlan is a qualitative prototype. Your week. Planned around what matters.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <div className="canvas">
          <div className="phone" id="main">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
