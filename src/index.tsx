import { AppProps as NextAppProps } from 'next/app'
import React, { ReactNode, useEffect, useRef } from 'react'

export type AppBodyLayout = (page: ReactNode) => ReactNode

export type AppBodyComponent = NextAppProps['Component'] & {
  getLayout?: (page: ReactNode) => ReactNode
}

export type AppWithBodiesProps = NextAppProps & {
  Component: AppBodyComponent
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
export function useBodies(props: AppWithBodiesProps, renderAsSlave: boolean) {
  const { Component: CurrentBody, pageProps, router } = props

  // cache body components to keep layout stale
  // while CurrentBody is rendered as slave (in dialog)
  const mainBody = useRef<ReactNode>(null)
  const slaveBody = useRef<ReactNode>(null)

  // cache component's paths to prevent navigation back actions
  // from rendering the same component in both mainBody (in layout) and slaveBody (in dialog)
  const mainPath = useRef<string>()
  const slavePath = useRef<string>()

  // keep track of static page hydrate to prevent
  // rendering page in main body on first render when query is empty
  // while the same page is rendered in slave body when query is hydrated
  const isPathHydrated = !router.asPath.match(/\[.*\]/)
  const mainPathHydrated = useRef<ReactNode>(isPathHydrated)

  // cache indicator which prevents CurrentBody
  // from being rendered as slaveBody (in dialog)
  const useSlave = useRef<boolean>(false)

  // indicates if current router path has already been cached as main
  // this is true usually when user closes dialog
  const isMainPath =
    !mainPathHydrated.current || mainPath.current === router.asPath

  // clear slave cache when CurrentBody is not allowed to render as slave
  // or when main cache contains the same component as CurrentBody
  if (!renderAsSlave || isMainPath) {
    slaveBody.current = null
    slavePath.current = ''

    useSlave.current = false
  }

  // creates new slave component only when main component already exists,
  // current render is allowed as slave and the same detail has not been rendered as main component already
  if (renderAsSlave && mainBody.current && !isMainPath) {
    slaveBody.current = <CurrentBody {...pageProps} />
    slavePath.current = router.asPath

    useSlave.current = true
  }

  // creates new main component only when is missing or when render is not allowed as slave
  // this is true on the first render or when navigating between non-dialog pages
  if (!mainBody.current || !renderAsSlave) {
    const getLayout = CurrentBody.getLayout || ((page) => page)

    mainBody.current = getLayout(<CurrentBody {...pageProps} />)
    mainPath.current = router.asPath
  }

  // clear cache when fallback render was done (getStaticProps)
  // this makes sure that fallback will be replaced on second render (once data are ready)
  useEffect(() => {
    if (router.isFallback && mainPath.current === router.asPath) {
      mainBody.current = null
    }

    if (router.isFallback && slavePath.current === router.asPath) {
      slaveBody.current = null
    }

    if (!mainPathHydrated.current && isPathHydrated) {
      mainPath.current = router.asPath
      mainPathHydrated.current = true
    }
  })

  return {
    mainBody: mainBody.current,
    slaveBody: slaveBody.current,
    useSlave: useSlave.current,
  }
}
