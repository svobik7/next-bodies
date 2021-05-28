import Head from 'next/head'
import Link from 'next/link'
import React, { PropsWithChildren } from 'react'

type LayoutProps = PropsWithChildren<{
  title?: string
}>

export default function Layout(props: LayoutProps) {
  const { children, title = 'These are Next Bodies' } = props
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>{' '}
          |{' '}
          <Link href="/detail">
            <a>Detail</a>
          </Link>{' '}
        </nav>
      </header>
      {children}
      <footer>
        <hr />
        <span>I'm here to stay (Footer)</span>
      </footer>
    </div>
  )
}
