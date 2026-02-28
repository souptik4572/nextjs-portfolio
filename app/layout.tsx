import type { Metadata } from "next";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "👨‍💻 Souptik Sarkar | Software Engineer",
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
    title: "👨‍💻 Souptik Sarkar | Software Engineer",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('portfolio-theme');
                  const theme = savedTheme || 'dark';
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
