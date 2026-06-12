import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../components/AuthProvider';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        fullName: user?.FullName || user?.fullName || '',
        email: user?.Email || user?.email || '',
        phone: user?.Phone || user?.phone || '',
        address: user?.Address || user?.address || '',
        password: ''
    });
    const [editMessage, setEditMessage] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrderHistory = async () => {
            try {
                // Fetch orders from OrdersAPIController
                // The endpoint is /Orders/customer/{customerId}
                const response = await axiosClient.get(`/Orders/customer/${user.Id || user.id}`);
                setOrders(response); // axiosClient already unboxes res.data
                setLoading(false);
            } catch (err) {
                console.error("Lỗi khi lấy lịch sử đơn hàng:", err);
                setError('Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [user, navigate]);

    const getStatusText = (status) => {
        switch(status) {
            case 0: return <span className="badge bg-warning text-dark">Chờ duyệt (COD)</span>;
            case 1: return <span className="badge bg-info text-dark">Đang giao</span>;
            case 2: return <span className="badge bg-success">Hoàn tất</span>;
            case 3: return <span className="badge bg-secondary">Đã hủy</span>;
            case 10: return <span className="badge bg-warning text-dark">Chờ duyệt (Đã thanh toán MoMo)</span>;
            case 11: return <span className="badge bg-info text-dark">Đang giao (Đã thanh toán)</span>;
            case 12: return <span className="badge bg-success">Hoàn tất (Đã thanh toán)</span>;
            case 13: return <span className="badge bg-danger">Yêu cầu Hoàn tiền</span>;
            case 14: return <span className="badge bg-secondary">Đã hoàn tiền</span>;
            default: return <span className="badge bg-secondary">Không rõ</span>;
        }
    };

    const handleCancelOrder = async (orderId) => {
        const reason = window.prompt('Vui lòng nhập lý do hủy đơn hàng (Bắt buộc):');
        if (reason === null) return; // Người dùng bấm Cancel
        if (reason.trim() === '') {
            alert('Bạn phải nhập lý do để hủy đơn hàng.');
            return;
        }

        try {
            const res = await axiosClient.put(`/Orders/cancel/${orderId}`, { reason: reason });
            alert(res.message || 'Đã hủy đơn hàng');
            // Cập nhật lại local state
            setOrders(orders.map(o => o.Id === orderId || o.id === orderId ? { ...o, Status: res.status, status: res.status } : o));
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn.');
        }
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setEditMessage('');
        try {
            const dataToUpdate = {
                id: user.Id || user.id,
                fullName: editForm.fullName,
                email: editForm.email,
                phone: editForm.phone,
                address: editForm.address,
                password: editForm.password || null
            };
            const response = await axiosClient.put('/Auth/UpdateProfile', dataToUpdate);
            setEditMessage('Cập nhật thông tin thành công!');
            
            // Reload page sau 1 giây để auth context cập nhật lại
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            setEditMessage(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
        }
    };

    if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-wine"></div></div>;

    return (
        <div className="container py-5" style={{ minHeight: '60vh' }}>
            <div className="row">
                {/* Sidebar Thông tin cá nhân */}
                <div className="col-lg-4 mb-4">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body p-4 text-center">
                            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '100px', height: '100px', fontSize: '2.5rem', color: 'var(--wine-gold)' }}>
                                <i className="bi bi-person-fill"></i>
                            </div>
                            <h5 className="fw-bold text-dark mb-1">{user?.FullName || user?.fullName}</h5>
                            <p className="text-muted mb-3">{user?.Email || user?.email}</p>
                            
                            <ul className="list-group list-group-flush text-start mb-4">
                                <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                                    <span className="text-muted"><i className="bi bi-telephone-fill me-2"></i>Số điện thoại</span>
                                    <strong>{user?.Phone || user?.phone || 'Chưa cập nhật'}</strong>
                                </li>
                                <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                                    <span className="text-muted"><i className="bi bi-geo-alt-fill me-2"></i>Địa chỉ</span>
                                    <strong className="text-truncate" style={{ maxWidth: '150px' }}>{user?.Address || user?.address || 'Chưa cập nhật'}</strong>
                                </li>
                            </ul>
                            <button onClick={() => setIsEditing(true)} className="btn btn-wine w-100 rounded-pill fw-semibold mb-2">
                                <i className="bi bi-pencil-square me-2"></i>Chỉnh sửa tài khoản
                            </button>
                            <button onClick={logout} className="btn btn-outline-danger w-100 rounded-pill fw-semibold">
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal Chỉnh sửa tài khoản */}
                {isEditing && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title fw-bold">Chỉnh sửa Tài khoản</h5>
                                    <button type="button" className="btn-close" onClick={() => setIsEditing(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {editMessage && <div className={`alert ${editMessage.includes('thành công') ? 'alert-success' : 'alert-danger'}`}>{editMessage}</div>}
                                    <form onSubmit={handleUpdateProfile}>
                                        <div className="mb-3">
                                            <label className="form-label">Họ và tên</label>
                                            <input type="text" className="form-control" name="fullName" value={editForm.fullName} onChange={handleEditChange} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-control" name="email" value={editForm.email} onChange={handleEditChange} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Số điện thoại</label>
                                            <input type="text" className="form-control" name="phone" value={editForm.phone} onChange={handleEditChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Địa chỉ</label>
                                            <textarea className="form-control" name="address" value={editForm.address} onChange={handleEditChange} rows="2"></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Mật khẩu mới (Để trống nếu không đổi)</label>
                                            <input type="password" className="form-control" name="password" value={editForm.password} onChange={handleEditChange} />
                                        </div>
                                        <div className="d-grid mt-4">
                                            <button type="submit" className="btn btn-wine">Lưu thay đổi</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Danh sách đơn hàng */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-header bg-white p-4 border-bottom-0">
                            <h4 className="fw-bold mb-0 text-wine"><i className="bi bi-bag-check-fill me-2"></i>Đơn hàng của tôi</h4>
                        </div>
                        <div className="card-body p-0">
                            {error && <div className="alert alert-danger m-4">{error}</div>}
                            
                            {orders.length === 0 && !error ? (
                                <div className="text-center py-5">
                                    <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
                                    <h5>Bạn chưa có đơn hàng nào.</h5>
                                    <Link to="/shop" className="btn btn-wine mt-3 rounded-pill px-4">Đến cửa hàng ngay</Link>
                                </div>
                            ) : (
                                <div className="p-3">
                                    {orders.map((order) => (
                                        <div key={order.Id || order.id} className="card mb-3 border-0 shadow-sm rounded-4" style={{ backgroundColor: '#faf9f6' }}>
                                            <div className="card-body p-4">
                                                <div className="d-flex justify-content-between align-items-center flex-wrap mb-3" style={{ borderBottom: '1px solid #e9ecef', paddingBottom: '15px' }}>
                                                    <div>
                                                        <h6 className="fw-bold mb-1" style={{ color: 'var(--wine-burgundy)', fontSize: '1.1rem' }}>Mã đơn hàng: #{order.Id || order.id}</h6>
                                                        <span className="text-muted" style={{ fontSize: '0.85rem' }}><i className="fa-regular fa-clock me-1"></i>{new Date(order.OrderDate || order.orderDate).toLocaleString('vi-VN')}</span>
                                                    </div>
                                                    <div className="text-end mt-2 mt-sm-0">
                                                        <div className="fw-bold mb-1" style={{ fontSize: '1.2rem' }}>{(order.TotalAmount || order.totalAmount).toLocaleString()} đ</div>
                                                        <div>{getStatusText(order.Status ?? order.status)}</div>
                                                    </div>
                                                </div>
                                                
                                                <h6 className="fw-bold mb-3" style={{ fontSize: '0.95rem' }}>Chi tiết sản phẩm:</h6>
                                                <div className="order-items-list">
                                                    {order.Details && order.Details.map((detail, idx) => (
                                                        <div className="d-flex align-items-center mb-3 bg-white p-2 rounded-3 border" key={idx}>
                                                            <div style={{ width: '70px', height: '70px', backgroundColor: '#fff', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                <img src={detail.ImageUrl || detail.imageUrl || '/images/wine-placeholder.png'} alt={detail.Name || detail.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                            </div>
                                                            <div className="ms-3 flex-grow-1">
                                                                <h6 className="mb-1 fw-semibold" style={{ fontSize: '0.95rem' }}>{detail.Name || detail.name}</h6>
                                                                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Số lượng: {detail.Quantity || detail.quantity}</span>
                                                            </div>
                                                            <div className="fw-bold text-end" style={{ fontSize: '0.95rem' }}>
                                                                {((detail.Quantity || detail.quantity) * (detail.UnitPrice || detail.unitPrice)).toLocaleString()} đ
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                {/* Nút Hủy Đơn */}
                                                {((order.Status === 0 || order.status === 0) || (order.Status === 10 || order.status === 10)) && (
                                                    <div className="text-end mt-3 border-top pt-3">
                                                        <button 
                                                            onClick={() => handleCancelOrder(order.Id || order.id)}
                                                            className="btn btn-outline-danger btn-sm rounded-pill px-4">
                                                            Hủy đơn hàng
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
