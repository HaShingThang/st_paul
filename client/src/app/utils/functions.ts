import { notAllowed, serverError } from '../constants/messages';
import { errorMessageDialog } from './alert-dialog';

export function showDialog(error: any) {
  if (Array.isArray(error.error.message)) {
    const message = error.error.message[0].messages[0].message;
    errorMessageDialog(message);
  } else {
    const message =
      error.error.message ?? error.statusText ?? serverError;
    errorMessageDialog(message);
  }
}
