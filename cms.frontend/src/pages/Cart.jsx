import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../components/CartProvider';
import { formatCurrency } from '../utils/formatters';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="container py-5 text-center bg-light-wine" style={{ minHeight: '60vh' }}>
                <div className="py-5">
                    <i className="fa-solid fa-cart-arrow-down fa-5x text-muted mb-4 opacity-50"></i>
                    <h3 className="text-dark mb-4 font-serif">Giỏ hàng của quý khách đang trống.</h3>
                    <Link to="/shop" className="btn btn-gold btn-lg px-5 rounded-pill shadow-sm">Bắt đầu mua sắm</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 bg-light-wine">
            <h2 className="text-dark font-weight-bold font-serif text-uppercase mb-4 border-bottom pb-3">
                <i className="fa-solid fa-bag-shopping mr-2 text-gold"></i> Giỏ Hàng
            </h2>

            <div className="row">
                <div className="col-lg-8 mb-4">
                    <div className="card bg-white border-0 shadow-sm rounded">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 text-center align-middle">
                                    <thead className="text-uppercase text-muted bg-light border-bottom">
                                        <tr>
                                            <th className="text-left pl-4 py-3 border-0">Sản phẩm</th>
                                            <th className="py-3 border-0">Đơn giá</th>
                                            <th className="py-3 border-0">Số lượng</th>
                                            <th className="py-3 border-0">Thành tiền</th>
                                            <th className="py-3 border-0">Xóa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map(item => (
                                            <tr key={item.id} className="border-bottom bg-white">
                                                <td className="text-left pl-4 py-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="bg-light p-1 rounded mr-3 border" style={{width: '60px', height: '80px'}}>
                                                            <img src={item.imageUrl || 'https://placehold.co/50x70'} alt={item.name} className="img-fluid h-100 w-100" style={{objectFit: 'contain'}} />
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-0 text-dark font-weight-bold">{item.name}</h6>
                                                            <small className="text-muted">ID: #{item.id}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-dark font-weight-bold">{formatCurrency(item.price)}</td>
                                                <td>
                                                    <div className="d-flex justify-content-center align-items-center">
                                                        <button className="btn btn-sm btn-outline-secondary rounded-circle" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                                        <input 
                                                            type="number" 
                                                            className="form-control mx-2 text-center bg-light text-dark border-0 font-weight-bold" 
                                                            style={{width: '60px'}} 
                                                            value={item.quantity}
                                                            readOnly
                                                        />
                                                        <button className="btn btn-sm btn-outline-secondary rounded-circle" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                                    </div>
                                                </td>
                                                <td className="text-burgundy font-weight-bold">{formatCurrency(item.price * item.quantity)}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => removeFromCart(item.id)} title="Xóa">
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card bg-white border-0 shadow-sm rounded sticky-top" style={{top: '100px'}}>
                        <div className="card-body p-4">
                            <h5 className="text-uppercase text-dark font-weight-bold font-serif border-bottom pb-3 mb-4">Tóm tắt đơn hàng</h5>
                            
                            <div className="d-flex justify-content-between mb-3 text-dark">
                                <span className="text-muted">Tạm tính:</span>
                                <span className="font-weight-bold">{formatCurrency(getCartTotal())}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 text-dark">
                                <span className="text-muted">Phí giao hàng:</span>
                                <span className="text-success font-weight-bold">Miễn phí</span>
                            </div>
                            
                            <hr className="bg-secondary opacity-25" />
                            
                            <div className="d-flex justify-content-between mb-4">
                                <span className="font-weight-bold text-dark fs-5">TỔNG CỘNG:</span>
                                <span className="font-weight-bold text-burgundy fs-4">{formatCurrency(getCartTotal())}</span>
                            </div>

                            <Link to="/checkout" className="btn btn-gold btn-lg w-100 font-weight-bold text-uppercase shadow-sm rounded-pill">
                                Thanh Toán <i className="fa-solid fa-arrow-right ml-2"></i>
                            </Link>
                            
                            <div className="text-center mt-3">
                                <Link to="/shop" className="text-muted small text-decoration-none font-weight-bold">
                                    <i className="fa-solid fa-arrow-left mr-1"></i> Tiếp tục mua sắm
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
