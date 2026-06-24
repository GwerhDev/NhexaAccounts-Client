import { ref } from 'vue';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
  duration: number;
}

const toasts = ref<Toast[]>([]);
let counter = 0;

export const useToast = () => {
  const remove = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  const push = (type: Toast['type'], message: string, duration = 3500) => {
    const id = ++counter;
    toasts.value.push({ id, type, message, duration });
    setTimeout(() => remove(id), duration);
  };

  return {
    toasts,
    success: (msg: string) => push('success', msg),
    error: (msg: string) => push('error', msg),
    info: (msg: string) => push('info', msg),
    remove,
  };
};
