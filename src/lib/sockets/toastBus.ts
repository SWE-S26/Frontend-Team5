type ToastHandler = (data: any) => void;

let handler: ToastHandler | null = null;

export const toastBus = {
  register: (fn: ToastHandler) => {
    handler = fn;
  },
  emit: (data: any) => {
    handler?.(data);
  },
};
