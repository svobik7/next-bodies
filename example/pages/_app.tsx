import React from 'react'
import { AppWithBodiesProps, useBodies } from 'next-bodies'
import Dialog from '../components/dialog/dialog'

/**
 * Defines custom app behavior
 * @param props
 */
function MyApp(props: AppWithBodiesProps) {
  const { router } = props

  // use custom app component manager
  // to be able to render details in dialog while keeping main layout stale
  const {
    mainBody,
    slaveBody: dialogBody,
    useSlave: useDialog,
  } = useBodies(props, router.pathname === '/detail')

  return (
    <>
      {mainBody}

      <Dialog isVisible={useDialog}>{dialogBody}</Dialog>
    </>
  )
}
export default MyApp
