# next-bodies

Next.js utility for rendering multiple page components at once based on router pathname while keeping the layout stale.

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

## 1. Getting started

A complete example can be seen in the example directory.

### Installation

Add the package to your project dependencies

`yarn add next-bodies`

### How to use it

Add the hook call to your `_app.ts` and specify which page (route) can be rendered in overlay (as a slave):

```ts
const renderAsSlave = router.pathname === '/detail'

const {
    mainBody,
    slaveBody: dialogBody,
    useSlave: useDialog,
  } = useBodies(props, renderAsSlave)

```

To satisfy Typescript use following props types:

```ts
import { AppWithBodiesProps } from 'next-bodies'

function MyApp(props: AppWithBodiesProps) {
  // hook call and body rendering
}
```

Add body components rendering. In the following example, the main page component is rendered as usual while the slave page component is rendered in the custom dialog component.

```ts

return (
    <>
      {mainBody}

      <Dialog isVisible={useDialog}>{dialogBody}</Dialog>
    </>
  )
```

## 2. API

```ts
const {
    mainBody,
    slaveBody: dialogBody,
    useSlave: useDialog,
  } = useBodies(props, renderAsSlave)
```

### Params

- *props* - your application props
- *renderAsSlave* - indicates if the current page component is allowed to render as a slave (usually based on current route)

### API

- *mainBody* - always contains the first page component to render or any following page component which is not allowed to render as a slave
- *slaveBody* - contains the page component which is allowed to render as a slave only when mainBody component already exists
- *useSlave* - indicates if slaveBody should be rendered in the current render cycle

## 3. Layouts

Each page component can specify a custom layout which will be then automatically attached/detached during body rendering.

```ts
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
