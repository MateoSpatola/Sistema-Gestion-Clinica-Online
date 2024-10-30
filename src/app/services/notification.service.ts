import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private router = inject(Router);

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  showAlert(message: string, icon: 'success' | 'error', duration: number) {
    Swal.fire({
      text: message,
      icon: icon,
      timer: duration,
      showConfirmButton: false,
    });
  }

  showLoadingAlert(message: string) {
    Swal.fire({
      text: message,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  closeAlert() {
    Swal.close();
  }

}
