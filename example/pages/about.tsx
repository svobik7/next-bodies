import { ReactNode } from 'react'
import Layout from '../components/layout/layout'
import classes from 'styles/pages/about.module.scss'

const AboutPage = () => {
  console.count('Rendering ABOUT')
  return (
    <div className={classes.root}>
      <h1>About Body</h1>
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

AboutPage.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>
}

export default AboutPage
