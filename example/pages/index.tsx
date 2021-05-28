import { ReactNode } from 'react'
import Layout from '../components/layout/layout'

const IndexPage = () => (
  <>
    <h1>Hello Next Bodies 👋</h1>
    <p>This is Index page which is always rendered as main body.</p>
  </>
)

IndexPage.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>
}

export default IndexPage
