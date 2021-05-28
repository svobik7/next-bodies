import { useRouter } from 'next/dist/client/router'
import { PropsWithChildren } from 'react'
import classes from './dialog.module.css'

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
        {children}
        <button
          role="button"
          className={classes.btnClose}
          onClick={() => router.back()}
        >
          Close
        </button>
      </div>
    </div>
  )
}
