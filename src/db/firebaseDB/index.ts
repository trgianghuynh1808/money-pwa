import { initializeApp } from 'firebase/app'
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  query as queryBuilder,
  QueryCompositeFilterConstraint,
  setDoc,
  where,
} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

// *INFO: internal muodules
import { FirebaseActions, TAddPayload, TUpdatePayload } from '@/interfaces'

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

  public getActions<T = any>(collectionName: string): FirebaseActions<T> {
    return {
      getAll: () => this._getAll<T>(collectionName),
      getWithFilter: (query?: QueryCompositeFilterConstraint) =>
        this._getWithFilter<T>(collectionName, query),
      getDetails: (key: string) => this._getDetails<T>(collectionName, key),
      add: (payload: TAddPayload<T>) => this._add<T>(collectionName, payload),
      update: (key: string, value: TUpdatePayload<T>) =>
        this._update<T>(collectionName, key, value),
      delete: (key: string) => this._delete(collectionName, key),
    }
  }

  private _getDataFromSnapshot<T>(snapshot: any): T[] {
    return snapshot.docs.map((doc: any) => {
      return {
        id: doc.id,
        ...doc.data(),
      } as T
    })
  }

  private async _getAll<T>(collectionName: string): Promise<T[]> {
    const docsRef = collection(this._db, collectionName)
    // *INFO: fitler with soft delete
    const q = queryBuilder(docsRef, where('removed', '!=', true))
    const querySnapshot = await getDocs(q)

    return this._getDataFromSnapshot<T>(querySnapshot)
  }

  private async _getWithFilter<T>(
    collectionName: string,
    query?: QueryCompositeFilterConstraint,
  ): Promise<T[]> {
    const docsRef = collection(this._db, collectionName)
    const q = query ? queryBuilder(docsRef, query) : queryBuilder(docsRef)
    const querySnapshot = await getDocs(q)

    return this._getDataFromSnapshot<T>(querySnapshot)
  }

  private async _getDetails<T>(
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

  private async _add<T>(
    collectionName: string,
    payload: TAddPayload<T>,
  ): Promise<T | undefined> {
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

  private async _delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(this._db, collectionName, id)
    await setDoc(
      docRef,
      { removed: true, removed_at: new Date() },
      { merge: true },
    )
  }

  private async _update<T>(
    collectionName: string,
    id: string,
    value: Partial<Omit<T, 'id'>>,
  ): Promise<void> {
    const docRef = doc(this._db, collectionName, id)
    await setDoc(docRef, value, { merge: true })
  }
}

const firebaseDB = new FirebaseDB()

export default firebaseDB
