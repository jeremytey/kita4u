import { createContext, createElement, useCallback, useContext, useState, type ReactNode } from 'react'
import type { Lang } from './types'

// Working title, placeholder.
export const APP_NAME = 'Care Circle'

type Str = { en: string; bm: string; zh: string }
const same = (s: string): Str => ({ en: s, bm: s, zh: s })

export const S = {
  appName: same(APP_NAME),
  back: { en: 'Back', bm: 'Kembali', zh: '返回' },
  language: { en: 'Language', bm: 'Bahasa', zh: '语言' },

  // People. Everyone is fictional.
  residentName: same('Mak Cik Aminah'),
  unit: { en: 'Unit 12-3', bm: 'Unit 12-3', zh: '12-3 单位' },
  mei: same('Mei'),
  daniel: same('Daniel'),
  township: { en: 'Township Support', bm: 'Sokongan Taman', zh: '社区支援' },
  roleResident: { en: 'Resident', bm: 'Penduduk', zh: '居民' },
  roleNeighbour: { en: 'Neighbour', bm: 'Jiran', zh: '邻居' },
  roleSon: { en: 'Son', bm: 'Anak lelaki', zh: '儿子' },
  roleFamily: { en: 'Family', bm: 'Keluarga', zh: '家人' },
  roleCommunity: { en: 'Community', bm: 'Komuniti', zh: '社区' },
  yourCircle: { en: 'Your Circle', bm: 'Bulatan anda', zh: '你的关怀圈' },
  allAgreed: { en: 'All agreed to help', bm: 'Semua setuju membantu', zh: '都已同意帮忙' },
  simulated: same('SIMULATED'),

  // Landing
  tagline: {
    en: 'Ask when you need. Be noticed when you go quiet.',
    bm: 'Minta bila perlu. Diperhatikan bila anda senyap.',
    zh: '需要时开口。沉默时有人留意。',
  },
  landingIntro: {
    en: 'A small Circle of people who look out for a resident living alone.',
    bm: 'Bulatan kecil orang yang menjaga penduduk yang tinggal seorang.',
    zh: '一个小小的关怀圈，照看独居的居民。',
  },
  tryAs: { en: 'Try as Mak Cik Aminah', bm: 'Cuba sebagai Mak Cik Aminah', zh: '以 Mak Cik Aminah 身份试用' },
  demoMode: { en: 'Demo mode', bm: 'Mod demo', zh: '演示模式' },
  prototypeTag: {
    en: 'Prototype. Sample data. Simulated.',
    bm: 'Prototaip. Data contoh. Simulasi.',
    zh: '原型。示例数据。模拟。',
  },

  // Home
  goodMorning: { en: 'Good morning', bm: 'Selamat pagi', zh: '早上好' },
  imOkay: { en: "I'm okay", bm: 'Saya okey', zh: '我很好' },
  imOkaySub: { en: 'Tap once to check in', bm: 'Tekan sekali untuk lapor diri', zh: '点一下报平安' },
  whatIsThis: { en: 'What is this?', bm: 'Apa ini?', zh: '这是什么？' },
  whatIsThisSub: { en: 'Understand a message', bm: 'Fahami satu mesej', zh: '看懂一条信息' },
  needHelp: { en: 'I need help', bm: 'Saya perlukan bantuan', zh: '我需要帮忙' },
  needHelpSub: { en: 'Ask someone nearby', bm: 'Minta orang berdekatan', zh: '请附近的人帮忙' },
  footer: {
    en: `${APP_NAME} is not an emergency service.`,
    bm: `${APP_NAME} bukan perkhidmatan kecemasan.`,
    zh: `${APP_NAME} 不是紧急服务。`,
  },
  checkedInTitle: { en: 'You checked in at {time}', bm: 'Anda lapor diri pada {time}', zh: '你在 {time} 报了平安' },
  checkedInSub: { en: 'Your Circle can see you are okay.', bm: 'Bulatan anda tahu anda okey.', zh: '你的关怀圈知道你平安。' },
  checkedInCard: { en: 'Checked in today', bm: 'Sudah lapor diri hari ini', zh: '今天已报平安' },
  reminderTitle: { en: 'Are you okay today?', bm: 'Anda okey hari ini?', zh: '你今天还好吗？' },
  reminderSub: { en: 'Please tap I\'m okay.', bm: 'Sila tekan Saya okey.', zh: '请点“我很好”。' },
  imAway: { en: "I'm away", bm: 'Saya tiada di rumah', zh: '我不在家' },
  awayTitle: { en: 'You are away until {when}', bm: 'Anda tiada hingga {when}', zh: '你外出至 {when}' },
  awaySub: { en: 'Check-ins are paused.', bm: 'Lapor diri dihentikan sementara.', zh: '报平安已暂停。' },
  imBack: { en: "I'm back", bm: 'Saya sudah balik', zh: '我回来了' },
  awaySheetTitle: { en: 'How long will you be away?', bm: 'Berapa lama anda tiada?', zh: '你会外出多久？' },
  untilTomorrow: { en: 'Until tomorrow 09:00', bm: 'Hingga esok 09:00', zh: '到明天 09:00' },
  untilSunday: { en: 'Until Sunday 09:00', bm: 'Hingga Ahad 09:00', zh: '到星期日 09:00' },
  whenTomorrow: { en: 'tomorrow 09:00', bm: 'esok 09:00', zh: '明天 09:00' },
  whenSunday: { en: 'Sunday 09:00', bm: 'Ahad 09:00', zh: '星期日 09:00' },
  cancel: { en: 'Cancel', bm: 'Batal', zh: '取消' },
  chainTitle: { en: 'No check-in yet today', bm: 'Belum lapor diri hari ini', zh: '今天还没报平安' },
  chainSub: {
    en: 'We are asking your Circle, one at a time.',
    bm: 'Kami sedang bertanya Bulatan anda, seorang demi seorang.',
    zh: '我们正逐一询问你的关怀圈。',
  },
  contactCheckedTitle: { en: '{name} checked on you at {time}', bm: '{name} melawat anda pada {time}', zh: '{name} 在 {time} 来看过你' },
  contactCheckedSub: {
    en: "Tap I'm okay when you are ready.",
    bm: 'Tekan Saya okey bila anda sedia.',
    zh: '准备好时请点“我很好”。',
  },

  // What is this? (message helper, simulated)
  chooseTitle: { en: 'Which message do you want to understand?', bm: 'Mesej mana yang anda mahu faham?', zh: '你想看懂哪一条信息？' },
  samplesLabel: { en: 'Sample messages for this prototype.', bm: 'Mesej contoh untuk prototaip ini.', zh: '本原型的示例信息。' },
  reading: { en: 'Reading…', bm: 'Membaca…', zh: '正在读取…' },
  askQuestion: { en: 'Aminah: What does this message mean?', bm: 'Aminah: Apa maksud mesej ini?', zh: 'Aminah：这条信息是什么意思？' },
  suspiciousBox: {
    en: "This looks suspicious. Don't pay. Don't share your OTP.",
    bm: 'Ini nampak mencurigakan. Jangan bayar. Jangan kongsi OTP anda.',
    zh: '这看起来可疑。不要付钱。不要分享你的 OTP。',
  },
  normalBox: { en: 'This looks like a normal message.', bm: 'Ini nampak seperti mesej biasa.', zh: '这看起来是一条普通信息。' },
  demoTag: same('DEMO RESULT · SAMPLE MESSAGE'),
  readAloud: { en: 'Read aloud', bm: 'Baca kuat', zh: '朗读' },
  stopReading: { en: 'Stop reading', bm: 'Berhenti baca', zh: '停止朗读' },
  voiceLoading: { en: 'Looking for a voice…', bm: 'Mencari suara…', zh: '正在寻找语音…' },
  voiceUnavailable: { en: 'Voice not available on this device', bm: 'Suara tiada pada peranti ini', zh: '此设备没有可用语音' },
  askCircle: { en: 'Ask My Circle', bm: 'Tanya Bulatan Saya', zh: '问我的关怀圈' },
  done: { en: 'Done', bm: 'Selesai', zh: '完成' },
  whileHere: { en: "While you're here: tap I'm okay.", bm: 'Sementara di sini: tekan Saya okey.', zh: '顺便：点一下“我很好”。' },
  sentTo: { en: 'Sent to Daniel', bm: 'Dihantar kepada Daniel', zh: '已发送给 Daniel' },
  sentSub: {
    en: 'Daniel will see the message and what it means.',
    bm: 'Daniel akan lihat mesej ini dan maksudnya.',
    zh: 'Daniel 会看到这条信息和它的意思。',
  },
  goodAfternoon: { en: 'Good afternoon', bm: 'Selamat petang', zh: '下午好' },
  goodEvening: { en: 'Good evening', bm: 'Selamat malam', zh: '晚上好' },
  call999: { en: 'If this is an emergency, call 999.', bm: 'Jika ini kecemasan, hubungi 999.', zh: '如属紧急情况，请拨打 999。' },
  homeNeedsHelpTitle: { en: 'Your Circle has been told', bm: 'Bulatan anda sudah diberitahu', zh: '已通知你的关怀圈' },
  homeNeedsHelpSub: {
    en: '{name} asked everyone in your Circle to help you.',
    bm: '{name} sudah minta semua dalam Bulatan anda untuk membantu.',
    zh: '{name} 已请关怀圈里的每个人来帮你。',
  },
  homeUnresolvedTitle: {
    en: 'We have not reached anyone in your Circle yet.',
    bm: 'Kami belum dapat hubungi sesiapa dalam Bulatan anda.',
    zh: '我们还没联系上你关怀圈里的任何人。',
  },
  homeUnresolvedSub: { en: "If you are okay, tap I'm okay.", bm: 'Jika anda okey, tekan Saya okey.', zh: '如果你平安，请点“我很好”。' },

  // Contact card (Neighbour, Family, Community)
  contactHi: { en: 'Hi {name}', bm: 'Hai {name}', zh: '{name}，你好' },
  notAskedYet: { en: 'No one has asked you yet.', bm: 'Belum ada yang minta anda.', zh: '还没有人请你帮忙。' },
  pleaseCheck: {
    en: 'Please check on Mak Cik Aminah, Unit 12-3.',
    bm: 'Sila tengok Mak Cik Aminah, Unit 12-3.',
    zh: '请去看看 Mak Cik Aminah（12-3 单位）。',
  },
  noCheckInToday: { en: 'No check-in today.', bm: 'Tiada lapor diri hari ini.', zh: '今天没有报平安。' },
  askedAtTime: { en: 'Asked at {time}', bm: 'Ditanya pada {time}', zh: '{time} 询问' },
  illCheck: { en: "I'll check", bm: 'Saya akan tengok', zh: '我去看看' },
  cantNow: { en: "Can't now", bm: 'Tak boleh sekarang', zh: '现在不行' },
  whatDidYouFind: { en: 'You said you would check. What did you find?', bm: 'Anda kata akan tengok. Apa yang anda dapati?', zh: '你说会去看看。情况怎样？' },
  shesOk: { en: "She's OK", bm: 'Dia okey', zh: '她平安' },
  needsHelpBtn: { en: 'Needs help', bm: 'Perlukan bantuan', zh: '需要帮助' },
  movedTo: { en: 'This case has moved to {name}.', bm: 'Kes ini sudah beralih kepada {name}.', zh: '此个案已转给 {name}。' },
  caseResolved: { en: 'This case is resolved.', bm: 'Kes ini sudah selesai.', zh: '此个案已解决。' },
  needsHelpInfo: {
    en: '{name} found that Aminah needs help. Everyone in the Circle has been told.',
    bm: '{name} dapati Aminah perlukan bantuan. Semua dalam Bulatan sudah diberitahu.',
    zh: '{name} 发现 Aminah 需要帮助。关怀圈里的每个人都已收到通知。',
  },
  youReportedHelp: {
    en: 'You said Aminah needs help. Everyone in the Circle has been told.',
    bm: 'Anda kata Aminah perlukan bantuan. Semua dalam Bulatan sudah diberitahu.',
    zh: '你说 Aminah 需要帮助。关怀圈里的每个人都已收到通知。',
  },
  noOneConfirmed: { en: 'No one has confirmed yet.', bm: 'Belum ada yang mengesahkan.', zh: '还没有人确认。' },

  // I need help (favour from the neighbour)
  helpPickTitle: { en: 'What do you need help with?', bm: 'Anda perlukan bantuan apa?', zh: '你需要什么帮忙？' },
  taskGroceriesTitle: { en: 'Groceries', bm: 'Barang dapur', zh: '买菜' },
  taskPhoneTitle: { en: 'Phone help', bm: 'Bantuan telefon', zh: '手机帮忙' },
  taskClinicTitle: { en: 'Clinic ride', bm: 'Tumpang ke klinik', zh: '载去诊所' },
  taskGroceries: { en: 'groceries', bm: 'barang dapur', zh: '买菜' },
  taskPhone: { en: 'phone help', bm: 'bantuan telefon', zh: '看手机' },
  taskClinic: { en: 'a clinic ride', bm: 'tumpang ke klinik', zh: '载去诊所' },
  helpConfirmQ: { en: 'Ask Mei to help with {task}?', bm: 'Minta Mei bantu {task}?', zh: '请 Mei 帮忙{task}？' },
  yesAskMei: { en: 'Yes, ask Mei', bm: 'Ya, minta Mei', zh: '好，请 Mei 帮忙' },
  doorstepOnly: {
    en: 'Doorstep help only. No money or cards.',
    bm: 'Bantuan di depan pintu sahaja. Tiada wang atau kad.',
    zh: '只在门口帮忙。不涉及钱或银行卡。',
  },
  helpStatusTitle: { en: 'Your request: {task}', bm: 'Permintaan anda: {task}', zh: '你的请求：{task}' },
  trackRequested: { en: 'Requested {time}', bm: 'Diminta {time}', zh: '{time} 已请求' },
  trackAccepted: { en: 'Mei accepted {time}', bm: 'Mei terima {time}', zh: '{time} Mei 已接受' },
  trackWaitingMei: { en: 'Waiting for Mei', bm: 'Menunggu Mei', zh: '等待 Mei' },
  trackDone: { en: 'Done {time}', bm: 'Selesai {time}', zh: '{time} 已完成' },
  trackNotYet: { en: 'Done: not yet', bm: 'Selesai: belum', zh: '完成：还没' },
  meiCantNow: { en: "Mei can't help right now.", bm: 'Mei tak dapat bantu sekarang.', zh: 'Mei 现在没办法帮忙。' },
  askAgain: { en: 'Ask again', bm: 'Minta lagi', zh: '再请一次' },
  helpDoneTitle: { en: 'Mei helped you with {task}', bm: 'Mei sudah bantu {task}', zh: 'Mei 已帮你{task}' },
  sayThanks: { en: 'Say thanks', bm: 'Ucap terima kasih', zh: '道谢' },
  thanksSent: { en: 'Thanks sent to Mei', bm: 'Terima kasih dihantar kepada Mei', zh: '已向 Mei 道谢' },
  backHome: { en: 'Back to home', bm: 'Kembali ke laman utama', zh: '回到主页' },

  // Neighbour help card
  neighbourAsk: { en: 'Aminah asks for {task}.', bm: 'Aminah minta bantuan {task}.', zh: 'Aminah 请你帮忙{task}。' },
  accept: { en: 'Accept', bm: 'Terima', zh: '接受' },
  youAccepted: { en: 'You accepted. Tap Done when you have finished.', bm: 'Anda terima. Tekan Selesai bila sudah siap.', zh: '你已接受。完成后请点“完成”。' },
  youDeclined: { en: "You said you can't now.", bm: 'Anda kata tak boleh sekarang.', zh: '你说现在不行。' },
  helpFinished: { en: 'Done. Thank you for helping.', bm: 'Selesai. Terima kasih kerana membantu.', zh: '完成了。谢谢你的帮忙。' },
  aminahThanks: { en: 'Aminah says thanks.', bm: 'Aminah ucap terima kasih.', zh: 'Aminah 向你道谢。' },

  // Family (Daniel)
  familyTitle: { en: 'How is Mum?', bm: 'Bagaimana Mak?', zh: '妈妈还好吗？' },
  timelineTitle: { en: 'What happened', bm: 'Apa yang berlaku', zh: '发生了什么' },
  timelineEmpty: { en: 'Nothing yet today.', bm: 'Belum ada apa-apa hari ini.', zh: '今天还没有动态。' },
  thisWeek: { en: 'This week: {c}, {h}', bm: 'Minggu ini: {c}, {h}', zh: '本周：{c}，{h}' },
  wkCheckIn: { en: '{n} check-in', bm: '{n} lapor diri', zh: '报平安 {n} 次' },
  wkCheckIns: { en: '{n} check-ins', bm: '{n} lapor diri', zh: '报平安 {n} 次' },
  wkHelp: { en: '{n} help request', bm: '{n} permintaan bantuan', zh: '请求帮忙 {n} 次' },
  wkHelps: { en: '{n} help requests', bm: '{n} permintaan bantuan', zh: '请求帮忙 {n} 次' },
  sampleHistory: { en: 'Sample history for this demo', bm: 'Sejarah contoh untuk demo ini', zh: '本演示的示例记录' },
  privacy: {
    en: "No live location tracking. Only what's needed for a welfare check is shared.",
    bm: 'Tiada penjejakan lokasi langsung. Hanya maklumat yang perlu untuk semakan kebajikan dikongsi.',
    zh: '没有实时位置追踪。只分享关怀查看所需的信息。',
  },
  tlCheckIn: { en: 'Mum checked in', bm: 'Mak lapor diri', zh: '妈妈报了平安' },
  tlAway: { en: 'Mum is away until {when}', bm: 'Mak tiada hingga {when}', zh: '妈妈外出至 {when}' },
  tlBack: { en: 'Mum is back', bm: 'Mak sudah balik', zh: '妈妈回来了' },
  tlMessageChecked: { en: 'Mum checked a message', bm: 'Mak semak satu mesej', zh: '妈妈查看了一条信息' },
  tlSentSuspicious: {
    en: 'Message sent to you: this looks suspicious',
    bm: 'Mesej dihantar kepada anda: ini nampak mencurigakan',
    zh: '发给你的信息：这看起来可疑',
  },
  tlSentNormal: {
    en: 'Message sent to you: looks like a normal message',
    bm: 'Mesej dihantar kepada anda: nampak seperti mesej biasa',
    zh: '发给你的信息：看起来是普通信息',
  },
  tlHelpRequested: { en: 'Mum asked Mei for {task}', bm: 'Mak minta Mei bantu {task}', zh: '妈妈请 Mei 帮忙{task}' },
  tlHelpAccepted: { en: 'Mei said yes to {task}', bm: 'Mei setuju bantu {task}', zh: 'Mei 答应帮忙{task}' },
  tlHelpDeclined: { en: "Mei can't help with {task} right now", bm: 'Mei tak dapat bantu {task} sekarang', zh: 'Mei 现在没办法帮忙{task}' },
  tlHelpDone: { en: '{task} done by Mei', bm: '{task} selesai oleh Mei', zh: 'Mei 已完成{task}' },
  tlThanks: { en: 'Mum said thanks to Mei', bm: 'Mak ucap terima kasih kepada Mei', zh: '妈妈向 Mei 道谢' },
  tlMissed: { en: 'No check-in by 09:00', bm: 'Tiada lapor diri sebelum 09:00', zh: '09:00 前没有报平安' },
  tlReminder: { en: 'Reminder sent to Mum', bm: 'Peringatan dihantar kepada Mak', zh: '已提醒妈妈' },
  tlAlerted: { en: '{name} was asked to check', bm: '{name} diminta untuk tengok', zh: '已请 {name} 去看看' },
  tlCantNow: { en: "{name} can't check now", bm: '{name} tak boleh tengok sekarang', zh: '{name} 现在没法去看' },
  tlChecking: { en: '{name} is checking', bm: '{name} sedang tengok', zh: '{name} 正在查看' },
  tlNoReply: { en: 'No reply from {name}', bm: 'Tiada jawapan daripada {name}', zh: '{name} 没有回复' },
  tlNoOutcome: { en: 'No outcome from {name}', bm: 'Tiada keputusan daripada {name}', zh: '{name} 没有回报结果' },
  tlOk: { en: "{name}: She's OK", bm: '{name}: Dia okey', zh: '{name}：她平安' },
  tlNeedsHelp: { en: '{name}: Needs help', bm: '{name}: Perlukan bantuan', zh: '{name}：需要帮助' },
  tlUnresolved: { en: 'No one confirmed. Case unresolved', bm: 'Tiada yang sahkan. Kes belum selesai', zh: '没有人确认。个案未解决' },

  // Community (Township Support)
  communityTitle: { en: 'Cases', bm: 'Kes', zh: '个案' },
  caseWelfare: { en: 'Welfare check', bm: 'Semakan kebajikan', zh: '关怀查看' },
  caseHelp: { en: 'Help request', bm: 'Permintaan bantuan', zh: '请求帮忙' },
  stepReminder: { en: 'Reminder', bm: 'Peringatan', zh: '提醒' },
  helpStRequested: { en: 'Requested {time}', bm: 'Diminta {time}', zh: '{time} 已请求' },
  helpStAccepted: { en: 'Mei accepted {time}', bm: 'Mei terima {time}', zh: '{time} Mei 已接受' },
  helpStDone: { en: 'Done {time}', bm: 'Selesai {time}', zh: '{time} 已完成' },
  helpStDeclined: { en: "Mei can't help right now {time}", bm: 'Mei tak dapat bantu sekarang {time}', zh: '{time} Mei 现在没办法帮忙' },
  noCases: { en: 'No cases right now.', bm: 'Tiada kes buat masa ini.', zh: '目前没有个案。' },
  stagedNote: {
    en: 'Times in this demo are staged by the demo panel. They are not results.',
    bm: 'Masa dalam demo ini diatur oleh panel demo. Ia bukan keputusan sebenar.',
    zh: '本演示中的时间由演示面板安排，并非实际结果。',
  },

  // Chain bar
  stepYou: { en: 'You', bm: 'Anda', zh: '你' },
  stepAminah: same('Aminah'),
  stWaiting: { en: 'Waiting', bm: 'Menunggu', zh: '等待中' },
  stAsked: { en: 'Asked {time}', bm: 'Ditanya {time}', zh: '{time} 已询问' },
  stNoReply: { en: 'No reply {time}', bm: 'Tiada jawapan {time}', zh: '{time} 无回复' },
  stCantNow: { en: "Can't now {time}", bm: 'Tak boleh sekarang {time}', zh: '{time} 现在不行' },
  stChecking: { en: '{name} is checking {time}', bm: '{name} sedang tengok {time}', zh: '{name} 正在查看 {time}' },
  stNoOutcome: { en: 'No outcome {time}', bm: 'Tiada keputusan {time}', zh: '{time} 无结果' },
  stOk: { en: "She's OK {time}", bm: 'Dia okey {time}', zh: '{time} 她平安' },
  stNeedsHelp: { en: 'Needs help {time}', bm: 'Perlukan bantuan {time}', zh: '{time} 需要帮助' },
  stNotNeeded: { en: 'Not needed', bm: 'Tidak perlu', zh: '不需要' },
  stMissed: { en: 'No check-in by {time}', bm: 'Tiada lapor diri sebelum {time}', zh: '{time} 前未报平安' },
  stReminder: { en: 'Reminder {time}', bm: 'Peringatan {time}', zh: '{time} 已提醒' },
  stCheckedIn: { en: 'Checked in {time}', bm: 'Lapor diri {time}', zh: '{time} 已报平安' },
  stPaused: { en: 'Away, paused', bm: 'Tiada di rumah, dihentikan', zh: '外出，已暂停' },
  humanAware: { en: 'Human aware {time}', bm: 'Orang sudah tahu {time}', zh: '{time} 已有人知情' },
  csNone: { en: 'No case today', bm: 'Tiada kes hari ini', zh: '今天没有个案' },
  csOpen: { en: 'Asking the Circle', bm: 'Bertanya Bulatan', zh: '正在询问关怀圈' },
  csBeingChecked: { en: 'Being checked', bm: 'Sedang diperiksa', zh: '正在查看' },
  csResolved: { en: 'Resolved', bm: 'Selesai', zh: '已解决' },
  csResolvedByCheckIn: { en: "Resolved by Aminah's check-in", bm: 'Selesai dengan lapor diri Aminah', zh: '因 Aminah 报平安而解决' },
  csUnresolved: { en: 'Unresolved', bm: 'Belum selesai', zh: '未解决' },
  csNeedsHelp: { en: 'Needs help', bm: 'Perlukan bantuan', zh: '需要帮助' },
  csPaused: { en: 'Paused', bm: 'Dihentikan', zh: '已暂停' },

  // Demo panel (for the presenter)
  demoControls: { en: 'Demo controls', bm: 'Kawalan demo', zh: '演示控制' },
  demoReply: { en: 'Demo reply', bm: 'Jawapan demo', zh: '演示回复' },
  demoReplyNote: {
    en: 'This reply came from the demo panel, not a real person.',
    bm: 'Jawapan ini daripada panel demo, bukan orang sebenar.',
    zh: '这个回复来自演示面板，不是真人。',
  },
  demoPanel: { en: 'Demo panel', bm: 'Panel demo', zh: '演示面板' },
  close: { en: 'Close', bm: 'Tutup', zh: '关闭' },
  clock: { en: 'Clock', bm: 'Jam', zh: '时钟' },
  advanced: { en: 'Advanced', bm: 'Lanjutan', zh: '高级' },
  presets: { en: 'Start a story', bm: 'Mula cerita', zh: '开始一个情景' },
  pNormal: { en: 'Normal', bm: 'Biasa', zh: '平常' },
  pMissed: { en: 'Missed check-in', bm: 'Terlepas lapor diri', zh: '未报平安' },
  pHelp: { en: 'Help request', bm: 'Minta bantuan', zh: '请求帮忙' },
  pSample: { en: 'Sample message', bm: 'Mesej contoh', zh: '示例信息' },
  viewAs: { en: 'View as', bm: 'Lihat sebagai', zh: '查看身份' },
  behaviours: { en: 'How each contact replies', bm: 'Cara setiap kenalan menjawab', zh: '每位联系人如何回复' },
  bNoReply: { en: 'No reply', bm: 'Tiada jawapan', zh: '不回复' },
  bCantNow: { en: "Can't now", bm: 'Tak boleh sekarang', zh: '现在不行' },
  bConfirmsOk: { en: 'Checks and confirms OK', bm: 'Tengok dan sahkan okey', zh: '查看并确认平安' },
  bNeverReports: { en: 'Checks but never reports', bm: 'Tengok tapi tak lapor', zh: '查看但没回报' },
  behaviourNote: {
    en: 'Only used if nobody taps a real button on that contact’s screen.',
    bm: 'Hanya digunakan jika tiada butang sebenar ditekan pada skrin kenalan itu.',
    zh: '只有在该联系人的画面没有真正点按时才使用。',
  },
  reset: { en: 'Reset demo', bm: 'Set semula demo', zh: '重置演示' },
  day0: { en: 'Fri', bm: 'Jum', zh: '周五' },
  day1: { en: 'Sat', bm: 'Sab', zh: '周六' },
  day2: { en: 'Sun', bm: 'Ahd', zh: '周日' },
  day3: { en: 'Mon', bm: 'Isn', zh: '周一' },
  day4: { en: 'Tue', bm: 'Sel', zh: '周二' },
  day5: { en: 'Wed', bm: 'Rab', zh: '周三' },
  day6: { en: 'Thu', bm: 'Kha', zh: '周四' },
} satisfies Record<string, Str>

export type StrKey = keyof typeof S

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
})

const LANG_KEY = 'care-circle-lang'

function initialLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY)
    if (v === 'en' || v === 'bm' || v === 'zh') return v
  } catch {
    // ignore
  }
  return 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(LANG_KEY, l)
    } catch {
      // ignore
    }
  }, [])
  return createElement(LangContext.Provider, { value: { lang, setLang } }, children)
}

export function useLang() {
  return useContext(LangContext)
}

// t('key', { name: 'Mei' }) fills {name} placeholders.
export function useT() {
  const { lang } = useContext(LangContext)
  return useCallback(
    (key: StrKey, vars?: Record<string, string | number>) => {
      let s = S[key][lang]
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
      return s
    },
    [lang],
  )
}
