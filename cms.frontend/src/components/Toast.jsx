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
                <div key={toast.id} className={`toast-item toast-${toast.type}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px' }}>
                    {toast.imageUrl ? (
                        <img src={toast.imageUrl} alt="" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }} />
                    ) : (
                        <i className={`toast-icon ${getIcon(toast.type)}`} style={{ margin: 0 }}></i>
                    )}
                    <div className="toast-content" style={{ flex: 1, margin: 0 }}>
                        <div className="toast-title" style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>{toast.title}</div>
                        <div className="toast-message" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{toast.message}</div>
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
