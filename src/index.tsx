import { AppProps } from 'next/app'
import React, { ComponentType, ReactElement, useEffect, useRef } from 'react'

/**
 * Defines how body layout works
 */
export type BodyLayout = (page: ReactElement, pageProps?: any) => ReactElement

/**
 * Defines optional layout getter on page component
 */
export type BodyComponent = ComponentType<any> & {
  getLayout?: BodyLayout
}

/**
 * Defines which props is required for using useBodies hook
 */
export type BodiesProps = {
  Component: BodyComponent
  currentPath: string
  isFallback: boolean
  pageProps: any
}

/**
 * Creates bodies props from Next.js app props
 * @param props
 */
export function createBodiesProps(props: AppProps): BodiesProps {
  return {
    Component: props.Component,
    currentPath: props.router.asPath,
    isFallback: props.router.isFallback,
    pageProps: props.pageProps,
  }
}

/**
 * Bodies allows rendering current component
 * in dialogs while keeping previous component stale
 * to keep layout unchanged.
 *
 * CurrentComponent - actual component to be rendered in current render-cycle
 * renderAsSlave - indicates if CurrentComponent is allowed to render as slaveBody
 *
 * MainBody - always contains component which should be rendered in main layout
 * SlaveBody - contains component which can be rendered in dialog
 * UseSlave - indicates if `slaveBody` can be rendered
 *
 * @param renderAsSlave indicates if props['Component'] is allowed to render as slaveBody
 */
export function useBodies(props: BodiesProps, renderAsSlave: boolean) {
  const { Component: CurrentBody, pageProps, currentPath, isFallback } = props

  // cache body components to keep layout stale
  // while CurrentBody is rendered as slave (in dialog)
  const mainBody = useRef<ReactElement | null>(null)
  const slaveBody = useRef<ReactElement | null>(null)

  // cache component's paths to prevent navigation back actions
  // from rendering the same component in both mainBody (in layout) and slaveBody (in dialog)
  const mainPath = useRef<string>()
  const slavePath = useRef<string>()

  // keep track of static page hydrate to prevent
  // rendering page in main body on first render when query is empty
  // while the same page is rendered in slave body when query is hydrated
  const isPathHydrated = !currentPath.match(/\[.*\]/)
  const mainPathHydrated = useRef<boolean>(isPathHydrated)

  // cache indicator which prevents CurrentBody
  // from being rendered as slaveBody (in dialog)
  const useSlave = useRef<boolean>(false)

  // indicates if current router path has already been cached as main
  // this is true usually when user closes dialog
  const isMainPath =
    !mainPathHydrated.current || mainPath.current === currentPath

  // clear slave cache when CurrentBody is not allowed to render as slave
  // or when main cache contains the same component as CurrentBody
  if (!renderAsSlave || isMainPath) {
    slaveBody.current = null
    slavePath.current = ''

    useSlave.current = false
  }

  // creates new slave component only when main component already exists,
  // current render is allowed as slave and the same current path is not main path
  if (renderAsSlave && mainBody.current && !isMainPath) {
    slaveBody.current = <CurrentBody {...pageProps} />
    slavePath.current = currentPath

    useSlave.current = true
  }

  // indicates if cached main component
  // should be invalidated and re-rendered again
  const shouldInvalidateMain = !isMainPath && !renderAsSlave

  // creates new main component only when is missing or when render is not allowed as slave
  // this is true on the first render or when navigating between non-dialog pages
  if (!mainBody.current || shouldInvalidateMain) {
    const getLayout = CurrentBody.getLayout || ((page) => page)

    mainBody.current = getLayout(<CurrentBody {...pageProps} />, pageProps)
    mainPath.current = currentPath
  }

  // clear cache when fallback render was done (getStaticProps)
  // this makes sure that fallback will be replaced on second render (once data are ready)
  useEffect(() => {
    if (isFallback && mainPath.current === currentPath) {
      mainBody.current = null
    }

    if (isFallback && slavePath.current === currentPath) {
      slaveBody.current = null
    }

    if (!mainPathHydrated.current && isPathHydrated) {
      mainPath.current = currentPath
      mainPathHydrated.current = true
    }
  })

  return {
    mainBody: mainBody.current,
    slaveBody: slaveBody.current,
    useSlave: useSlave.current,
  }
}
