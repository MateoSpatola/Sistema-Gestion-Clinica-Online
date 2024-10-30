import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {

  private firestore = inject(AngularFirestore);

  setDocument(collection: string, data: any, documentId?: string): Promise<void> {
    return this.firestore.collection(collection).doc(documentId || undefined).set(data);
  }

  getDocument(collection: string) {
    return this.firestore.collection(collection).valueChanges();
  }

  updateDocument(collection: string, data: any, documentId: string): Promise<void> {
    return this.firestore.collection(collection).doc(documentId).update(data);
  }

  deleteDocument(collection: string, documentId: string): Promise<void> {
    return this.firestore.collection(collection).doc(documentId).delete();
  }

  convertTimestampToDate(timestamp: Timestamp): string {
    return new Date(timestamp.seconds * 1000).toLocaleString('es-ES', {hour12: false});
  }

}
