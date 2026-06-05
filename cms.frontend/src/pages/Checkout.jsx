import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartProvider';
import { formatCurrency } from '../utils/formatters';
import orderService from '../services/orderService';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
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
                customerId: 0,
                notes: formData.notes || '',
                cart: cartItems.map(i => ({ productId: i.id, quantity: i.quantity, unitPrice: i.price }))
            };
            await orderService.createOrder(orderPayload);
            clearCart();
            setOrderSuccess(true);
            alert("Đặt hàng thành công!");
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            alert("Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="container py-5 text-center bg-light-wine" style={{ minHeight: '60vh' }}>
                <div className="card bg-white border-0 p-5 mx-auto shadow-sm rounded" style={{ maxWidth: '600px' }}>
                    <i className="fa-solid fa-circle-check fa-5x text-success mb-4"></i>
                    <h2 className="text-dark font-weight-bold mb-3 font-serif">ĐẶT HÀNG THÀNH CÔNG</h2>
                    <p className="text-muted mb-4 text-left" style={{lineHeight: '1.8'}}>
                        Cảm ơn quý khách <strong className="text-dark">{formData.fullName}</strong> đã tin tưởng Royal Wine Estate. 
                        Đơn hàng của quý khách đang được xử lý và sẽ được bộ phận chăm sóc khách hàng liên hệ xác nhận trong thời gian sớm nhất.
                    </p>
                    <button className="btn btn-outline-gold rounded-pill px-4" onClick={() => navigate('/')}>Trở về Trang chủ</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 bg-light-wine">
            <h2 className="text-dark font-weight-bold font-serif text-uppercase mb-4 border-bottom pb-3">
                <i className="fa-solid fa-credit-card mr-2 text-gold"></i> Thanh Toán (Checkout)
            </h2>

            <div className="row">
                <div className="col-lg-7 mb-4">
                    <div className="card bg-white border-0 shadow-sm mb-4 rounded">
                        <div className="card-header bg-white text-dark font-weight-bold border-bottom py-3">
                            <span className="badge bg-gold text-white mr-2">1</span> THÔNG TIN GIAO HÀNG
                        </div>
                        <div className="card-body p-4">
                            <form id="checkoutForm" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="text-muted small font-weight-bold">Họ và tên *</label>
                                        <input type="text" className="form-control bg-light border-0 py-2" name="fullName" required onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="text-muted small font-weight-bold">Số điện thoại *</label>
                                        <input type="text" className="form-control bg-light border-0 py-2" name="phone" required onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="text-muted small font-weight-bold">Email</label>
                                    <input type="email" className="form-control bg-light border-0 py-2" name="email" onChange={handleInputChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="text-muted small font-weight-bold">Địa chỉ giao hàng chi tiết *</label>
                                    <textarea className="form-control bg-light border-0" rows="2" name="address" required onChange={handleInputChange}></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="text-muted small font-weight-bold">Ghi chú đơn hàng (Nếu có)</label>
                                    <textarea className="form-control bg-light border-0" rows="2" name="notes" placeholder="VD: Giao hàng giờ hành chính, cần gói quà..." onChange={handleInputChange}></textarea>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card bg-white border-0 shadow-sm rounded">
                        <div className="card-header bg-white text-dark font-weight-bold border-bottom py-3">
                            <span className="badge bg-gold text-white mr-2">2</span> PHƯƠNG THỨC THANH TOÁN
                        </div>
                        <div className="card-body p-4">
                            <div className="form-check mb-3 p-3 bg-light rounded border border-light cursor-pointer">
                                <input className="form-check-input ml-1 mt-2" type="radio" name="paymentMethod" id="cod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} />
                                <label className="form-check-label ml-4 text-dark font-weight-bold d-block" htmlFor="cod" style={{cursor: 'pointer'}}>
                                    <i className="fa-solid fa-money-bill-wave text-success mr-2"></i> Thanh toán khi nhận hàng (COD)
                                    <small className="d-block text-muted font-weight-normal mt-1">Giao hàng và thu tiền tận nơi.</small>
                                </label>
                            </div>
                            <div className="form-check mb-3 p-3 bg-light rounded border border-light cursor-pointer">
                                <input className="form-check-input ml-1 mt-2" type="radio" name="paymentMethod" id="banking" value="banking" checked={formData.paymentMethod === 'banking'} onChange={handleInputChange} />
                                <label className="form-check-label ml-4 text-dark font-weight-bold d-block" htmlFor="banking" style={{cursor: 'pointer'}}>
                                    <i className="fa-solid fa-building-columns text-info mr-2"></i> Chuyển khoản ngân hàng (QR Code)
                                    <small className="d-block text-muted font-weight-normal mt-1">Quét mã QR để thanh toán nhanh chóng và bảo mật.</small>
                                </label>
                                {formData.paymentMethod === 'banking' && (
                                    <div className="mt-3 p-4 bg-white rounded border border-info text-center shadow-sm">
                                        <img src="https://placehold.co/150x150?text=QR+Code" alt="QR" className="mb-3" />
                                        <p className="text-dark font-weight-bold mb-1">Chủ TK: ROYAL WINE ESTATE</p>
                                        <p className="text-muted small mb-0">Vui lòng quét mã trên ứng dụng ngân hàng.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card bg-white border-0 shadow-sm rounded sticky-top" style={{top: '100px'}}>
                        <div className="card-header bg-white text-dark font-weight-bold border-bottom py-3">
                            <span className="badge bg-gold text-white mr-2">3</span> ĐƠN HÀNG CỦA BẠN
                        </div>
                        <div className="card-body p-4">
                            <ul className="list-group list-group-flush mb-4">
                                {cartItems.map(item => (
                                    <li key={item.id} className="list-group-item bg-transparent text-dark px-0 d-flex justify-content-between align-items-center border-bottom pb-2 pt-2">
                                        <div className="d-flex align-items-center">
                                            <span className="badge bg-light border text-dark mr-2">{item.quantity}</span>
                                            <span className="small text-truncate font-weight-bold" style={{maxWidth: '150px'}}>{item.name}</span>
                                        </div>
                                        <span className="text-burgundy small font-weight-bold">{formatCurrency(item.price * item.quantity)}</span>
                                    </li>
                                ))}
                            </ul>
                            
                            <div className="d-flex justify-content-between mb-4">
                                <span className="font-weight-bold text-dark fs-5">TỔNG CỘNG:</span>
                                <span className="font-weight-bold text-burgundy fs-4">{formatCurrency(getCartTotal())}</span>
                            </div>

                            <button 
                                form="checkoutForm" 
                                type="submit" 
                                className="btn btn-gold btn-lg w-100 font-weight-bold text-uppercase shadow-sm rounded-pill"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <span className="spinner-border spinner-border-sm mr-2"></span> : <i className="fa-solid fa-shield-check mr-2"></i>}
                                Hoàn Tất Đặt Hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
