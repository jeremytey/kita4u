// Run: npx tsx src/lib/engine.selftest.ts
import { deriveChain, homeStatus } from './engine'
import type { AppEvent, Behaviours } from '../types'

const at = (h: number, m = 0, day = 0) => day * 1440 + h * 60 + m
const all = (b: Behaviours[keyof Behaviours]): Behaviours => ({ neighbour: b, family: b, community: b })
const assert = {
  equal(a: unknown, b: unknown, msg = '') {
    if (a !== b) throw new Error(`${msg} expected ${String(b)}, got ${String(a)}`)
  },
  ok(v: unknown, msg = 'expected truthy') {
    if (!v) throw new Error(msg)
  },
  deepEqual(a: unknown, b: unknown) {
    if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`not equal:\n${JSON.stringify(a)}\n${JSON.stringify(b)}`)
  },
}
let passed = 0
function test(name: string, fn: () => void) {
  fn()
  passed++
  console.log(`ok  ${name}`)
}

test('before 09:00 with no check-in: no case', () => {
  const r = deriveChain([], at(8, 30), all('noReply'))
  assert.equal(r.status, 'none')
  assert.equal(homeStatus(r), 'normal')
})

test('check-in before 09:00: no case', () => {
  const r = deriveChain([{ type: 'CHECK_IN', time: at(8, 10), actor: 'resident' }], at(14), all('noReply'))
  assert.equal(r.status, 'none')
  assert.equal(homeStatus(r), 'checkedIn')
  assert.equal(r.steps[1].state, 'notNeeded')
})

test('missed check-in: reminder at 09:15, neighbour alerted at 11:15', () => {
  const r1 = deriveChain([], at(10), all('noReply'))
  assert.equal(r1.status, 'open')
  assert.equal(r1.reminderAt, at(9, 15))
  assert.equal(homeStatus(r1), 'reminder')
  const r2 = deriveChain([], at(11, 15), all('noReply'))
  assert.equal(r2.steps[1].state, 'asked')
  assert.equal(r2.steps[1].time, at(11, 15))
  assert.equal(r2.steps[2].state, 'waiting')
  assert.equal(homeStatus(r2), 'chainRunning')
})

test('neighbour no reply: family alerted at 13:15', () => {
  const r1 = deriveChain([], at(13, 14), all('noReply'))
  assert.equal(r1.steps[1].state, 'asked')
  assert.equal(r1.steps[2].state, 'waiting')
  const r2 = deriveChain([], at(13, 15), all('noReply'))
  assert.equal(r2.steps[1].state, 'noReply')
  assert.equal(r2.steps[1].outcomeTime, at(13, 15))
  assert.equal(r2.steps[2].state, 'asked')
  assert.equal(r2.steps[2].time, at(13, 15))
})

test("neighbour can't now: family alerted at once", () => {
  const b: Behaviours = { neighbour: 'cantNow', family: 'noReply', community: 'noReply' }
  const r = deriveChain([], at(11, 31), b)
  assert.equal(r.steps[1].outcome, 'cantNow')
  assert.equal(r.steps[2].state, 'asked')
  assert.equal(r.steps[2].time, at(11, 30))
})

test("neighbour I'll check with no outcome: escalates after 1h, stays human aware", () => {
  const b: Behaviours = { neighbour: 'neverReports', family: 'noReply', community: 'noReply' }
  const r1 = deriveChain([], at(12), b)
  assert.equal(r1.status, 'beingChecked')
  assert.equal(r1.steps[1].state, 'responded')
  assert.equal(r1.steps[2].state, 'waiting')
  const r2 = deriveChain([], at(12, 30), b)
  assert.equal(r2.steps[1].humanAware, true)
  assert.equal(r2.steps[1].outcome, 'noOutcome')
  assert.equal(r2.steps[1].outcomeTime, at(12, 30))
  assert.equal(r2.steps[2].state, 'asked')
  assert.equal(r2.steps[2].time, at(12, 30))
  assert.equal(r2.status, 'beingChecked')
})

test('real tap overrides the demo behaviour', () => {
  const events: AppEvent[] = [
    { type: 'HUMAN_AWARE', time: at(11, 20), actor: 'neighbour' },
    { type: 'CONTACT_OK', time: at(11, 40), actor: 'neighbour' },
  ]
  const r = deriveChain(events, at(12), all('noReply'))
  assert.equal(r.status, 'resolved')
  assert.equal(r.resolvedBy, 'neighbour')
  assert.equal(r.resolvedAt, at(11, 40))
  assert.equal(homeStatus(r), 'contactChecked')
  assert.equal(r.checkedInAt, undefined, "She's OK is not a check-in")
})

test('demo path: neighbour never reports, family no reply, community confirms OK', () => {
  const b: Behaviours = { neighbour: 'neverReports', family: 'noReply', community: 'confirmsOk' }
  // neighbour aware 11:30, no outcome 12:30 -> family 12:30, no reply 14:30 -> community 14:30
  const r = deriveChain([], at(15, 30), b)
  assert.equal(r.steps[1].humanAware, true)
  assert.equal(r.steps[2].state, 'noReply')
  assert.equal(r.steps[3].time, at(14, 45))
  assert.equal(r.status, 'resolved')
  assert.equal(r.resolvedBy, 'community')
  assert.equal(r.resolvedAt, at(15))
})

