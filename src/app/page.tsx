'use client'

import Link from 'next/link'
import { firebaseDB } from '@/app/db'
import { Actions, IUser } from '@/app/interfaces'

export default function Home() {
  async function onClickAction() {
    console.log('run action')
    const actions: Actions<IUser> = firebaseDB.getActions<IUser>('users')
    const testId = 'f59b457e-78cd-452a-aaa0-72df07216e79'

    await actions.delete(testId)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <p>Main page</p>
        <Link href={'/home'}>Home Page</Link>
        <div>
          <button onClick={onClickAction}>action</button>
        </div>
      </div>
    </main>
  )
}
