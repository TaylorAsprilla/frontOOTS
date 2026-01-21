import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

export interface NotificationOptions {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  timer?: number;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  position?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'center'
    | 'center-start'
    | 'center-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end';
}

export interface SimpleNotification {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // Observable para notificaciones simples
  private notificationsSubject = new Subject<SimpleNotification>();
  public notifications$ = this.notificationsSubject.asObservable();

  /**
   * Configuración por defecto para las notificaciones
   */
  private defaultConfig: SweetAlertOptions = {
    position: 'top-end',
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    background: '#fff',
    color: '#545454',
    iconColor: '#545454',
    customClass: {
      container: 'swal-notification-container',
      popup: 'swal-notification-popup',
      title: 'swal-notification-title',
      htmlContainer: 'swal-notification-content',
      icon: 'swal-notification-icon',
    },
  };

  /**
   * Emite una notificación simple a través del observable
   */
  notify(notification: SimpleNotification): void {
    this.notificationsSubject.next(notification);
  }

  /**
   * Muestra una notificación de éxito
   */
  showSuccess(message: string, options?: NotificationOptions): Promise<any> {
    const config: SweetAlertOptions = {
      ...this.defaultConfig,
      icon: 'success',
      title: options?.title || '¡Éxito!',
      text: message,
      timer: options?.timer ?? 3000,
      ...options,
    };

    return Swal.fire(config);
  }

  /**
   * Muestra una notificación de error
   */
  showError(message: string, options?: NotificationOptions): Promise<any> {
    // Detectar si el mensaje contiene HTML
    const containsHtml = /<[a-z][\s\S]*>/i.test(message);

    const config: SweetAlertOptions = {
      ...this.defaultConfig,
      icon: 'error',
      title: options?.title || 'Error',
      ...(containsHtml ? { html: message } : { text: message }),
      timer: options?.timer ?? 5000,
      showConfirmButton: true,
      ...options,
    };

    return Swal.fire(config);
  }

  /**
   * Muestra una notificación de advertencia
   */
  showWarning(message: string, options?: NotificationOptions): Promise<any> {
    const config: SweetAlertOptions = {
      ...this.defaultConfig,
      icon: 'warning',
      title: options?.title || 'Advertencia',
      text: message,
      timer: options?.timer ?? 4000,
      showConfirmButton: true,
      ...options,
    };

    return Swal.fire(config);
  }

  /**
   * Muestra una notificación informativa
   */
  showInfo(message: string, options?: NotificationOptions): Promise<any> {
    const config: SweetAlertOptions = {
      ...this.defaultConfig,
      icon: 'info',
      title: options?.title || 'Información',
      text: message,
      timer: options?.timer ?? 4000,
      ...options,
    };

    return Swal.fire(config);
  }

  /**
   * Muestra un diálogo de confirmación
   */
  showConfirmation(message: string, options?: NotificationOptions): Promise<any> {
    const config: SweetAlertOptions = {
      title: options?.title || '¿Estás seguro?',
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: options?.confirmButtonText || 'Sí, confirmar',
      cancelButtonText: options?.cancelButtonText || 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      focusCancel: true,
      reverseButtons: true,
      ...options,
    };

    return Swal.fire(config);
  }

  /**
   * Muestra un diálogo de confirmación para eliminar
   */
  showDeleteConfirmation(itemName?: string, options?: NotificationOptions): Promise<any> {
    const message = itemName
      ? `Esta acción eliminará "${itemName}" de forma permanente.`
      : 'Esta acción es irreversible.';

    const config: SweetAlertOptions = {
      title: '¿Eliminar elemento?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      focusCancel: true,
      reverseButtons: true,
      ...options,
    };

    return Swal.fire(config);
  }

  /**
   * Muestra un diálogo de carga/loading
   */
  showLoading(message: string = 'Procesando...', options?: NotificationOptions): void {
    const config: SweetAlertOptions = {
      title: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      ...options,
    };

    Swal.fire(config);
  }

  /**
   * Cierra cualquier diálogo activo
   */
  close(): void {
    Swal.close();
  }

  /**
   * Muestra un diálogo personalizado
   */
  showCustom(config: SweetAlertOptions): Promise<any> {
    return Swal.fire(config);
  }

  /**
   * Muestra un input dialog
   */
  showInput(
    title: string,
    inputType:
      | 'text'
      | 'email'
      | 'password'
      | 'number'
      | 'tel'
      | 'range'
      | 'textarea'
      | 'select'
      | 'radio'
      | 'checkbox' = 'text',
    options?: NotificationOptions & {
      inputPlaceholder?: string;
      inputValue?: string;
      inputOptions?: Record<string, string>;
      inputValidator?: (value: string) => string | null;
    },
  ): Promise<any> {
    const config: SweetAlertOptions = {
      title: title,
      input: inputType,
      inputPlaceholder: options?.inputPlaceholder,
      inputValue: options?.inputValue,
      inputOptions: options?.inputOptions,
      inputValidator: options?.inputValidator,
      showCancelButton: true,
      confirmButtonText: options?.confirmButtonText || 'Aceptar',
      cancelButtonText: options?.cancelButtonText || 'Cancelar',
      ...options,
    };

    return Swal.fire(config);
  }
}
