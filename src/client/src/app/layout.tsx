import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listo Shopping List",
  description: "This an application created for a University Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
