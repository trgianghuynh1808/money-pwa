// *INFO: internal modules
import { firebaseDB, indexDB } from '@/db'
import { IPayment, TAddPayload } from '@/interfaces'
import { convertUnixToDate, getValidArray } from './common'
import dayjs from 'dayjs'
import { Timestamp, and, where } from 'firebase/firestore'

const indexDBActions = indexDB.getActions<IPayment>('payments')
const firebaseDBActions = firebaseDB.getActions<IPayment>('payments')

async function getNotSyncedPayments(): Promise<IPayment[]> {
  const notSyncedPayments = await indexDBActions.getWithFilter(
    (item: IPayment) => {
      return item.synced === false
    },
  )

  return notSyncedPayments
}

async function getOnlinePaymentsInMonth(): Promise<IPayment[]> {
  const startInMonthDate = dayjs().startOf('month').toDate()
  const endInMonthDate = dayjs().endOf('month').toDate()

  const payments = await firebaseDBActions.getWithFilter(
    and(
      where('created_at', '>=', startInMonthDate),
      where('created_at', '<=', endInMonthDate),
    ),
  )

  return payments.filter(
    (item) => item.removed !== true && item.archived !== true,
  )
}

function addOnlinePaymentPromises(
  payments: IPayment[],
): Promise<IPayment | undefined>[] {
  const addPromises = payments.map((item: IPayment) => {
    const onlinePayment: TAddPayload<IPayment> = {
      ...item,
      synced: true,
      synced_at: new Date(),
    }
    return firebaseDBActions.add(onlinePayment)
  })

  return addPromises
}

function updateOnlinePaymentPromises(
  payments: IPayment[],
  onlinePayments: IPayment[],
): (Promise<void> | undefined)[] {
  const updatePromises = payments.map((payment: IPayment) => {
    const currentOnlinePayment = onlinePayments.find((item) => {
      return payment.indentity_id === item.indentity_id
    })
    let payload: Partial<IPayment> = {
      price: payment.price,
      synced: true,
      synced_at: new Date(),
    }

    if (payment.removed) {
      payload.removed = true
      payload.removed_at = new Date()
    }

    if (!currentOnlinePayment) return

    return firebaseDBActions.update(currentOnlinePayment.id, payload)
  })

  return updatePromises
}

async function updateSyncInfoPayments(payments: IPayment[]): Promise<void> {
  const allPayments = await indexDBActions.getAll()

  const updatePromises = getValidArray(payments).map((payment) => {
    const details = allPayments.find(
      (item) => item.indentity_id === payment.indentity_id,
    )

    if (!details) return

    return indexDBActions.update(details.id, {
      synced: true,
      synced_at: new Date(),
    })
  })

  await Promise.all(updatePromises)
}

function addOfflinePayments(
  payments: IPayment[],
): Promise<IPayment | undefined>[] {
  const addPromises = getValidArray(payments).map(async (payment) => {
    return indexDBActions.add({
      ...payment,
      updated_at: convertUnixToDate(payment.updated_at as any),
      synced_at: convertUnixToDate(payment.synced_at as any),
      payment_at: convertUnixToDate(payment.payment_at as any),
      created_at: convertUnixToDate(payment.created_at as any),
    } as any)
  })

  return addPromises
}

export async function handleSyncIntoOnlineDB(): Promise<void> {
  const [notSyncedOfflinePayments, onlinePayments] = await Promise.all([
    getNotSyncedPayments(),
    getOnlinePaymentsInMonth(),
  ])

  if (!notSyncedOfflinePayments?.length) return

  const onlinePaymentsIndentityIds = getValidArray(onlinePayments).map(
    (item) => item.indentity_id,
  )

  const [needAddPayments, needUpdatePayments] = [
    notSyncedOfflinePayments.filter((payment) => {
      return !onlinePaymentsIndentityIds.includes(payment.indentity_id)
    }),
    notSyncedOfflinePayments.filter((payment) => {
      return onlinePaymentsIndentityIds.includes(payment.indentity_id)
    }),
  ]

  const addPaymentPromises = addOnlinePaymentPromises(needAddPayments)
  const updatePaymentPromises = updateOnlinePaymentPromises(
    needUpdatePayments,
    onlinePayments,
  )

  await Promise.all([...addPaymentPromises, ...updatePaymentPromises])
  await updateSyncInfoPayments(notSyncedOfflinePayments)
}

export async function handleSyncIntoOfflineDB(): Promise<
  (IPayment | undefined)[]
> {
  // *INFO: clear all offline payments
  await indexDBActions.clearStore()

  const onlinePaymentsInMonth = await getOnlinePaymentsInMonth()
  const addPaymentPromises = addOfflinePayments(onlinePaymentsInMonth)

  const payments = await Promise.all(addPaymentPromises)
  return payments
}
