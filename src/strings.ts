import { createContext, createElement, useCallback, useContext, useState, type ReactNode } from 'react'
import type { Lang } from './types'

// Product name. The single source: every UI string uses this. (Earlier working title: Care Circle.)
export const APP_NAME = 'Kita4U'

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
  circleCaption: {
    en: 'Demo Circle. Mei and Daniel agreed. Township role: proposed.',
    bm: 'Bulatan demo. Mei dan Daniel setuju. Peranan Taman: dicadangkan.',
    zh: '演示关怀圈。Mei 和 Daniel 已同意。社区角色：拟议中。',
  },
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

  // Home
  goodMorning: { en: 'Good morning', bm: 'Selamat pagi', zh: '早上好' },
  imOkay: { en: "I'm okay", bm: 'Saya okey', zh: '我很好' },
  footer: {
    en: `${APP_NAME} is not an emergency service.`,
    bm: `${APP_NAME} bukan perkhidmatan kecemasan.`,
    zh: `${APP_NAME} 不是紧急服务。`,
  },
  statusDue: { en: "You're due for your check-in.", bm: 'Masa untuk anda lapor diri.', zh: '该报平安了。' },
  statusAllSet: { en: "You're all set today.", bm: 'Anda sudah selesai hari ini.', zh: '今天已经完成了。' },
  heroCheckedIn: { en: 'Checked in {time}', bm: 'Sudah lapor diri {time}', zh: '{time} 已报平安' },
  statusAsked: { en: 'We asked {name} to check on you.', bm: 'Kami minta {name} tengok anda.', zh: '我们已请 {name} 去看看你。' },
  statusChecking: { en: '{name} is checking on you.', bm: '{name} sedang tengok anda.', zh: '{name} 正在确认你的情况。' },
  checkedInCard: { en: 'Checked in today', bm: 'Sudah lapor diri hari ini', zh: '今天已报平安' },
  reminderTitle: { en: 'Are you okay today?', bm: 'Anda okey hari ini?', zh: '你今天还好吗？' },
  imAway: { en: "I'm away", bm: 'Saya tiada di rumah', zh: '我不在家' },
  awayTitle: { en: 'You are away until {when}', bm: 'Anda tiada hingga {when}', zh: '你外出至 {when}' },
  awaySub: { en: 'Check-ins are paused.', bm: 'Lapor diri dihentikan sementara.', zh: '报平安已暂停。' },
  imBack: { en: "I'm back", bm: 'Saya sudah balik', zh: '我回来了' },
  awaySheetTitle: { en: 'How long will you be away?', bm: 'Berapa lama anda tiada?', zh: '你会外出多久？' },
  whenTomorrow: { en: 'tomorrow 09:00', bm: 'esok 09:00', zh: '明天 09:00' },
  whenOnDay: { en: '{day} 09:00', bm: '{day} 09:00', zh: '{day} 09:00' },
  awayDayOne: { en: '{n} day', bm: '{n} hari', zh: '{n} 天' },
  awayDays: { en: '{n} days', bm: '{n} hari', zh: '{n} 天' },
  fewerDays: { en: 'Fewer days', bm: 'Kurang hari', zh: '减少天数' },
  moreDays: { en: 'More days', bm: 'Tambah hari', zh: '增加天数' },
  awayPreview: { en: 'Away until {when}', bm: 'Tiada hingga {when}', zh: '外出至 {when}' },
  setAway: { en: 'Set away', bm: 'Tetapkan tiada', zh: '确定外出' },
  cancel: { en: 'Cancel', bm: 'Batal', zh: '取消' },
  chainTitle: { en: 'No check-in yet today', bm: 'Belum lapor diri hari ini', zh: '今天还没报平安' },
  contactCheckedTitle: { en: '{name} checked on you at {time}', bm: '{name} melawat anda pada {time}', zh: '{name} 在 {time} 来看过你' },
  contactCheckedSub: {
    en: "Tap I'm okay when you are ready.",
    bm: 'Tekan Saya okey bila anda sedia.',
    zh: '准备好时请点“我很好”。',
  },
  // Phase 11 Home cards. BM and 中文 are drafts.
  todayCheckIn: { en: "Today's check-in", bm: 'Pemeriksaan hari ini', zh: '今日报平安' },
  letThemKnow: { en: 'Let them know', bm: 'Beritahu mereka', zh: '让他们知道' },
  justOneTap: { en: 'Just one tap.', bm: 'Hanya satu ketikan.', zh: '只需点一下。' },
  allSet: { en: 'All set', bm: 'Siap', zh: '已完成' },
  checkedInHeading: { en: "You're checked in", bm: 'Anda sudah lapor diri', zh: '你已报平安' },
  needSomething: { en: 'Need something?', bm: 'Perlukan sesuatu?', zh: '需要什么？' },
  askYourCircle: { en: 'Ask your Circle', bm: 'Tanya Bulatan anda', zh: '问问你的关怀圈' },
  explainMessage: { en: 'Explain a message', bm: 'Terangkan satu mesej', zh: '解释一条信息' },
  makeSimple: { en: 'Make it simple', bm: 'Mudahkan', zh: '说得简单点' },
  askFavour: { en: 'Ask for a small favour', bm: 'Minta pertolongan kecil', zh: '请求一个小帮忙' },
  askMeiSub: { en: 'Ask Mei', bm: 'Tanya Mei', zh: '请 Mei 帮忙' },
  peopleWhoHelp: { en: 'People who help', bm: 'Orang yang membantu', zh: '帮助你的人' },

  // What is this? (message helper, simulated)
  chooseTitle: { en: 'Which message do you want to understand?', bm: 'Mesej mana yang anda mahu faham?', zh: '你想看懂哪一条信息？' },
  messageHelper: { en: 'Message helper', bm: 'Pembantu mesej', zh: '信息助手' },
  chooseAnother: { en: 'Choose another message', bm: 'Pilih mesej lain', zh: '选另一条信息' },
  inSimpleWords: { en: 'In simple words', bm: 'Dalam bahasa mudah', zh: '用简单的话说' },
  samplesLabel: { en: 'Sample messages for this prototype.', bm: 'Mesej contoh untuk prototaip ini.', zh: '本原型的示例信息。' },
  reading: { en: 'Reading…', bm: 'Membaca…', zh: '正在读取…' },
  suspiciousBox: {
    en: "This looks suspicious. Don't pay. Don't share your OTP.",
    bm: 'Ini nampak mencurigakan. Jangan bayar. Jangan kongsi OTP anda.',
    zh: '这看起来可疑。不要付钱。不要分享你的 OTP。',
  },
  normalBox: { en: 'This looks like a normal message.', bm: 'Ini nampak seperti mesej biasa.', zh: '这看起来是一条普通信息。' },
  demoTag: same('DEMO RESULT · SAMPLE MESSAGE'),
  askCardTitle: { en: 'Mum sent you a message', bm: 'Mak hantar mesej kepada anda', zh: '妈妈发了一条信息给你' },
  askVerdictSus: { en: 'This looks suspicious.', bm: 'Ini nampak mencurigakan.', zh: '这看起来可疑。' },
  readAloud: { en: 'Read aloud', bm: 'Baca kuat', zh: '朗读' },
  stopReading: { en: 'Stop reading', bm: 'Berhenti baca', zh: '停止朗读' },
  voiceLoading: { en: 'Looking for a voice…', bm: 'Mencari suara…', zh: '正在寻找语音…' },
  voiceUnavailable: { en: 'Voice not available on this device', bm: 'Suara tiada pada peranti ini', zh: '此设备没有可用语音' },
  askCircle: { en: 'Ask Daniel', bm: 'Tanya Daniel', zh: '问 Daniel' },
  showMessage: { en: 'Show message', bm: 'Tunjuk mesej', zh: '显示信息' },
  hideMessage: { en: 'Hide message', bm: 'Sembunyi mesej', zh: '隐藏信息' },
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
    en: 'We could not reach anyone yet.',
    bm: 'Kami belum dapat hubungi sesiapa lagi.',
    zh: '我们暂时还没联系上任何人。',
  },
  homeUnresolvedSub: { en: "If you are okay, tap I'm okay.", bm: 'Jika anda okey, tekan Saya okey.', zh: '如果你平安，请点“我很好”。' },

  // Contact card (Neighbour, Family, Community)
  contactHi: { en: 'Hi {name}', bm: 'Hai {name}', zh: '{name}，你好' },
  notAskedYet: { en: 'No one has asked you yet.', bm: 'Belum ada yang minta anda.', zh: '还没有人请你帮忙。' },
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
  // Phase 11 role views. BM and 中文 are drafts.
  neighbourView: { en: 'Neighbour view', bm: 'Paparan jiran', zh: '邻居视图' },
  communityView: { en: 'Community view', bm: 'Paparan komuniti', zh: '社区视图' },
  pillPleaseCheck: { en: 'Please check', bm: 'Sila tengok', zh: '请去看看' },
  canYouCheck: { en: 'Can you check on Aminah?', bm: 'Boleh anda tengok Aminah?', zh: '你能去看看 Aminah 吗？' },
  circleUpdated: { en: 'Circle updated', bm: 'Bulatan dikemas kini', zh: '关怀圈已更新' },
  thankYouName: { en: 'Thank you, {name}.', bm: 'Terima kasih, {name}.', zh: '谢谢你，{name}。' },
  everyoneAlerted: { en: 'Everyone alerted', bm: 'Semua telah dimaklumkan', zh: '已通知所有人' },
  forAminah: { en: 'For Aminah', bm: 'Untuk Aminah', zh: '给 Aminah' },
  noticeChain: { en: 'Notice chain', bm: 'Rantaian pemberitahuan', zh: '关注链' },
  whoKnows: { en: 'Who knows?', bm: 'Siapa tahu?', zh: '谁知道？' },

  // I need help (favour from the neighbour)
  smallFavour: { en: 'Small favour', bm: 'Pertolongan kecil', zh: '小帮忙' },
  helpPickTitle: { en: 'What can Mei help with?', bm: 'Mei boleh bantu apa?', zh: 'Mei 可以帮你什么？' },
  subGroceries: { en: 'Pick up a few items', bm: 'Ambil beberapa barang', zh: '买几样东西' },
  subPhone: { en: 'Help with a phone setting', bm: 'Bantu tetapan telefon', zh: '帮忙设置手机' },
  subClinic: { en: 'Ask for a lift', bm: 'Minta tumpang', zh: '请人载一程' },
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
  tlChecking: { en: '{name} saw the request and is checking', bm: '{name} nampak permintaan dan sedang tengok', zh: '{name} 已看到请求，正在查看' },
  tlNoReply: { en: 'No reply from {name}', bm: 'Tiada jawapan daripada {name}', zh: '{name} 没有回复' },
  tlNoOutcome: { en: 'No outcome from {name}', bm: 'Tiada keputusan daripada {name}', zh: '{name} 没有回报结果' },
  tlOk: { en: '{name} reported Aminah is OK', bm: '{name} melaporkan Aminah okey', zh: '{name} 回报 Aminah 平安' },
  fMumOk: { en: 'Mum is okay. Checked in {time}.', bm: 'Mak okey. Lapor diri {time}.', zh: '妈妈平安。{time} 已报平安。' },
  fNoCheckIn: { en: 'Mum has not checked in yet today.', bm: 'Mak belum lapor diri hari ini.', zh: '妈妈今天还没报平安。' },
  fReminder: { en: 'Mum has not checked in. We sent her a reminder.', bm: 'Mak belum lapor diri. Kami sudah hantar peringatan.', zh: '妈妈还没报平安。我们已提醒她。' },
  fAsked: { en: 'Mum has not checked in. We asked {name}.', bm: 'Mak belum lapor diri. Kami minta {name} tengok.', zh: '妈妈还没报平安。我们已请 {name} 去看看。' },
  fChecking: { en: '{name} is checking on Mum.', bm: '{name} sedang tengok Mak.', zh: '{name} 正在看妈妈。' },
  fChecked: { en: '{name} reported Mum is OK at {time}.', bm: '{name} melaporkan Mak okey pada {time}.', zh: '{name} 在 {time} 回报妈妈平安。' },
  fNeedsHelp: { en: '{name} says Mum needs help.', bm: '{name} kata Mak perlukan bantuan.', zh: '{name} 说妈妈需要帮助。' },
  fUnresolved: { en: 'No one has confirmed yet. Please try to reach Mum.', bm: 'Belum ada yang mengesahkan. Sila cuba hubungi Mak.', zh: '还没有人确认。请试着联系妈妈。' },
  fAway: { en: 'Mum is away until {when}.', bm: 'Mak tiada hingga {when}.', zh: '妈妈外出至 {when}。' },
  showAll: { en: 'Show all', bm: 'Tunjuk semua', zh: '显示全部' },
  showLess: { en: 'Show less', bm: 'Tunjuk kurang', zh: '收起' },
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
  stChecking: {
    en: '{name} saw the request and is checking {time}',
    bm: '{name} nampak permintaan dan sedang tengok {time}',
    zh: '{name} 已看到请求，正在查看 {time}',
  },
  stNoOutcome: { en: 'No outcome {time}', bm: 'Tiada keputusan {time}', zh: '{time} 无结果' },
  stOk: { en: 'Reported OK {time}', bm: 'Lapor okey {time}', zh: '{time} 回报平安' },
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
  demoViewsNote: {
    en: 'Prototype views. These are not tabs in the real app.',
    bm: 'Paparan prototaip. Ini bukan tab dalam aplikasi sebenar.',
    zh: '原型视图。这些不是真实应用里的标签页。',
  },
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
  // Phase 10: scripted demo chat and call (UI only, nothing stored). BM and 中文 are drafts.
  chatMei: { en: 'Message Mei', bm: 'Mesej Mei', zh: '给 Mei 发信息' },
  callMei: { en: 'Call Mei', bm: 'Telefon Mei', zh: '打电话给 Mei' },
  chatTag: same('DEMO CHAT · SCRIPTED'),
  callTag: same('DEMO CALL · NO REAL CALL IS MADE'),
  meiHello: {
    en: "Hi Mak Cik, I'll sort it out this morning. Anything else?",
    bm: 'Hai Mak Cik, saya akan uruskan pagi ini. Ada apa-apa lagi?',
    zh: 'Mak Cik 你好，我今天上午帮你处理。还有别的吗？',
  },
  replyThanks: { en: 'Thank you', bm: 'Terima kasih', zh: '谢谢你' },
  replyWhen: { en: 'What time will you come?', bm: 'Pukul berapa awak datang?', zh: '你几点来？' },
  replyDoor: { en: 'Please leave it at the door', bm: 'Tolong letak di depan pintu', zh: '请放在门口' },
  meiRThanks: { en: "You're welcome, Mak Cik.", bm: 'Sama-sama, Mak Cik.', zh: '不客气，Mak Cik。' },
  meiRWhen: { en: 'In about 15 minutes. I will knock.', bm: 'Lebih kurang 15 minit lagi. Saya akan ketuk pintu.', zh: '大约 15 分钟后。我会敲门。' },
  meiRDoor: { en: 'Okay. Doorstep only, as agreed.', bm: 'Baik. Di depan pintu sahaja, seperti dipersetujui.', zh: '好的。只在门口，按约定。' },
  callCalling: { en: 'Calling Mei… (demo)', bm: 'Menelefon Mei… (demo)', zh: '正在打给 Mei…（演示）' },
  callConnected: { en: 'Connected · 00:12 (simulated)', bm: 'Bersambung · 00:12 (simulasi)', zh: '已接通 · 00:12（模拟）' },
  endCall: { en: 'End call', bm: 'Tamat panggilan', zh: '结束通话' },
  day0: { en: 'Fri', bm: 'Jum', zh: '周五' },
  day1: { en: 'Sat', bm: 'Sab', zh: '周六' },
  day2: { en: 'Sun', bm: 'Ahd', zh: '周日' },
  day3: { en: 'Mon', bm: 'Isn', zh: '周一' },
  day4: { en: 'Tue', bm: 'Sel', zh: '周二' },
  day5: { en: 'Wed', bm: 'Rab', zh: '周三' },
  day6: { en: 'Thu', bm: 'Kha', zh: '周四' },
  // Phase 12B: Circle setup, Mei's invitation, preferences. BM and 中文 are drafts.
  setupStep: { en: 'Step {n} of 3', bm: 'Langkah {n} daripada 3', zh: '第 {n} 步，共 3 步' },
  setupPeopleTitle: { en: 'Your people', bm: 'Orang anda', zh: '你的关怀人' },
  willBeInvited: { en: 'Will be invited', bm: 'Akan dijemput', zh: '将会邀请' },
  familyDemo: { en: 'Family contact (demo)', bm: 'Kenalan keluarga (demo)', zh: '家人联系人（演示）' },
  townshipProposed: {
    en: 'Proposed role, to be agreed in a pilot. Example: township community team or guardhouse.',
    bm: 'Peranan dicadangkan, perlu dipersetujui dalam projek rintis. Contoh: pasukan komuniti taman atau pondok pengawal.',
    zh: '拟议角色，需在试点中商定。例如：社区团队或警卫亭。',
  },
  orderFixed: { en: 'The order is fixed in this prototype.', bm: 'Susunan ini tetap dalam prototaip ini.', zh: '在这个原型中，顺序是固定的。' },
  setupHelpTitle: { en: 'How can they help?', bm: 'Bagaimana mereka boleh bantu?', zh: '他们可以怎样帮忙？' },
  checkInBy: { en: 'Check-in by 09:00 (demo setting)', bm: 'Lapor diri sebelum 09:00 (tetapan demo)', zh: '09:00 前报平安（演示设置）' },
  switchOn: { en: 'On', bm: 'Hidup', zh: '开' },
  switchOff: { en: 'Off', bm: 'Mati', zh: '关' },
  setupMeetTitle: { en: 'Meet your Circle', bm: 'Kenali Bulatan anda', zh: '认识你的关怀圈' },
  introTitle: { en: 'Introduction session', bm: 'Sesi perkenalan', zh: '见面会' },
  introTag: same('PROPOSED TOWNSHIP PROGRAMME · EXAMPLE'),
  introText: { en: 'Example only. No real date or venue.', bm: 'Contoh sahaja. Tiada tarikh atau tempat sebenar.', zh: '仅为示例。没有真实的日期或地点。' },
  imInterested: { en: "I'm interested", bm: 'Saya berminat', zh: '我有兴趣' },
  interested: { en: 'Interested', bm: 'Berminat', zh: '有兴趣' },
  notYet: { en: 'Not yet', bm: 'Belum lagi', zh: '暂时没有' },
  next: { en: 'Next', bm: 'Seterusnya', zh: '下一步' },
  finish: { en: 'Finish', bm: 'Selesai', zh: '完成' },
  inviteEyebrow: { en: 'Circle invitation', bm: 'Jemputan Bulatan', zh: '关怀圈邀请' },
  inviteTitle: { en: 'Aminah invited you to her Circle.', bm: 'Aminah menjemput anda ke Bulatannya.', zh: 'Aminah 邀请你加入她的关怀圈。' },
  inviteDecline: { en: 'Decline', bm: 'Tolak', zh: '拒绝' },
  inviteAccepted: { en: "You're in Aminah's Circle.", bm: 'Anda dalam Bulatan Aminah.', zh: '你已在 Aminah 的关怀圈里。' },
  inviteDeclined: {
    en: 'You declined. Prototype only: in a real deployment, consent would be enforced by the backend.',
    bm: 'Anda menolak. Prototaip sahaja: dalam penggunaan sebenar, persetujuan akan dikuatkuasakan oleh sistem pelayan.',
    zh: '你已拒绝。这只是原型：在真实部署中，是否同意将由后台系统执行。',
  },
  circleCaptionPending: {
    en: 'Demo Circle. Mei has been invited. Township role: proposed.',
    bm: 'Bulatan demo. Mei telah dijemput. Peranan Taman: dicadangkan.',
    zh: '演示关怀圈。已邀请 Mei。社区角色：拟议中。',
  },
  circleCaptionDeclined: {
    en: 'Demo Circle. Mei declined. The prototype chain is unchanged.',
    bm: 'Bulatan demo. Mei menolak. Rantaian prototaip tidak berubah.',
    zh: '演示关怀圈。Mei 已拒绝。原型中的通知顺序不变。',
  },
  noHelpTypes: { en: 'No help types turned on.', bm: 'Tiada jenis bantuan dihidupkan.', zh: '没有开启任何帮忙类型。' },
  showSetup: { en: 'Show Circle setup', bm: 'Tunjuk persediaan Bulatan', zh: '显示关怀圈设置' },
  // Phase 12C: Ask / Help actions, parcel, 999. BM and 中文 are drafts.
  proposedRole: { en: 'Proposed role', bm: 'Peranan dicadangkan', zh: '拟议角色' },
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
