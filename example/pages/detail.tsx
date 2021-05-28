import Head from 'next/head'
import { ReactNode } from 'react'
import Layout from '../components/layout/layout'

const DetailPage = () => (
  <>
    <Head>
      <title>Detail Body</title>
    </Head>
    <h1>Detail Body 👋</h1>
    <p>
      This is Detail page which is showed in dialog when rendered as slave body
      otherwise it is rendered with layout.
    </p>
  </>
)

DetailPage.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>
}

export default DetailPage
