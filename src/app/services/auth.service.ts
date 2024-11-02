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
  generatingUser: boolean = false;

  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signOut(): Promise<void> {
    return this.auth.signOut();
  }

  signUp(email: string, password: string, tipoUsuario: string): Promise<UserCredential> {
    const currentUser = this.auth.currentUser;
    return createUserWithEmailAndPassword(this.auth, email, password)
    .then(response => {
      return updateProfile(response.user, { displayName: tipoUsuario })
      .then(() => {
        return sendEmailVerification(response.user)
        .then(() => {
          if (currentUser) {
            return this.auth.updateCurrentUser(currentUser).then(() => response);
          } else {
            this.signOut();
            return response;
          }
        });
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
