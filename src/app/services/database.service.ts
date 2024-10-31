import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class DatabaseService {

  private _firestore = inject(AngularFirestore);
  private _storage = inject(Storage);

  setDocument(collection: string, data: any, documentId?: string): Promise<void> {
    return this._firestore.collection(collection).doc(documentId || undefined).set(data);
  }

  getDocument(collection: string) {
    return this._firestore.collection(collection).valueChanges();
  }

  getDocumentById(collection: string, documentId: string): Promise<any> {
    return firstValueFrom(this._firestore.collection(collection).doc(documentId).valueChanges());
  }

  updateDocument(collection: string, data: any, documentId: string): Promise<void> {
    return this._firestore.collection(collection).doc(documentId).update(data);
  }

  deleteDocument(collection: string, documentId: string): Promise<void> {
    return this._firestore.collection(collection).doc(documentId).delete();
  }

  convertTimestampToDate(timestamp: Timestamp): string {
    return new Date(timestamp.seconds * 1000).toLocaleString('es-ES', {hour12: false});
  }

  async uploadImage(collection: string, image: Blob, imageName: string): Promise<string> {
    const storageRef = ref(this._storage, `${collection}/${imageName}`);
    await uploadBytes(storageRef, image);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }

}
