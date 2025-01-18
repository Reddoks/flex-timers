const tapTest = require('tap').test
const { FlexTimerType, FlexTimer } = require('../build/index')

function delay (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

tapTest('Test RUN_IN timer', async function (t) {
  const timer = new FlexTimer(
    FlexTimerType.RUN_IN,
    10000,
    (params) => { console.log(`Test timeout. Params: ${JSON.stringify(params)}`) },
    { param: 'test' }
  )
  t.equal(typeof timer, 'object')
  t.ok(!timer.isActive)
  console.log('Timer created')
  console.log('Timer will go off in 10000 ms')
  timer.start()
  t.ok(timer.isActive)
  console.log('Timer started')
  await delay(10100)
  t.ok(!timer.isActive)
  console.log('Timer finished')
  t.end()
})

tapTest('Test RUN_AT timer', async function (t) {
  const targetTime = Date.now() + 10000
  const timer = new FlexTimer(
    FlexTimerType.RUN_AT,
    targetTime,
    (params) => { console.log(`Test timeout. Params: ${JSON.stringify(params)}`) },
    { param: 'test' }
  )
  t.equal(typeof timer, 'object')
  t.ok(!timer.isActive)
  console.log('Timer created')
  console.log(`Now ${new Date(Date.now()).toISOString()}`)
  console.log(`Timer will go off at ${new Date(targetTime).toISOString()}`)
  timer.start()
  t.ok(timer.isActive)
  console.log('Timer started')
  await delay(10100)
  t.ok(!timer.isActive)
  console.log('Timer finished')
  t.end()
})

tapTest('Test RUN_EVERY timer', async function (t) {
  const timer = new FlexTimer(
    FlexTimerType.RUN_EVERY,
    1500,
    (params) => { console.log(`Test timeout. Params: ${JSON.stringify(params)}`) },
    { param: 'test' }
  )
  t.equal(typeof timer, 'object')
  t.ok(!timer.isActive)
  console.log('Timer created')
  console.log('Timer will run 5 times with overrided params before stopped')
  timer.start({ param: 'overrided' })
  t.ok(timer.isActive)
  console.log('Timer started')
  await delay(7000)
  console.log('Trying to stop timer')
  t.ok(timer.isActive)
  timer.stop()
  t.ok(!timer.isActive)
  console.log('Timer finished')
  t.end()
})
