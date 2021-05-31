import Head from 'next/head'
import { ReactNode } from 'react'
import Layout from '../components/layout/layout'
import classes from 'styles/pages/detail.module.scss'

type DetailPageProps = { isSlaveBody: boolean }

const DetailPage = (props: DetailPageProps) => {
  const { isSlaveBody = false } = props

  console.count('Rendering DETAIL')

  return (
    <div className={classes.root}>
      <Head>
        <title>Detail body title works 👋</title>
      </Head>
      <h1>Detail Body</h1>
      <p>
        This body component can rendered as slaveBody only when mainBody has
        been already rendered and is different from this Detail body (in our
        case when Index Body component is rendered as mainBody). When no
        mainBody exists then Detail Body component is rendered as mainBody.
      </p>
      <p>
        Current body: <strong>{isSlaveBody ? 'SLAVE' : 'MAIN'}</strong>
      </p>
      {isSlaveBody && (
        <p>
          <button onClick={() => window.location.reload()}>
            Reload to render as MAIN body
          </button>
        </p>
      )}
    </div>
  )
}

DetailPage.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>
}

export default DetailPage
