import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../components/CartProvider';
import { formatCurrency } from '../utils/formatters';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <div>
                <div className="page-banner">
                    <div className="container">
                        <h1 className="font-serif">Giỏ Hàng</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Giỏ hàng</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="container" style={{ padding: '80px 15px' }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <i className="fa-solid fa-cart-shopping"></i>
                        </div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: '10px' }}>Giỏ hàng của bạn đang trống</h3>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 25px' }}>
                            Hãy khám phá bộ sưu tập rượu vang cao cấp của chúng tôi và thêm sản phẩm yêu thích vào giỏ hàng.
                        </p>
                        <Link to="/shop" className="btn btn-gold px-5">
                            <i className="fa-solid fa-store mr-2"></i> Bắt Đầu Mua Sắm
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-banner">
                <div className="container">
                    <h1 className="font-serif">Giỏ Hàng</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                            <li className="breadcrumb-item"><Link to="/shop">Cửa hàng</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Giỏ hàng</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container" style={{ padding: '50px 15px' }}>
                <div className="row">
                    {/* Cart Table */}
                    <div className="col-lg-8 mb-4">
                        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
                            <div className="table-responsive">
                                <table className="cart-table w-100" style={{ marginBottom: 0 }}>
                                    <thead>
                                        <tr>
                                            <th className="text-left" style={{ paddingLeft: '24px' }}>Sản phẩm</th>
                                            <th className="text-center">Đơn giá</th>
                                            <th className="text-center">Số lượng</th>
                                            <th className="text-center">Thành tiền</th>
                                            <th className="text-center" style={{ width: '60px' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map(item => (
                                            <tr key={item.id}>
                                                <td style={{ paddingLeft: '24px' }}>
                                                    <div className="d-flex align-items-center" style={{ gap: '15px' }}>
                                                        <div className="cart-product-thumb">
                                                            <img src={item.imageUrl || 'https://placehold.co/60x70'} alt={item.name} />
                                                        </div>
                                                        <div>
                                                            <Link to={`/product/${item.id}`} className="text-decoration-none" style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                                                {item.name}
                                                            </Link>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                                                                {item.categoryProduct?.name || 'Rượu Vang'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                    {formatCurrency(item.price)}
                                                </td>
                                                <td className="text-center">
                                                    <div className="quantity-selector mx-auto">
                                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                            <i className="fa-solid fa-minus" style={{ fontSize: '0.7rem' }}></i>
                                                        </button>
                                                        <input type="number" value={item.quantity} readOnly />
                                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                            <i className="fa-solid fa-plus" style={{ fontSize: '0.7rem' }}></i>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="text-center" style={{ fontWeight: 700, color: 'var(--wine-burgundy)', fontFamily: "'Playfair Display', serif", fontSize: '1.05rem' }}>
                                                    {formatCurrency(item.price * item.quantity)}
                                                </td>
                                                <td className="text-center">
                                                    <button className="cart-remove-btn mx-auto" onClick={() => removeFromCart(item.id)} title="Xóa">
                                                        <i className="fa-solid fa-trash-can" style={{ fontSize: '0.8rem' }}></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Continue Shopping */}
                        <div className="mt-3">
                            <Link to="/shop" className="text-decoration-none d-inline-flex align-items-center" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', gap: '6px' }}>
                                <i className="fa-solid fa-arrow-left"></i> Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="col-lg-4">
                        <div className="order-summary sticky-top" style={{ top: '100px', background: '#fff' }}>
                            <div className="order-summary-header">
                                <h5 className="mb-0 font-serif" style={{ fontSize: '1.1rem' }}>
                                    <i className="fa-solid fa-receipt mr-2" style={{ color: 'var(--wine-gold)' }}></i>
                                    Tóm Tắt Đơn Hàng
                                </h5>
                            </div>
                            <div className="order-summary-body">
                                {/* Coupon */}
                                <div className="coupon-input mb-4">
                                    <input type="text" placeholder="Mã giảm giá..." />
                                    <button>Áp dụng</button>
                                </div>

                                <div className="summary-row">
                                    <span style={{ color: 'var(--text-secondary)' }}>Tạm tính ({cartItems.length} sản phẩm):</span>
                                    <span style={{ fontWeight: 600 }}>{formatCurrency(getCartTotal())}</span>
                                </div>
                                <div className="summary-row">
                                    <span style={{ color: 'var(--text-secondary)' }}>Phí giao hàng:</span>
                                    <span style={{ fontWeight: 600, color: '#27AE60' }}>Miễn phí</span>
                                </div>

                                <div className="summary-row summary-total">
                                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>TỔNG CỘNG:</span>
                                    <span style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--wine-burgundy)', fontFamily: "'Playfair Display', serif" }}>
                                        {formatCurrency(getCartTotal())}
                                    </span>
                                </div>

                                <Link to="/checkout" className="btn btn-gold btn-lg w-100 mt-4">
                                    Tiến Hành Thanh Toán <i className="fa-solid fa-arrow-right ml-2"></i>
                                </Link>

                                {/* Guarantees */}
                                <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
                                    <div className="d-flex align-items-center mb-2" style={{ gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                        <i className="fa-solid fa-lock" style={{ color: 'var(--wine-gold)' }}></i>
                                        Thanh toán an toàn & bảo mật
                                    </div>
                                    <div className="d-flex align-items-center mb-2" style={{ gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                        <i className="fa-solid fa-truck" style={{ color: 'var(--wine-gold)' }}></i>
                                        Giao hàng miễn phí từ 500.000₫
                                    </div>
                                    <div className="d-flex align-items-center" style={{ gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                        <i className="fa-solid fa-rotate-left" style={{ color: 'var(--wine-gold)' }}></i>
                                        Đổi trả trong 7 ngày
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
