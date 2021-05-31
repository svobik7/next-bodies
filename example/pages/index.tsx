import { ReactNode } from 'react'
import classes from 'styles/pages/index.module.scss'
import Layout from '../components/layout/layout'

const IndexPage = () => {
  console.count('Rendering INDEX')

  return (
    <div className={classes.root}>
      <h1>Index Body</h1>
      <p>
        This body component is always rendered as `mainBody` wrapped in layout
        component. It is never rendered in dialog because this example strictly
        defines that only detail page can be rendered as slave body.
        <code>
          // See _app.ts file:
          <br />
          const renderAsSlave = router.pathname === '/detail'
        </code>
      </p>
    </div>
  )
}

IndexPage.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>
}

export default IndexPage
