import { ToastError } from "../../components/toastify/Toast";

export const showError = (error) => {
    const {status, data} = error;
    ToastError(data?.errors[0]?.msg)
}