/* src/app/layout.tsx */

import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Head from 'next/head';
import TableWrapper from '@/components/table-wrapper';

declare global {
  interface Window {
    // @ts-ignore
    gtag: any;
  }
}

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The DevOps Periodic Table',
  description:
    'An essential resource for cloud developers, engineers, architects, and consultants seeking to understand DevOps services.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ width: '100%' }}>
      <Head>
        <title>Azure Periodic Table</title>
        <meta property="og:title" content="DevOps Periodic Table" key="title" />
        <meta
          property="og:image"
          content="./periodic-table.png"
        />
        <meta property="og:image:alt" content="The DevOps Periodic Table" />
        <meta
          property="twitter:image"
          content="./periodic-table.png"
        />
        <meta property="twitter:image:alt" content="The DevOps Periodic Table" />
      </Head>
      <Script
        async
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', ${process.env.GA_TRACKING_ID});
        `}
      </Script>
      <body className={inter.className} style={{ width: '100%' }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TableWrapper>
            <>{children}</>
          </TableWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
