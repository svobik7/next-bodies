import Head from 'next/head'
import Link from 'next/link'
import React, { PropsWithChildren } from 'react'
import classes from './layout.module.scss'

type LayoutProps = PropsWithChildren<{
  title?: string
}>

export default function Layout(props: LayoutProps) {
  const { children, title = 'Next Bodies 👋' } = props
  return (
    <div className={classes.root}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <header className={classes.header}>
        Navigation:
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/about">
            <a>About</a>
          </Link>
          <Link href="/detail">
            <a>Detail</a>
          </Link>
        </nav>
      </header>

      {children}

      <footer className={classes.footer}>
        <span>Elements border-colors:</span>
        <ul>
          <li data-type="page-index">Index Page</li>
          <li data-type="page-detail">Detail Page</li>
          <li data-type="page-about">About Page</li>
          <li data-type="cmp-layout">Layout Component</li>
          <li data-type="cmp-dialog">Dialog Component</li>
        </ul>
      </footer>
    </div>
  )
}
