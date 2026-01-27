import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jitto Joseph | Software Engineer Portfolio",
  description:
    "Software Engineer with a passion for building scalable, user-centric applications.",
  keywords: [
    "Jitto Joseph",
    "Software Engineer",
    "Web Developer",
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
    "Kerala",
    "India",
  ],
  authors: [{ name: "Jitto Joseph" }],
  creator: "Jitto Joseph",
  publisher: "Jitto Joseph",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.jittojoseph.xyz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jitto Joseph | Software Engineer Portfolio",
    description:
      "Software Engineer with a passion for building scalable, user-centric applications.",
    url: "https://www.jittojoseph.xyz",
    siteName: "Jitto Joseph Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "Jitto Joseph | Software Engineer Portfolio",
    description:
      "Software Engineer with a passion for building scalable, user-centric applications.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jitto Joseph",
    jobTitle: "Software Engineer",
    description:
      "Software Engineer with a passion for building scalable, user-centric applications.",
    url: "https://www.jittojoseph.xyz",
    sameAs: [
      "https://linkedin.com/in/jittojoseph17",
      "https://github.com/JittoJoseph",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kerala",
      addressCountry: "India",
    },
    knowsAbout: [
      "Web Development",
      "React",
      "Next.js",
      "TypeScript",
      "Full Stack Development",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-F0REMK7YMM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F0REMK7YMM');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
