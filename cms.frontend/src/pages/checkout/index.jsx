import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../components/CartProvider';
import { useAuth } from '../../components/AuthProvider';
import { formatCurrency } from '../../utils/formatters';
import orderService from '../../services/orderService';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart, addToast } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
        paymentMethod: 'cod'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [completedOrder, setCompletedOrder] = useState(null);

    if (cartItems.length === 0 && !orderSuccess) {
        navigate('/shop');
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const orderPayload = {
                customerId: user ? (user.Id || user.id) : 0,
                notes: formData.notes || '',
                cart: cartItems.map(i => ({ productId: i.id, quantity: i.quantity, unitPrice: i.price }))
            };
            const response = await orderService.createOrder(orderPayload);
            
            // Xử lý thanh toán MoMo nếu khách chọn
            if (formData.paymentMethod.startsWith('momo')) {
                try {
                    let reqType = 'captureWallet';
                    if (formData.paymentMethod === 'momo_atm') reqType = 'payWithATM';
                    if (formData.paymentMethod === 'momo_cc') reqType = 'payWithCC';
                    
                    const momoResponse = await orderService.createMoMoPayment({
                        orderId: response.orderId || response.OrderId,
                        amount: getCartTotal(),
                        requestType: reqType
                    });
                    if (momoResponse.payUrl) {
                        clearCart();
                        window.location.href = momoResponse.payUrl;
                        return; // Dừng lại ở đây vì trình duyệt sẽ chuyển trang
                    }
                } catch (momoError) {
                    console.error("Lỗi tạo thanh toán MoMo:", momoError.response?.data || momoError.message || momoError);
                    addToast('Lỗi thanh toán MoMo', 'Không thể khởi tạo giao dịch. Vui lòng thử lại sau.', 'error');
                    setIsSubmitting(false);
                    return;
                }
            }

            setCompletedOrder({
                orderId: response.orderId || response.OrderId || "N/A",
                items: [...cartItems],
                total: getCartTotal(),
                formData: { ...formData }
            });
            clearCart();
            setOrderSuccess(true);
            addToast('Đặt hàng thành công!', 'Chúng tôi sẽ liên hệ xác nhận đơn hàng sớm nhất.', 'success');
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            addToast('Có lỗi xảy ra', 'Vui lòng thử lại hoặc liên hệ hotline 1900 8888.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Success Page (Invoice UI)
    if (orderSuccess && completedOrder) {
        return (
            <div style={{ background: '#f8f9fa', minHeight: '80vh', padding: '60px 15px' }}>
                <div className="container">
                    <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #e0e0e0' }}>
                        
                        {/* Header Biên lai */}
                        <div style={{ background: '#27AE60', color: '#fff', padding: '30px', textAlign: 'center', position: 'relative' }}>
                            <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '24px' }}>
                                <i className="fa-solid fa-check"></i>
                            </div>
                            <h2 className="font-serif mb-1" style={{ fontSize: '1.8rem', color: '#fff' }}>Đặt Hàng Thành Công</h2>
                            <p style={{ margin: 0, opacity: 0.9 }}>Cảm ơn bạn đã mua sắm tại DuyCMS!</p>
                            
                            {/* Zigzag bottom border effect */}
                            <div style={{ position: 'absolute', bottom: '-10px', left: 0, right: 0, height: '10px', background: 'radial-gradient(circle, #fff 5px, transparent 6px) repeat-x', backgroundSize: '20px 20px', backgroundPosition: 'bottom' }}></div>
                        </div>

                        {/* Nội dung Biên lai */}
                        <div style={{ padding: '40px 30px 30px' }}>
                            <div className="text-center mb-4 pb-4" style={{ borderBottom: '1px dashed #ddd' }}>
                                <div style={{ fontSize: '0.9rem', color: '#777', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Mã đơn hàng</div>
                                <h3 className="fw-bold m-0" style={{ color: '#333' }}>#{completedOrder.orderId}</h3>
                            </div>

                            <div className="mb-4">
                                <h5 className="fw-bold mb-3" style={{ fontSize: '1.1rem', color: '#444' }}>Thông tin giao hàng</h5>
                                <div className="d-flex mb-2">
                                    <i className="fa-regular fa-user text-muted mt-1 me-3" style={{ width: '16px' }}></i>
                                    <div><span className="fw-bold">{completedOrder.formData.fullName}</span> - {completedOrder.formData.phone}</div>
                                </div>
                                <div className="d-flex mb-2">
                                    <i className="fa-solid fa-location-dot text-muted mt-1 me-3" style={{ width: '16px' }}></i>
                                    <div>{completedOrder.formData.address}</div>
                                </div>
                                <div className="d-flex mb-2">
                                    <i className="fa-solid fa-money-bill-wave text-muted mt-1 me-3" style={{ width: '16px' }}></i>
                                    <div><span className="badge bg-success" style={{ padding: '6px 10px' }}>Thanh toán khi nhận hàng (COD)</span></div>
                                </div>
                            </div>

                            <div className="mb-4 pb-4" style={{ borderBottom: '1px dashed #ddd' }}>
                                <h5 className="fw-bold mb-3" style={{ fontSize: '1.1rem', color: '#444' }}>Chi tiết đơn hàng</h5>
                                {completedOrder.items.map((item, index) => (
                                    <div key={index} className="d-flex justify-content-between mb-3 align-items-center">
                                        <div className="d-flex align-items-center">
                                            <span className="fw-bold text-muted me-3">{item.quantity} x</span>
                                            <div style={{ maxWidth: '250px' }}>
                                                <div className="text-truncate" style={{ fontWeight: 500, color: '#333' }}>{item.product.name}</div>
                                            </div>
                                        </div>
                                        <div className="fw-bold">{formatCurrency(item.product.price * item.quantity)}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '1.1rem' }}>Tổng thanh toán</span>
                                <span className="fw-bold" style={{ fontSize: '1.5rem', color: 'var(--wine-burgundy)' }}>{formatCurrency(completedOrder.total)}</span>
                            </div>

                            <div className="text-center">
                                <Link to="/shop" className="btn btn-gold w-100 py-3" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                    <i className="fa-solid fa-store me-2"></i> Tiếp Tục Mua Sắm
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-banner">
                <div className="container">
                    <h1 className="font-serif">Thanh Toán</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                            <li className="breadcrumb-item"><Link to="/cart">Giỏ hàng</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Thanh toán</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container" style={{ padding: '50px 15px' }}>
                {/* Step Indicator */}
                <div className="step-indicator">
                    <div className="step-item completed">
                        <div className="step-number"><i className="fa-solid fa-check" style={{ fontSize: '0.75rem' }}></i></div>
                        <span>Giỏ hàng</span>
                    </div>
                    <div className="step-connector completed"></div>
                    <div className="step-item active">
                        <div className="step-number">2</div>
                        <span>Thanh toán</span>
                    </div>
                    <div className="step-connector"></div>
                    <div className="step-item">
                        <div className="step-number">3</div>
                        <span>Hoàn tất</span>
                    </div>
                </div>

                <div className="row">
                    {/* Form */}
                    <div className="col-lg-7 mb-4">
                        {/* Shipping Info */}
                        <div className="checkout-card mb-4">
                            <div className="checkout-card-header">
                                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--wine-burgundy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>1</span>
                                THÔNG TIN GIAO HÀNG
                            </div>
                            <div className="checkout-card-body">
                                <form id="checkoutForm" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Họ và tên *</label>
                                            <input type="text" className="form-wine w-100" name="fullName" required value={formData.fullName} onChange={handleInputChange} placeholder="Nguyễn Văn A" />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Số điện thoại *</label>
                                            <input type="tel" className="form-wine w-100" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="0901 234 567" />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Email</label>
                                        <input type="email" className="form-wine w-100" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" />
                                    </div>
                                    <div className="mb-3">
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Địa chỉ giao hàng *</label>
                                        <textarea className="form-wine w-100" rows="2" name="address" required value={formData.address} onChange={handleInputChange} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"></textarea>
                                    </div>
                                    <div className="mb-0">
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Ghi chú đơn hàng</label>
                                        <textarea className="form-wine w-100" rows="2" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="VD: Giao giờ hành chính, gói quà..."></textarea>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="checkout-card">
                            <div className="checkout-card-header">
                                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--wine-burgundy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>2</span>
                                PHƯƠNG THỨC THANH TOÁN
                            </div>
                            <div className="checkout-card-body">
                                <div
                                    className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                                >
                                    <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                                        <input type="radio" name="paymentMethod" checked={formData.paymentMethod === 'cod'} onChange={() => { }} style={{ accentColor: 'var(--wine-gold)' }} />
                                        <div>
                                            <div style={{ fontWeight: 600 }}>
                                                <i className="fa-solid fa-money-bill-wave mr-2" style={{ color: '#27AE60' }}></i>
                                                Thanh toán khi nhận hàng (COD)
                                            </div>
                                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '3px' }}>Giao hàng và thu tiền tận nơi</div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`payment-option ${formData.paymentMethod === 'momo_wallet' ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'momo_wallet' }))}
                                >
                                    <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                                        <input type="radio" name="paymentMethod" checked={formData.paymentMethod === 'momo_wallet'} onChange={() => { }} style={{ accentColor: '#A50064' }} />
                                        <div>
                                            <div style={{ fontWeight: 600 }}>
                                                <i className="fa-solid fa-wallet mr-2" style={{ color: '#A50064' }}></i>
                                                Thanh toán qua Ví MoMo
                                            </div>
                                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '3px' }}>Quét mã QR bằng ứng dụng MoMo</div>
                                        </div>
                                    </div>
                                    {formData.paymentMethod === 'momo_wallet' && (
                                        <div className="text-center mt-3 p-3" style={{ background: 'var(--surface-light)', borderRadius: 'var(--radius-md)' }}>
                                            <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" style={{ height: '40px' }} className="mb-2" />
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 0 }}>Hệ thống sẽ chuyển bạn sang trang quét mã QR của MoMo.</p>
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={`payment-option ${formData.paymentMethod === 'momo_atm' ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'momo_atm' }))}
                                >
                                    <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                                        <input type="radio" name="paymentMethod" checked={formData.paymentMethod === 'momo_atm'} onChange={() => { }} style={{ accentColor: '#A50064' }} />
                                        <div>
                                            <div style={{ fontWeight: 600 }}>
                                                <i className="fa-solid fa-credit-card mr-2" style={{ color: '#A50064' }}></i>
                                                Thanh toán bằng Thẻ ATM Nội Địa
                                            </div>
                                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '3px' }}>Chuyển hướng đến trang nhập Thẻ ATM qua cổng MoMo</div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`payment-option ${formData.paymentMethod === 'momo_cc' ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'momo_cc' }))}
                                >
                                    <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                                        <input type="radio" name="paymentMethod" checked={formData.paymentMethod === 'momo_cc'} onChange={() => { }} style={{ accentColor: '#1c4a97' }} />
                                        <div>
                                            <div style={{ fontWeight: 600 }}>
                                                <i className="fa-brands fa-cc-visa mr-2" style={{ color: '#1c4a97' }}></i>
                                                Thanh toán bằng Thẻ Visa / Mastercard
                                            </div>
                                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '3px' }}>Thanh toán qua thẻ quốc tế bảo mật với MoMo</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Review */}
                    <div className="col-lg-5">
                        <div className="order-summary sticky-top" style={{ top: '100px', background: '#fff' }}>
                            <div className="order-summary-header">
                                <h5 className="mb-0 font-serif" style={{ fontSize: '1.1rem' }}>
                                    <i className="fa-solid fa-clipboard-list mr-2" style={{ color: 'var(--wine-gold)' }}></i>
                                    Đơn Hàng Của Bạn
                                </h5>
                            </div>
                            <div className="order-summary-body">
                                {/* Items */}
                                <div style={{ marginBottom: '20px' }}>
                                    {cartItems.map(item => (
                                        <div key={item.id} className="d-flex align-items-center mb-3" style={{ gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
                                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                                <div style={{ width: '55px', height: '65px', background: 'var(--surface-light)', borderRadius: '6px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)' }}>
                                                    <img src={item.imageUrl || 'https://placehold.co/50x60'} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                </div>
                                                <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--wine-burgundy)', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.quantity} × {formatCurrency(item.price)}</div>
                                            </div>
                                            <div style={{ fontWeight: 700, color: 'var(--wine-burgundy)', fontSize: '0.9rem', fontFamily: "'Playfair Display', serif", flexShrink: 0 }}>
                                                {formatCurrency(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="summary-row">
                                    <span style={{ color: 'var(--text-secondary)' }}>Tạm tính:</span>
                                    <span style={{ fontWeight: 600 }}>{formatCurrency(getCartTotal())}</span>
                                </div>
                                <div className="summary-row">
                                    <span style={{ color: 'var(--text-secondary)' }}>Phí giao hàng:</span>
                                    <span style={{ fontWeight: 600, color: '#27AE60' }}>Miễn phí</span>
                                </div>
                                <div className="summary-row summary-total">
                                    <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>TỔNG CỘNG:</span>
                                    <span style={{ fontWeight: 700, fontSize: '1.4rem', color: 'var(--wine-burgundy)', fontFamily: "'Playfair Display', serif" }}>
                                        {formatCurrency(getCartTotal())}
                                    </span>
                                </div>

                                <button
                                    form="checkoutForm"
                                    type="submit"
                                    className="btn btn-gold btn-lg w-100 mt-4"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <><span className="spinner-border spinner-border-sm mr-2"></span> Đang xử lý...</>
                                    ) : formData.paymentMethod === 'momo_cc' ? (
                                        <><i className="fa-brands fa-cc-visa mr-2"></i> Thanh Toán Bằng Visa / Mastercard</>
                                    ) : formData.paymentMethod === 'momo_atm' ? (
                                        <><i className="fa-solid fa-credit-card mr-2"></i> Thanh Toán Bằng Thẻ ATM</>
                                    ) : formData.paymentMethod === 'momo_wallet' ? (
                                        <><i className="fa-solid fa-wallet mr-2"></i> Thanh Toán Qua Ví MoMo</>
                                    ) : (
                                        <><i className="fa-solid fa-shield-check mr-2"></i> Hoàn Tất Đặt Hàng</>
                                    )}
                                </button>



                                <p className="text-center mt-3" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    <i className="fa-solid fa-lock mr-1"></i> Thông tin của bạn được bảo mật tuyệt đối
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
