import { renderHook } from '@testing-library/react-hooks'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Enzyme from 'enzyme'
import React from 'react'
import { AppWithBodiesProps, useBodies } from '../src'

Enzyme.configure({ adapter: new Adapter() })

describe('next-bodies', () => {
  /**
   * Test 'useBodies' hook
   * ---
   * It should creates links based on current roots context
   */
  describe('useBodies', () => {
    test('test mainBody', () => {
      const props: AppWithBodiesProps = {
        Component: function Body() {
          return <div>Main</div>
        },
        // @ts-ignore only asPath and isFallback is used in useBodies
        router: {
          asPath: '/',
          isFallback: false,
        },
        pageProps: {},
      }

      const { result } = renderHook(() => useBodies(props, false))

      expect(result.current.useSlave).toBeFalsy()
      expect(result.current.slaveBody).toBeNull()
      expect(
        Enzyme.shallow(result.current.mainBody).contains('Main'),
      ).toBeTruthy()
    })

    test('test slaveBody', () => {
      const propsMain: AppWithBodiesProps = {
        Component: function MainBody() {
          return <div>Main</div>
        },
        // @ts-ignore only asPath and isFallback is used in useBodies
        router: {
          asPath: '/',
          isFallback: false,
        },
        pageProps: {},
      }

      const propsSlave: AppWithBodiesProps = {
        Component: function SlaveBody() {
          return <div>Slave</div>
        },
        // @ts-ignore only asPath and isFallback is used in useBodies
        router: {
          asPath: '/modal-route',
          isFallback: false,
        },
        pageProps: {},
      }

      // const { result } = renderHook(() => {
      //   useBodies(propsMain, false)
      //   return useBodies(propsSlave, true)
      // })

      const { result, rerender } = renderHook(
        ({ props = propsMain, renderAsSlave = false }) =>
          useBodies(props, renderAsSlave),
      )

      rerender({ props: propsSlave, renderAsSlave: true })

      console.log(result.all)

      // expect(r2.current.useSlave).toBeTruthy()
      // expect(
      //   Enzyme.shallow(r2.current.slaveBody).contains('Slave'),
      // ).toBeTruthy()
      // expect(Enzyme.shallow(r2.current.mainBody).contains('Main')).toBeTruthy()
    })
  })
})
