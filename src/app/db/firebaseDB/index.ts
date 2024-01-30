import { TAddPayload } from '@/app/interfaces'
import { initializeApp } from 'firebase/app'
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

class FirebaseDB {
  private _db: Firestore

  constructor() {
    const config = {
      apiKey: process.env['NEXT_PUBLIC_FIREBASE_API_KEY'] ?? '',
      authDomain: process.env['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'] ?? '',
      projectId: process.env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'] ?? '',
      storageBucket: process.env['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'] ?? '',
      messagingSenderId:
        process.env['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'] ?? '',
      appId: process.env['NEXT_PUBLIC_FIREBASE_APP_ID'] ?? '',
    }

    const app = initializeApp(config)
    this._db = getFirestore(app)
  }

  public getActions<T = any>(collectionName: string): any {
    return {
      getAll: () => this._getAll<T>(collectionName),
      // getWithFilter: (
      //   filter: (value: T) => boolean,
      //   sort?: (a: T, b: T) => number,
      // ) => this._getWithFilter<T>(collectionName, filter, sort),
      getDetails: (key: string) => this._getDetails<T>(collectionName, key),
      add: (payload: TAddPayload) => this._add<T>(collectionName, payload),
      // update: (key: string, value: Partial<Omit<T, 'id'>>) =>
      //   this._update<T>(collectionName, key, value),
      // delete: (key: string) => this._delete(collectionName, key),
      // clearStore: () => this._clearStore(collectionName),
    }
  }

  private _getDataFromSnapshot<T = any>(snapshot: any): T[] {
    return snapshot.docs.map((doc: any) => {
      return {
        id: doc.id,
        ...doc.data(),
      } as T
    })
  }

  private async _getAll<T = any>(collectionName: string): Promise<T[]> {
    const docsRef = collection(this._db, collectionName)
    const querySnapshot = await getDocs(docsRef)

    return this._getDataFromSnapshot<T>(querySnapshot)
  }

  private async _getDetails<T = any>(
    collectionName: string,
    id: string,
  ): Promise<T | undefined> {
    const docRef = doc(this._db, collectionName, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap) return undefined

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as T
  }

  private async _add<T = any>(
    collectionName: string,
    payload: TAddPayload<T>,
  ): Promise<T> {
    const docRef = collection(this._db, collectionName)
    const newId = uuidv4()
    const newData = {
      ...payload,
      id: newId,
      created_at: new Date(),
      removed: false,
    }

    await setDoc(doc(docRef, newId), newData)

    return newData as T
  }
}

const firebaseDB = new FirebaseDB()

export default firebaseDB
