import Swal from 'sweetalert2';

export const errorMessageDialog = (message: string) =>
  Swal.fire({
    title: message,
    showCloseButton: true,
    customClass: {
      container: 'swal-container',
      popup: 'swal-dialog',
      title: 'swal-title',
      confirmButton: 'swal-confirm',
    },
  });

export const confirmationDialog = (message: string): Promise<any> => {
  return Swal.fire({
    title: message,
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    showCloseButton: true,
    reverseButtons: true,
    customClass: {
      container: 'swal-container',
      popup: 'swal-dialog',
      title: 'swal-title',
      closeButton: 'swal-close',
      confirmButton: 'swal-confirm',
      cancelButton: 'swal-cancel',
    },
  });
};

export const expiredDialog = (message: string): Promise<any> => {
  return Swal.fire({
    title: message,
    confirmButtonText: 'OK',
    customClass: {
      container: 'swal-container',
      popup: 'swal-dialog',
      title: 'swal-title',
      confirmButton: 'swal-confirm',
    },
  });
};
