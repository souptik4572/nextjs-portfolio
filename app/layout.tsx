import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Souptik Sarkar | Software Engineer (SDE-2)",
  description:
    "Polyglot engineer with deep expertise in Java, Spring Boot, Golang, Python, and cloud-native systems. Open to senior engineering roles.",
  keywords: [
    "Souptik Sarkar",
    "SDE-2",
    "Software Engineer",
    "Java",
    "Spring Boot",
    "Golang",
    "Python",
    "Next.js",
    "AWS",
  ],
  authors: [{ name: "Souptik Sarkar" }],
  openGraph: {
    title: "Souptik Sarkar | Software Engineer (SDE-2)",
    description:
      "Polyglot engineer — Java, Spring Boot, Golang, Python, React, AWS.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
