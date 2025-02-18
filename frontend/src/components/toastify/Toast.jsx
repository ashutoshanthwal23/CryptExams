
import { toast } from 'react-toastify';

export const ToastError = (msg) => {
    toast(msg, {
        position: "top-center",
        autoClose: 600,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
}

export const ToastSuccess = (msg) => {
    toast.success(msg, {
        position: "top-center",
        autoClose: 600,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
}

export const ToastInfo = (msg) => {
    toast.info(msg, {
        position: "top-center",
        autoClose: 600,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
}