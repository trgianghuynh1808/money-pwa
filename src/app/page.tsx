'use client'

import Link from 'next/link'

export default function Home() {
  async function onClickAction() {
    console.log('run action')
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
