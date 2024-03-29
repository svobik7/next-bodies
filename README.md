# next-bodies

Next.js utility for rendering multiple page components at once based on router pathname while keeping the layout stale. This behavior is also know as contextual modal routing, route as modal. Supports Next.js 10 and dynamic routes (getStaticProps).

- Example can be found here: https://next-bodies.vercel.app

The most common use case would be to render the next (slave) page in an modal (overlay, dialog) while keeping the current (main) page unchanged and visible, once the user clicks the page link. The same approach is used on Reddit or Instagram posts.

Each page component can specify a custom layout in which the page will be wrapped when rendered as the main page.

Layouts in `next-bodies` package follow the [Adam Wathan Persistent Layouts Patters](https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/).

Thank you Adam for your clarification 👍

Using the `next-bodies` approach for orchestrate page modals includes:

1. No need to restore scroll positions after back navigation, as the main page is not removed from DOM
2. No unnecessary re-renders of the main page after the slave page is shown
3. No unnecessary re-renders of the main page when router pathname did not change
4. No need to manual opening the overlays - overlays are opened based on router change
5. No need to manual removing the layout when rendering the page in a dialog
6. Next.js v10 and dynamic routes (`getStaticProps`) support

> Next.js says: On many popular social media, opening a post will update the URL but won't trigger a navigation and will instead display the content inside a modal. This behavior ensures the user won't lose the current UI context (scroll position). The URL still reflect the post's actual page location and any refresh will bring the user there. This behavior ensures great UX without neglecting SEO.

## 1. Getting started

A complete example can be seen in the example directory.

### Installation

Add the package to your project dependencies

`yarn add next-bodies`

### How to use it

Add the hook call to your `_app.ts` and specify which page (route) can be rendered in modal (as a slave). In the following example, the main page component is rendered as usual while the slave page component is rendered in the custom dialog (modal) component.

```tsx
import { AppProps } from 'next/app'
import { createBodiesProps, useBodies } from 'next-bodies'
import Dialog from '../components/dialog/dialog'

/**
 * Defines custom app behavior
 * @param props
 */
function MyApp(props: AppProps) {
  const { router } = props

  // indicates if page can be rendered as slave body component (in modal)
  // you can use your custom logic here (route parsing, query params, ...)
  const renderAsSlave = router.pathname === '/posts/[id]'
  const bodiesProps = createBodiesProps(props)

  // use custom app component manager
  // to be able to render pages in modals
  // while keeping main layout stale
  const {
    mainBody,
    slaveBody: dialogBody,
    useSlave: useDialog,
  } = useBodies(bodiesProps, renderAsSlave)

  return (
    <>
      {mainBody}

      <Dialog isVisible={useDialog}>{dialogBody}</Dialog>
    </>
  )
}

export default MyApp
```

Alternatively you do not have to use `createBodiesProps` instead you can provide `Component`, `currentPath`, `isFallback` and `pageProps` explicitly. See [BodiesProps type](#BodiesProps).

> NOTE: Keep in mind that `Dialog` component in the example above is not part of `next-bodies` package. It can be replace with any of your custom overlay/modal component.

## 2. API

```ts
const {
  mainBody,
  slaveBody: dialogBody,
  useSlave: useDialog,
} = useBodies(props, renderAsSlave)
```

### Params

- _props_ - see [BodiesProps type](#BodiesProps)
- _renderAsSlave_ - indicates if the current page component is allowed to render as a slave (usually based on current route)

### API

- _mainBody_ - always contains the first page component to render or any following page component which is not allowed to render as a slave
- _slaveBody_ - contains the page component which is allowed to render as a slave only when mainBody component already exists
- _useSlave_ - indicates if slaveBody should be rendered in the current render cycle

### BodiesProps

```ts
{
  Component: BodyComponent,
  currentPath: string,
  isFallback: boolean,
  pageProps: any
}
```

## 3. Layouts

Each page component can specify a custom layout which will be then automatically attached/detached during body rendering. Current page props are pushed as second argument - this is useful for accessing `getStaticProps` data in layout function.

```tsx
const IndexPage = () => {
  // ...
}

IndexPage.getLayout = function getLayout(page: ReactNode, pageProps: any) {
  return <Layout>{page}</Layout>
}

export default IndexPage
```

When no page layout is specified then blank will be used:

```ts
const getLayout = CurrentBody.getLayout || ((page, pageProps) => page)
```
