import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = inject(Auth);

  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signOut(): Promise<void> {
    return this.auth.signOut();
  }

  signUp(email: string, password: string, tipoUsuario: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
    .then(response => {
      return updateProfile(response.user, { displayName: tipoUsuario })
      .then(() => {
        return sendEmailVerification(response.user)
        .then(() => response);
      });
    });
  }

  sendVerificationEmail(user: any): Promise<void> {
    return sendEmailVerification(user);
  }

  sendRecoveryEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

}
