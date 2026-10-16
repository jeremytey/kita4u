export type Lang = 'en' | 'bm' | 'zh'

export type Contact = 'neighbour' | 'family' | 'community'
export type Actor = 'resident' | Contact | 'system'
export type Role = 'resident' | Contact

export type Screen =
  | 'landing'
  | 'home'
  | 'whatIsThis'
  | 'needHelp'
  | 'contact'
  | 'neighbourHelp'
  | 'family'
  | 'community'

export type EventType =
  | 'CHECK_IN'
  | 'AWAY'
  | 'BACK'
  | 'MESSAGE_CHECKED'
  | 'ASKED_CIRCLE'
  | 'HELP_REQUESTED'
  | 'HELP_ACCEPTED'
  | 'HELP_DONE'
  | 'THANKS'
  | 'ALERTED'
  | 'CANT_NOW'
  | 'HUMAN_AWARE'
  | 'CONTACT_OK'
  | 'NEEDS_HELP'

// Time is in SIMULATED minutes. 0 = Day 0 (Friday) 00:00.
export interface AppEvent {
  type: EventType
  time: number
  actor: Actor
  meta?: Record<string, string | number | boolean>
}

export type Behaviour = 'noReply' | 'cantNow' | 'confirmsOk' | 'neverReports'
export type Behaviours = Record<Contact, Behaviour>

export type StepState = 'waiting' | 'asked' | 'noReply' | 'responded' | 'notNeeded'

export interface ChainStep {
  who: 'you' | Contact
  state: StepState
  time?: number
  // Contact said "I'll check" at some point. Stays true even after escalation.
  humanAware?: boolean
  outcome?: 'ok' | 'needsHelp' | 'noOutcome' | 'cantNow' | 'noReply' | 'missed' | 'checkedIn'
  outcomeTime?: number
}

export type CaseStatus =
  | 'none'
  | 'open'
  | 'beingChecked'
  | 'resolved'
  | 'unresolved'
  | 'needsHelp'
  | 'paused'

export interface ChainResult {
  steps: ChainStep[]
  status: CaseStatus
  caseOpenedAt?: number
  reminderAt?: number
  resolvedBy?: 'resident' | Contact
  resolvedAt?: number
  checkedInAt?: number
  awayUntil?: number
  // Events the engine derived from the clock and demo behaviours (alerts, simulated replies).
  derived: AppEvent[]
}

export type HomeStatus =
  | 'normal'
  | 'checkedIn'
  | 'reminder'
  | 'chainRunning'
  | 'away'
  | 'contactChecked'
  | 'needsHelp'
  | 'unresolved'
