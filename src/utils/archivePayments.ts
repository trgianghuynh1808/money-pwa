import dayjs from 'dayjs'
import { and, where } from 'firebase/firestore'

// *INFO: internal modules
import { firebaseDB, indexDB } from '@/db'
import { IPayment } from '@/interfaces'
import { handleSyncIntoOnlineDB } from './syncPayments'

const indexDBActions = indexDB.getActions<IPayment>('payments')
const firebaseDBActions = firebaseDB.getActions<IPayment>('payments')

export async function handleArchivePayments(): Promise<void> {
  // *INFO: sync rest data in offline payments to online DB
  await handleSyncIntoOnlineDB()

  // *INFO: clear all offline payments
  await indexDBActions.clearStore()

  // *INFO: update archive info in online DB
  const lastMonth = dayjs().subtract(1, 'month')
  const startLastMonthDate = lastMonth.startOf('month').toDate()
  const endLastMonthDate = lastMonth.endOf('month').toDate()

  const onlinePaymentsInLastMonth = await firebaseDBActions.getWithFilter(
    and(
      where('created_at', '>=', startLastMonthDate),
      where('created_at', '<=', endLastMonthDate),
    ),
  )

  const updatePromises = onlinePaymentsInLastMonth.map((item) => {
    return firebaseDBActions.update(item.id, {
      archived: true,
      archived_at: new Date(),
    })
  })

  await Promise.all(updatePromises)
}
