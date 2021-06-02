import { ReactNode } from 'react'
import classes from 'styles/pages/about.module.scss'
import Layout from '../components/layout/layout'

const AboutPage = () => {
  console.count('Rendering ABOUT')
  return (
    <div className={classes.root}>
      <h1>About Body</h1>
      <p>
        This body component is always rendered as `mainBody` wrapped in layout
        component. It is never rendered in modal because this example strictly
        defines that only post page can be rendered in modal.
        <code>
          {'// See _app.ts file:'}
          <br />
          {"const renderAsSlave = router.pathname === '/posts/[id]'"}
        </code>
      </p>
    </div>
  )
}

AboutPage.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>
}

export default AboutPage
