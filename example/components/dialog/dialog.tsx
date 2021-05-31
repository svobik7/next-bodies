import { useRouter } from 'next/dist/client/router'
import { cloneElement, isValidElement, PropsWithChildren } from 'react'
import classes from './dialog.module.scss'

type DialogProps = PropsWithChildren<{
  isVisible: boolean
}>

export default function Dialog(props: DialogProps) {
  const { children, isVisible } = props

  const router = useRouter()

  if (!isVisible) return null

  return (
    <div className={classes.root}>
      <div className={classes.body}>
        <div className={classes.blockTop}>
          This is dialog component which is rendered only when current body
          component is rendered as slave.
        </div>
        {isValidElement(children) &&
          cloneElement(children, {
            isSlaveBody: true,
          })}
        <div className={classes.blockBottom}>
          <button
            role="button"
            className={classes.btnClose}
            onClick={() => router.back()}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
