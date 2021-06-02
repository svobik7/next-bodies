import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import { ReactNode } from 'react'
import classes from 'styles/pages/post.module.scss'
import Layout from '../../components/layout/layout'

type Post = { id: number; title: string }

type PostPageProps = InferGetStaticPropsType<typeof getStaticProps> & {
  isSlaveBody: boolean
}

const PostPage = (props: PostPageProps) => {
  const { post, isSlaveBody = false } = props

  const router = useRouter()

  console.count('Rendering POST')

  return (
    <div className={classes.root}>
      <Head>
        <title>Post Body [Dynamic]</title>
      </Head>
      <h1>Post Body [Dynamic]</h1>
      <p>
        Dynamic data:{' '}
        <strong>
          {router.isFallback ? 'Loading data...' : JSON.stringify(post)}
        </strong>
      </p>
      <p>
        Current body: <strong>{isSlaveBody ? 'SLAVE' : 'MAIN'}</strong>
      </p>
      <p>
        This body component can be rendered in modal (as slave) only when any
        other body component has been already rendered as main body. When no
        mainBody exists then this Post Body component is rendered as mainBody.
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

PostPage.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context

  const id = params && params['id']

  if (!id) {
    return {
      notFound: true,
    }
  }
  // Call an external API endpoint to get post data.
  // You can use any data fetching library
  const post: Post = await new Promise((resolve) =>
    setTimeout(() => {
      resolve({ id: Number(id), title: `Post Title ${id}` })
    }, 3000),
  )

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      post,
    },
  }
}

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // Only `/posts/1` and `/posts/2` are generated at build time
    paths: [],
    // Enable statically generating additional pages
    // For example: `/posts/3`
    fallback: true,
  }
}

export default PostPage