test('everyone no reply ends unresolved', () => {
  const r1 = deriveChain([], at(17, 14), all('noReply'))
  assert.equal(r1.status, 'open')
  const r2 = deriveChain([], at(17, 15), all('noReply'))
  assert.equal(r2.status, 'unresolved')
  assert.ok(r2.steps.slice(1).every((s) => s.state === 'noReply'))
})

test('home shows unresolved, not the running chain', () => {
  const r = deriveChain([], at(18), all('noReply'))
  assert.equal(r.status, 'unresolved')
  assert.equal(homeStatus(r), 'unresolved')
})

test('home shows needs help', () => {
  const events: AppEvent[] = [
    { type: 'HUMAN_AWARE', time: at(11, 20), actor: 'neighbour' },
    { type: 'NEEDS_HELP', time: at(11, 35), actor: 'neighbour' },
  ]
  const r = deriveChain(events, at(12), all('noReply'))
  assert.equal(homeStatus(r), 'needsHelp')
  // A resident check-in closes it: resolved by resident, Home shows checked in.
  const r2 = deriveChain([...events, { type: 'CHECK_IN', time: at(12, 30), actor: 'resident' }], at(13), all('noReply'))
  assert.equal(r2.status, 'resolved')
  assert.equal(r2.resolvedBy, 'resident')
  assert.equal(homeStatus(r2), 'checkedIn')
  assert.equal(r2.steps[1].outcome, 'needsHelp', 'the Needs help entry stays in the log')
})

test('last contact checks but never reports: unresolved', () => {
  const r = deriveChain([], at(20), all('neverReports'))
  assert.equal(r.status, 'unresolved')
  assert.ok(r.steps.slice(1).every((s) => s.humanAware))
})

test('needs help alerts all remaining contacts at once', () => {
  const events: AppEvent[] = [
    { type: 'HUMAN_AWARE', time: at(11, 20), actor: 'neighbour' },
    { type: 'NEEDS_HELP', time: at(11, 35), actor: 'neighbour' },
  ]
  const r = deriveChain(events, at(12), all('noReply'))
  assert.equal(r.status, 'needsHelp')
  assert.equal(r.steps[2].state, 'asked')
  assert.equal(r.steps[3].state, 'asked')
  assert.equal(r.steps[3].time, at(11, 35))
})

test('late check-in closes the open case', () => {
  const events: AppEvent[] = [{ type: 'CHECK_IN', time: at(13, 30), actor: 'resident' }]
  const r = deriveChain(events, at(18), all('noReply'))
  assert.equal(r.status, 'resolved')
  assert.equal(r.resolvedBy, 'resident')
  assert.equal(r.steps[2].state, 'asked', 'family had been asked at 13:15')
  assert.equal(r.steps[3].state, 'notNeeded')
  assert.equal(homeStatus(r), 'checkedIn')
})

test("I'm away pauses everything; I'm back ends it", () => {
  const away: AppEvent[] = [{ type: 'AWAY', time: at(8), actor: 'resident', meta: { until: at(9, 0, 1) } }]
  const r1 = deriveChain(away, at(16), all('noReply'))
  assert.equal(r1.status, 'paused')
  assert.equal(homeStatus(r1), 'away')
  const back: AppEvent[] = [...away, { type: 'BACK', time: at(10), actor: 'resident' }]
  const r2 = deriveChain(back, at(16), all('noReply'))
  assert.equal(r2.status, 'none', 'was away at 09:00, so no case today')
  // Next day, the normal rules apply again.
  const r3 = deriveChain(back, at(12, 0, 1), all('noReply'))
  assert.equal(r3.status, 'open')
})

test('helper and help-request events change nothing', () => {
  const noise: AppEvent[] = [
    { type: 'MESSAGE_CHECKED', time: at(8, 30), actor: 'resident' },
    { type: 'ASKED_CIRCLE', time: at(8, 31), actor: 'resident' },
    { type: 'HELP_REQUESTED', time: at(8, 40), actor: 'resident' },
    { type: 'HELP_DECLINED', time: at(8, 42), actor: 'neighbour' },
    { type: 'HELP_ACCEPTED', time: at(8, 45), actor: 'neighbour' },
    { type: 'HELP_DONE', time: at(9, 30), actor: 'neighbour' },
    { type: 'THANKS', time: at(9, 35), actor: 'resident' },
  ]
  noise.push(
    { type: 'HELP_REQUESTED', time: at(11, 20), actor: 'resident' },
    { type: 'HELP_DECLINED', time: at(11, 25), actor: 'neighbour' },
    { type: 'HELP_ACCEPTED', time: at(11, 26), actor: 'neighbour' },
    { type: 'HELP_DONE', time: at(12, 0), actor: 'neighbour' },
  )
  for (const t of [at(8, 50), at(10), at(12), at(18)]) {
    const a = deriveChain([], t, all('noReply'))
    const b = deriveChain(noise, t, all('noReply'))
    assert.deepEqual(b.steps, a.steps)
    assert.equal(b.status, a.status)
  }
})

console.log(`\n${passed} tests passed`)
