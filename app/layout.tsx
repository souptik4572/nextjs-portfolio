import type { Metadata } from "next";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PortfolioDataProvider } from "@/contexts/PortfolioDataContext";
import { getPortfolioData } from "@/lib/getPortfolioData";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { meta, personal } = await getPortfolioData();
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: personal.name }],
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getPortfolioData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* FontShare: Archivo (headings) + Clash Display (body) */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=archivo@100,200,300,400,500,600,700,800,900&f[]=clash-display@200,300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('portfolio-theme');
                  var def = '${data.theme.defaultMode === "dark" ? "dark" : "light"}';
                  var theme = (saved === 'light' || saved === 'dark') ? saved : def;
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider defaultMode={data.theme.defaultMode}>
          <PortfolioDataProvider data={data}>
            {children}
          </PortfolioDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
