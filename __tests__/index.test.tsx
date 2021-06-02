import { renderHook } from '@testing-library/react-hooks'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Enzyme from 'enzyme'
import React from 'react'
import { BodiesProps, createBodiesProps, useBodies } from '../src'

Enzyme.configure({ adapter: new Adapter() })

describe('next-bodies', () => {
  /**
   * Should create properly configured main and slave bodies component
   */
  describe('useBodies', () => {
    test('expect mainBody to be rendered and slaveBody to be null', () => {
      const props: BodiesProps = {
        Component: function Body() {
          return <div>Main text</div>
        },
        currentPath: '/',
        isFallback: false,
        pageProps: {},
      }

      const hook = renderHook(() => useBodies(props, false))

      expect(hook.result.current.mainBody).not.toBeNull()
      expect(hook.result.current.slaveBody).toBeNull()
      expect(hook.result.current.useSlave).toBeFalsy()

      const mainBody = Enzyme.shallow(hook.result.current.mainBody)
      expect(mainBody.text()).toBe('Main text')
    })

    test('expect mainBody to re-renders only once when currentPath is not changed', (done) => {
      const firstProps: BodiesProps = {
        Component: function Body({ ts }: { ts: number }) {
          return <div>Main timestamp: {ts}</div>
        },
        currentPath: '/',
        isFallback: false,
        pageProps: {
          ts: 1,
        },
      }

      const secondProps: BodiesProps = {
        ...firstProps,
        pageProps: {
          ts: 2,
        },
      }

      const hook = renderHook((props) => useBodies(props, false), {
        initialProps: firstProps,
      })

      expect(hook.result.current.mainBody).not.toBeNull()

      const mainBody = Enzyme.shallow(hook.result.current.mainBody)
      expect(mainBody.text()).toBe('Main timestamp: 1')

      hook.waitForNextUpdate().then(() => {
        const nextMainBody = Enzyme.shallow(hook.result.current.mainBody)
        expect(nextMainBody.text()).toBe('Main timestamp: 1')
        done()
      })

      hook.rerender(secondProps)
    })

    test('expect slaveBody to be rendered properly', (done) => {
      const mainProps: BodiesProps = {
        Component: function MainBody() {
          return <div>Main text</div>
        },
        currentPath: '/',
        isFallback: false,
        pageProps: {},
      }

      const slaveProps: BodiesProps = {
        Component: function SlaveBody() {
          return <div>Slave text</div>
        },
        currentPath: '/post',
        isFallback: false,
        pageProps: {},
      }

      const hook = renderHook(
        ({ props, renderAsSlave }) => useBodies(props, renderAsSlave),
        {
          initialProps: {
            props: mainProps,
            renderAsSlave: false,
          },
        },
      )

      expect(hook.result.current.slaveBody).toBeNull()
      expect(hook.result.current.useSlave).toBeFalsy()

      hook.waitForNextUpdate().then(() => {
        expect(hook.result.current.slaveBody).not.toBeNull()
        expect(hook.result.current.useSlave).toBeTruthy()

        const nextSlaveBody = Enzyme.shallow(hook.result.current.slaveBody)
        expect(nextSlaveBody.text()).toBe('Slave text')

        done()
      })

      hook.rerender({ props: slaveProps, renderAsSlave: true })
    })

    test('expect mainBody to be hydrated properly', (done) => {
      const notHydratedProps: BodiesProps = {
        Component: function Body({ ts }: { ts: number }) {
          return <div>Main timestamp: {ts || 0}</div>
        },
        currentPath: '/[slug]',
        isFallback: true,
        pageProps: {},
      }

      const alreadyHydratedProps: BodiesProps = {
        ...notHydratedProps,
        currentPath: '/post-slug',
        isFallback: false,
        pageProps: {
          ts: 100,
        },
      }

      const hook = renderHook((props) => useBodies(props, false), {
        initialProps: notHydratedProps,
      })

      expect(hook.result.current.mainBody).not.toBeNull()

      const mainBody = Enzyme.shallow(hook.result.current.mainBody)
      expect(mainBody.text()).toBe('Main timestamp: 0')

      hook.waitForNextUpdate().then(() => {
        const nextMainBody = Enzyme.shallow(hook.result.current.mainBody)
        expect(nextMainBody.text()).toBe('Main timestamp: 100')

        done()
      })

      hook.rerender(alreadyHydratedProps)
    })

    test('expect slaveBody cache is cleared after fallback is done', (done) => {
      const mainProps: BodiesProps = {
        Component: function Body() {
          return <div>Main text</div>
        },
        currentPath: '/main-slug',
        isFallback: false,
        pageProps: {},
      }

      const slaveProps: BodiesProps = {
        Component: function Body() {
          return <div>Slave text</div>
        },
        currentPath: '/slave-slug',
        isFallback: false,
        pageProps: {},
      }

      const hook = renderHook(
        ({ props, renderAsSlave }) => useBodies(props, renderAsSlave),
        {
          initialProps: { props: mainProps, renderAsSlave: false },
        },
      )

      hook.rerender({ props: slaveProps, renderAsSlave: true })

      hook.waitForNextUpdate().then(() => {
        expect(hook.result.current.mainBody).not.toBeNull()
        done()
      })

      hook.rerender({
        props: { ...slaveProps, isFallback: true },
        renderAsSlave: true,
      })
    })
  })
  /**
   * Should create bodies props properly from app props
   */
  describe('createBodiesProps', () => {
    test('expect createBodiesProps to adapt given AppProps properly', () => {
      const inputProps = {
        Component: 'Hello',
        router: {
          asPath: '/path',
          isFallback: true,
        },
        pageProps: {
          foo: 'bar',
        },
      }

      const resultProps = {
        Component: 'Hello',
        currentPath: '/path',
        isFallback: true,
        pageProps: {
          foo: 'bar',
        },
      }

      // NOTE: type casting is used to silence TS error
      // as we do not provide all Next app props
      // but only that props our hook use
      const bodiesProps = createBodiesProps(inputProps as any)
      expect(bodiesProps).toMatchObject(resultProps)
    })
  })
})
