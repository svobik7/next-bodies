# next-bodies

Next.js utility for rendering multiple page components at once based on router pathname while keeping the layout stale. This behavior is also know as contextual modal routing.

The most common use case would be to render the next (slave) page in an overlay (modal, dialog) while keeping the current (main) page unchanged and visible once the user clicks the page link.

Each page component can specify a custom layout in which the page will be wrapped when rendered as the main page.

Layouts in `next-bodies` package follow the [Adam Wathan Persistent Layouts Patters](https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/).

Thank you Adam for your clarification 👍

Using the `next-bodies` approach for orchestrate page dialogs includes:

1. No need to restore scroll positions after back navigation, as the main page is not removed from DOM
2. No unnecessary re-renders of the main page after the slave page is shown
3. No unnecessary re-renders of the main page when router pathname did not change
4. No need to manual opening the overlays - overlays are opened based on router change
5. No need to manual removing the layout when rendering the page in a dialog

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

  // indicates if body component can be rendered as slave component (in dialog)
  // you can use your custom logic here (route parsing, query params, ...)
  const renderAsSlave = router.pathname === '/detail'
  const bodiesProps = createBodiesProps(props)

  // use custom app component manager
  // to be able to render details in dialog while keeping main layout stale
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

Alternatively you do not have to use `createBodiesProps` instead you can provide `Component`, `currentPath`, `isFallback` and `pageProps` explicitly. See `BodiesProps` type.

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

- _props_ - your application props
- _renderAsSlave_ - indicates if the current page component is allowed to render as a slave (usually based on current route)

### API

- _mainBody_ - always contains the first page component to render or any following page component which is not allowed to render as a slave
- _slaveBody_ - contains the page component which is allowed to render as a slave only when mainBody component already exists
- _useSlave_ - indicates if slaveBody should be rendered in the current render cycle

## 3. Layouts

Each page component can specify a custom layout which will be then automatically attached/detached during body rendering.

```tsx
const IndexPage = () => {
  // ...
}

IndexPage.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>
}

export default IndexPage
```

When no page layout is specified then blank will be used:

```ts
const getLayout = CurrentBody.getLayout || ((page) => page)
```
