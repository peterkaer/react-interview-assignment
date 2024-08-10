import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang='en'>
      <head>
        <title>{`React.js / Next.js / Chakra UI / TanStack Query interview assignment`}</title>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}