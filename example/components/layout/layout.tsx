import Head from 'next/head'
import Link from 'next/link'
import React, { PropsWithChildren } from 'react'
import classes from './layout.module.scss'

type LayoutProps = PropsWithChildren<{
  title?: string
}>

export default function Layout(props: LayoutProps) {
  const { children, title = 'Next Bodies 👋' } = props

  console.count('Rendering LAYOUT')

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
          <Link href="/posts/1">
            <a>Post 1</a>
          </Link>
          <Link href="/posts/2">
            <a>Post 2</a>
          </Link>
        </nav>
      </header>
      {children}
      <footer className={classes.footer}>
        <span>Elements border-colors:</span>
        <ul>
          <li data-type="cmp-layout">Component Layout</li>
          <li data-type="cmp-dialog">Component Dialog</li>
          <li data-type="page-index">Page Index</li>
          <li data-type="page-about">Page About</li>
          <li data-type="page-post">Page Post</li>
        </ul>
      </footer>
      Feel free to explore the code:{' '}
      <a href="https://github.com/svobik7/next-bodies">
        https://github.com/svobik7/next-bodies
      </a>
    </div>
  )
}
