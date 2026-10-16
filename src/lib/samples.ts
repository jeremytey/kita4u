import type { Lang } from '../types'

// Predefined, fictional sample messages. No AI is called; the explanations are written in advance.
export type SampleId = 'sms' | 'bill' | 'notice'

type L = Record<Lang, string>

export interface Sample {
  id: SampleId
  title: L
  sender: L
  message: L
  explanation: L // two sentences
  suspicious: boolean
}

export const SAMPLES: Sample[] = [
  {
    id: 'sms',
    title: { en: 'Suspicious SMS', bm: 'SMS mencurigakan', zh: '可疑短信' },
    sender: { en: 'Bank Setia (sample)', bm: 'Bank Setia (contoh)', zh: 'Bank Setia（示例）' },
    message: {
      en: 'Your bank account is LOCKED. Click bit.ly/setia-unlock now and enter the OTP we send you to open it again.',
      bm: 'Akaun bank anda DIKUNCI. Klik bit.ly/setia-unlock sekarang dan masukkan OTP yang kami hantar untuk membukanya semula.',
      zh: '您的银行账户已被锁定。请立即点击 bit.ly/setia-unlock，并输入我们发送的 OTP 以重新开通。',
    },
    explanation: {
      en: 'This message wants you to click a link and give your OTP. Your bank never asks for your OTP by message.',
      bm: 'Mesej ini mahu anda klik pautan dan beri OTP anda. Bank anda tidak pernah minta OTP melalui mesej.',
      zh: '这条信息要你点击链接并提供 OTP。银行从不通过信息索取你的 OTP。',
    },
    suspicious: true,
  },
  {
    id: 'bill',
    title: { en: 'Electricity bill', bm: 'Bil elektrik', zh: '电费单' },
    sender: { en: 'Electricity provider (sample)', bm: 'Pembekal elektrik (contoh)', zh: '电力公司（示例）' },
    message: {
      en: 'Your electricity bill for September is RM 86.40. Please pay by 30 October at a counter or in your usual app.',
      bm: 'Bil elektrik anda untuk September ialah RM 86.40. Sila bayar sebelum 30 Oktober di kaunter atau dalam aplikasi biasa anda.',
      zh: '您九月份的电费为 RM 86.40。请在 10 月 30 日前到柜台或用您平常的应用缴付。',
    },
    explanation: {
      en: 'This is your normal electricity bill for September. It is RM 86.40 and you can pay it the usual way by 30 October.',
      bm: 'Ini bil elektrik biasa anda untuk September. Jumlahnya RM 86.40 dan anda boleh bayar seperti biasa sebelum 30 Oktober.',
      zh: '这是你九月份的普通电费单。金额是 RM 86.40，可在 10 月 30 日前照常缴付。',
    },
    suspicious: false,
  },
  {
    id: 'notice',
    title: { en: 'Township notice', bm: 'Notis taman', zh: '社区通知' },
    sender: { en: 'Residents office (sample)', bm: 'Pejabat penduduk (contoh)', zh: '住户办公室（示例）' },
    message: {
      en: 'Notice: water supply will be cut on Saturday from 9am to 5pm for pipe repairs. Please store water the night before.',
      bm: 'Notis: bekalan air akan dipotong pada hari Sabtu dari 9 pagi hingga 5 petang untuk baiki paip. Sila simpan air pada malam sebelumnya.',
      zh: '通知：本周六上午 9 点至下午 5 点因修理水管停水。请在前一晚储水。',
    },
    explanation: {
      en: 'There will be no tap water this Saturday from 9am to 5pm. Fill a few buckets on Friday night.',
      bm: 'Tiada air paip pada hari Sabtu ini dari 9 pagi hingga 5 petang. Isi beberapa baldi pada malam Jumaat.',
      zh: '本周六上午 9 点到下午 5 点没有自来水。周五晚上先装几桶水。',
    },
    suspicious: false,
  },
]
