import test from 'tape'
import sinon from 'sinon'
import taskQueueFn from '../../lib/utils/task-queue'

test('Utils::taskQueue', t => {

  let options

  function setup () {
    options = {
      Promise: Promise,
      request: {
        maxParallel: 20
      }
    }
  }

  t.test('should expose public getter', t => {
    setup()

    const taskQueue = taskQueueFn(options)
    t.equal(typeof taskQueue.addTask, 'function')
    t.end()
  })

  t.test('should add a task to the queue', t => {
    setup()

    const taskQueue = taskQueueFn(Object.assign({}, options, {
      auth: {
        shouldRetrieveToken (cb) { cb(false) }
      }
    }))

    const _queue = taskQueue.getQueue()
    const spy = sinon.stub(_queue, 'push', payload => {
      return payload.resolve('ok')
    })

    const task = {
      method: 'GET',
      url: 'https://api.sphere.io/foo'
    }
    const taskFn = taskQueue.addTask(task)
    taskFn.then(res => {
      const call = spy.getCall(0).args[0]
      t.equal(typeof call.resolve, 'function')
      t.equal(typeof call.reject, 'function')
      t.deepEqual(call.description, task)
      t.equal(res, 'ok')
      t.end()
    })
    .catch(t.end)
  })

})
