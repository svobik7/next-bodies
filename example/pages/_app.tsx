import 'styles/main.scss'
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
