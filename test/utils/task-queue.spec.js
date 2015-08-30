import sinon from 'sinon'
import expect from 'expect'
import taskQueueFn from '../../lib/utils/task-queue'
import * as constants from '../../lib/utils/constants'

describe('Utils', () => {

  describe('::taskQueue', () => {

    let options

    beforeEach(() => {
      options = {
        Promise: Promise,
        request: {
          maxParallel: 20
        }
      }
    })

    it('should expose public getter', () => {
      const taskQueue = taskQueueFn(options)
      expect(taskQueue.addTask).toBeA('function')
    })

    it('should add a task to the queue', done => {
      const taskQueue = taskQueueFn(Object.assign({}, options, {
        auth: {
          shouldRetrieveToken (cb) { cb(false) }
        }
      }))

      const _queue = taskQueue.getQueue()
      const spy = sinon.stub(_queue, 'push', payload => {
        return payload.resolve('ok')
      })

      const task = taskQueue.addTask({
        method: constants.get,
        url: 'https://api.sphere.io/foo'
      })
      task.then(res => {
        const call = spy.getCall(0).args[0]
        expect(call.fn).toBeA('function')
        expect(call.resolve).toBeA('function')
        expect(call.reject).toBeA('function')
        expect(res).toEqual('ok')
        done()
      })
      .catch(done)
    })

  })
})
