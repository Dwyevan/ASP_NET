import React from 'react';
import { useCart } from './CartProvider';

const Toast = () => {
    const { toasts, removeToast } = useCart();

    if (toasts.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'success': return 'fa-solid fa-circle-check';
            case 'error': return 'fa-solid fa-circle-xmark';
            case 'info': return 'fa-solid fa-circle-info';
            default: return 'fa-solid fa-circle-info';
        }
    };

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast-item toast-${toast.type}`}>
                    <i className={`toast-icon ${getIcon(toast.type)}`}></i>
                    <div className="toast-content">
                        <div className="toast-title">{toast.title}</div>
                        <div className="toast-message">{toast.message}</div>
                    </div>
                    <button className="toast-close" onClick={() => removeToast(toast.id)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <div className="toast-progress"></div>
                </div>
            ))}
        </div>
    );
};

export default Toast;
