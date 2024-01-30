'use client'

import Link from 'next/link'
import { firebaseDB } from '@/app/db'
import { Actions, IUser } from '@/app/interfaces'

export default function Home() {
  async function onClickAction() {
    console.log('run action')
    const actions: Actions<IUser> = firebaseDB.getActions<IUser>('users')

    const data = await actions.add({
      username: 'test',
      code: 'test',
    })

    console.log(data)
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
