import Swal from 'sweetalert2';

export const showSuccess = (message) => {
  return Swal.fire({
    icon: 'success',
    title: 'Başarılı!',
    text: message,
    confirmButtonColor: '#198754',
    timer: 2000
  });
};

export const showError = (message) => {
  return Swal.fire({
    icon: 'error',
    title: 'Hata!',
    text: message,
    confirmButtonColor: '#dc3545'
  });
};

export const showWarning = (message) => {
  return Swal.fire({
    icon: 'warning',
    title: 'Uyarı!',
    text: message,
    confirmButtonColor: '#ffc107'
  });
};

export const showConfirm = async (title, text) => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Evet, Sil!',
    cancelButtonText: 'İptal'
  });
  
  return result.isConfirmed;
};

export const showInfo = (message) => {
  return Swal.fire({
    icon: 'info',
    title: 'Bilgi',
    text: message,
    confirmButtonColor: '#0dcaf0'
  });
};

