import { AppWithBodiesProps, useBodies } from 'next-bodies'
import 'styles/main.scss'
import Dialog from '../components/dialog/dialog'

/**
 * Defines custom app behavior
 * @param props
 */
function MyApp(props: AppWithBodiesProps) {
  const { router } = props

  // indicates if body component can be rendered as slave component (in dialog)
  // you can use your custom logic here (route parsing, query params, ...)
  const renderAsSlave = router.pathname === '/detail'

  // use custom app component manager
  // to be able to render details in dialog while keeping main layout stale
  const {
    mainBody,
    slaveBody: dialogBody,
    useSlave: useDialog,
  } = useBodies(props, renderAsSlave)

  return (
    <>
      {mainBody}

      <Dialog isVisible={useDialog}>{dialogBody}</Dialog>
    </>
  )
}
export default MyApp
