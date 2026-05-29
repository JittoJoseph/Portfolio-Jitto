import type { Metadata } from "next";
import { GeistPixelSquare } from "geist/font/pixel";
import Script from "next/script";
import "./globals.css";

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
    images: [
      {
        url: "/icons/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Jitto Joseph Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Jitto Joseph | Software Engineer Portfolio",
    description:
      "Software Engineer with a passion for building scalable, user-centric applications.",
    images: ["/icons/android-chrome-512x512.png"],
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personId = "https://www.jittojoseph.xyz/#person";
  const person = {
    "@type": "Person",
    "@id": personId,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        name: "Jitto Joseph Portfolio",
        url: "https://www.jittojoseph.xyz",
        description:
          "Portfolio site showcasing software engineering experience, projects, and contact details.",
        publisher: {
          "@id": personId,
        },
        inLanguage: "en",
      },
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
      <body className={`${GeistPixelSquare.variable} antialiased`}>
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
