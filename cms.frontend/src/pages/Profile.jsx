import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../components/AuthProvider';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // UI State
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'orders'
    const [isEditing, setIsEditing] = useState(false);
    
    // Data State
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrders, setExpandedOrders] = useState({});
    
    const [editForm, setEditForm] = useState({
        fullName: user?.FullName || user?.fullName || '',
        email: user?.Email || user?.email || '',
        phone: user?.Phone || user?.phone || '',
        address: user?.Address || user?.address || '',
        password: ''
    });
    const [editMessage, setEditMessage] = useState('');

    // Cancel Modal State
    const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null });
    const [cancelReasonType, setCancelReasonType] = useState('Thay đổi ý định mua hàng');
    const [cancelOtherReason, setCancelOtherReason] = useState('');

    const toggleOrder = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrderHistory = async () => {
            try {
                const response = await axiosClient.get(`/Orders/customer/${user.Id || user.id}`);
                setOrders(response);
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
            case 0: return <span className="badge" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', color: '#d39e00', border: '1px solid #ffeeba' }}>Chờ duyệt (COD)</span>;
            case -1: return <span className="badge" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', border: '1px solid #f5c6cb' }}>Thanh toán thất bại</span>;
            case 1: return <span className="badge" style={{ backgroundColor: 'rgba(13, 202, 240, 0.1)', color: '#0dcaf0', border: '1px solid #bee5eb' }}>Đang giao</span>;
            case 2: return <span className="badge" style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)', color: '#198754', border: '1px solid #c3e6cb' }}>Hoàn tất</span>;
            case 3: return <span className="badge" style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)', color: '#6c757d', border: '1px solid #d6d8db' }}>Đã hủy</span>;
            case 10: return <span className="badge" style={{ backgroundColor: 'rgba(165, 0, 100, 0.1)', color: '#a50064', border: '1px solid #f2bad8' }}>Đã thanh toán (Ví MoMo)</span>;
            case 101: return <span className="badge" style={{ backgroundColor: 'rgba(165, 0, 100, 0.1)', color: '#a50064', border: '1px solid #f2bad8' }}>Đã thanh toán (Thẻ ATM)</span>;
            case 102: return <span className="badge" style={{ backgroundColor: 'rgba(28, 74, 151, 0.1)', color: '#1c4a97', border: '1px solid #aecdf7' }}>Đã thanh toán (Thẻ Visa)</span>;
            case 11: return <span className="badge" style={{ backgroundColor: 'rgba(13, 202, 240, 0.1)', color: '#0dcaf0', border: '1px solid #bee5eb' }}>Đang giao (Đã thanh toán)</span>;
            case 12: return <span className="badge" style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)', color: '#198754', border: '1px solid #c3e6cb' }}>Hoàn tất (Đã thanh toán)</span>;
            case 13: return <span className="badge" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', border: '1px solid #f5c6cb' }}>Yêu cầu Hoàn tiền</span>;
            case 14: return <span className="badge" style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)', color: '#6c757d', border: '1px solid #d6d8db' }}>Đã hoàn tiền</span>;
            default: return <span className="badge bg-light text-dark">Không rõ</span>;
        }
    };

    const openCancelModal = (orderId) => {
        setCancelModal({ isOpen: true, orderId });
        setCancelReasonType('Thay đổi ý định mua hàng');
        setCancelOtherReason('');
    };

    const submitCancelOrder = async () => {
        const orderId = cancelModal.orderId;
        let finalReason = cancelReasonType;
        
        if (cancelReasonType === 'Khác') {
            if (cancelOtherReason.trim() === '') {
                alert('Vui lòng nhập lý do cụ thể.');
                return;
            }
            finalReason = cancelOtherReason;
        }

        try {
            const res = await axiosClient.put(`/Orders/cancel/${orderId}`, { reason: finalReason });
            alert(res.message || 'Đã hủy đơn hàng');
            setOrders(orders.map(o => o.Id === orderId || o.id === orderId ? { ...o, Status: res.status, status: res.status } : o));
            setCancelModal({ isOpen: false, orderId: null });
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
            await axiosClient.put('/Auth/UpdateProfile', dataToUpdate);
            
            // Cập nhật dữ liệu mới vào LocalStorage để lần tải lại trang tiếp theo sẽ nhận diện được
            const storedUserStr = localStorage.getItem('user');
            if (storedUserStr) {
                const storedUser = JSON.parse(storedUserStr);
                const updatedUser = {
                    ...storedUser,
                    FullName: dataToUpdate.fullName,
                    fullName: dataToUpdate.fullName,
                    Email: dataToUpdate.email,
                    email: dataToUpdate.email,
                    Phone: dataToUpdate.phone,
                    phone: dataToUpdate.phone,
                    Address: dataToUpdate.address,
                    address: dataToUpdate.address
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            setEditMessage('Cập nhật thông tin thành công!');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            setEditMessage(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fcfbf9' }}>
            <div className="spinner-border" style={{ color: 'var(--wine-gold)', width: '3rem', height: '3rem' }}></div>
        </div>
    );

    // Tính toán Thống kê
    const completedOrders = orders.filter(o => [2, 10, 11, 12, 101, 102].includes(o.Status ?? o.status));
    const totalSpent = completedOrders.reduce((sum, o) => sum + (o.TotalAmount || o.totalAmount), 0);
    
    let membershipTier = 'Silver Member';
    let tierColor = '#808080';
    let tierIcon = 'fa-medal';
    
    if (totalSpent > 100000000) {
        membershipTier = 'Diamond Member';
        tierColor = '#00bcd4';
        tierIcon = 'fa-gem';
    } else if (totalSpent > 20000000) {
        membershipTier = 'Gold Member';
        tierColor = 'var(--wine-gold)';
        tierIcon = 'fa-crown';
    }

    return (
        <div style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2070&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            position: 'relative',
            paddingTop: '60px',
            paddingBottom: '80px',
            color: '#333'
        }}>
            {/* Light overlay for elegant, soft glassmorphism */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(252, 251, 249, 0.85)', // Light ivory overlay
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                zIndex: 1
            }}></div>
            
            <div className="container position-relative" style={{ zIndex: 2 }}>
                
                {/* Dashboard Stats Row */}
                <div className="row mb-5 justify-content-center" style={{ animation: 'slideDown 0.6s ease-out' }}>
                    <div className="col-lg-10">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <div>
                                <h2 className="font-serif fw-bold mb-1" style={{ color: 'var(--wine-burgundy)' }}>Trang Quản Trị Cá Nhân</h2>
                                <p style={{ color: '#666' }}>Chào mừng trở lại, {user?.FullName || user?.fullName}</p>
                            </div>
                            <button onClick={logout} className="btn-glass-danger rounded-pill px-4">
                                <i className="fa-solid fa-right-from-bracket me-2"></i> Đăng xuất
                            </button>
                        </div>
                        
                        <div className="row g-4">
                            <div className="col-md-4">
                                <div className="glass-card stat-card p-4 text-center h-100">
                                    <div className="stat-icon mb-3" style={{ color: tierColor }}>
                                        <i className={`fa-solid ${tierIcon} fs-1`}></i>
                                    </div>
                                    <h6 className="text-uppercase tracking-wider" style={{ color: '#777', fontSize: '0.85rem', letterSpacing: '2px' }}>Hạng Thành Viên</h6>
                                    <h4 className="fw-bold font-serif mb-0" style={{ color: tierColor }}>{membershipTier}</h4>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="glass-card stat-card p-4 text-center h-100">
                                    <div className="stat-icon mb-3" style={{ color: 'var(--wine-burgundy)' }}>
                                        <i className="fa-solid fa-wine-glass fs-1"></i>
                                    </div>
                                    <h6 className="text-uppercase tracking-wider" style={{ color: '#777', fontSize: '0.85rem', letterSpacing: '2px' }}>Tổng Đơn Hàng</h6>
                                    <h4 className="fw-bold font-serif mb-0" style={{ color: 'var(--text-primary)' }}>{orders.length} <span style={{ fontSize: '1rem', fontWeight: 400, color: '#666' }}>đơn</span></h4>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="glass-card stat-card p-4 text-center h-100">
                                    <div className="stat-icon mb-3" style={{ color: 'var(--wine-gold)' }}>
                                        <i className="fa-solid fa-coins fs-1"></i>
                                    </div>
                                    <h6 className="text-uppercase tracking-wider" style={{ color: '#777', fontSize: '0.85rem', letterSpacing: '2px' }}>Tổng Chi Tiêu</h6>
                                    <h4 className="fw-bold font-serif mb-0" style={{ color: 'var(--text-primary)' }}>{totalSpent.toLocaleString()} <span style={{ fontSize: '1.2rem', fontWeight: 400, color: 'var(--wine-gold)' }}>đ</span></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {/* Glassmorphism Main Content Card */}
                        <div className="glass-card" style={{ overflow: 'hidden', animation: 'fadeInUp 0.8s ease-out' }}>
                            {/* Tabs Header */}
                            <div className="d-flex glass-tabs-header">
                                <div 
                                    className={`py-4 px-5 text-center flex-grow-1 glass-tab ${activeTab === 'profile' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('profile')}
                                >
                                    <i className="fa-solid fa-user-tie me-2"></i> Hồ sơ cá nhân
                                </div>
                                <div 
                                    className={`py-4 px-5 text-center flex-grow-1 glass-tab ${activeTab === 'orders' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('orders')}
                                >
                                    <i className="fa-solid fa-scroll me-2"></i> Lịch sử đơn hàng
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="p-4 p-md-5">
                                
                                {activeTab === 'profile' && (
                                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                                        <div className="row">
                                            <div className="col-md-5 mb-4 mb-md-0 text-center" style={{ borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                                                <div className="position-relative d-inline-block mb-4">
                                                    <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto" 
                                                         style={{ width: '150px', height: '150px', fontSize: '4.5rem', color: 'var(--wine-burgundy)', background: 'rgba(255,255,255,0.8)', border: '2px solid rgba(226, 189, 117, 0.4)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}>
                                                        <i className="fa-solid fa-chess-king"></i>
                                                    </div>
                                                </div>
                                                <h3 className="fw-bold font-serif mb-1" style={{ color: 'var(--text-primary)' }}>{user?.FullName || user?.fullName}</h3>
                                                <p style={{ color: '#666' }} className="mb-4">{user?.Email || user?.email}</p>
                                                
                                                {!isEditing && (
                                                    <button onClick={() => setIsEditing(true)} className="btn-glass-gold w-100 rounded-pill py-2">
                                                        <i className="fa-solid fa-pen-nib me-2"></i> Cập nhật thông tin
                                                    </button>
                                                )}
                                            </div>
                                            
                                            <div className="col-md-7 ps-md-5">
                                                <h4 className="font-serif fw-bold mb-4" style={{ color: 'var(--wine-burgundy)', borderBottom: '1px solid rgba(0, 0, 0, 0.05)', paddingBottom: '10px' }}>
                                                    <i className="fa-solid fa-id-card me-2"></i> Thông Tin Liên Hệ
                                                </h4>
                                                
                                                {editMessage && (
                                                    <div className={`alert ${editMessage.includes('thành công') ? 'alert-success' : 'alert-danger'} border-0 shadow-sm rounded-3`}>
                                                        {editMessage}
                                                    </div>
                                                )}
                                                
                                                {!isEditing ? (
                                                    <div className="profile-details-glass">
                                                        <div className="row mb-4 align-items-center">
                                                            <div className="col-sm-4 text-muted"><i className="fa-solid fa-signature me-2"></i> Họ và tên</div>
                                                            <div className="col-sm-8 fw-semibold fs-5">{user?.FullName || user?.fullName || 'Chưa cập nhật'}</div>
                                                        </div>
                                                        <div className="row mb-4 align-items-center">
                                                            <div className="col-sm-4 text-muted"><i className="fa-solid fa-envelope-open-text me-2"></i> Email</div>
                                                            <div className="col-sm-8 fw-semibold fs-5">{user?.Email || user?.email || 'Chưa cập nhật'}</div>
                                                        </div>
                                                        <div className="row mb-4 align-items-center">
                                                            <div className="col-sm-4 text-muted"><i className="fa-solid fa-phone-volume me-2"></i> Số điện thoại</div>
                                                            <div className="col-sm-8 fw-semibold fs-5">{user?.Phone || user?.phone || 'Chưa cập nhật'}</div>
                                                        </div>
                                                        <div className="row align-items-center">
                                                            <div className="col-sm-4 text-muted"><i className="fa-solid fa-map-location-dot me-2"></i> Địa chỉ</div>
                                                            <div className="col-sm-8 fw-semibold fs-5">{user?.Address || user?.address || 'Chưa cập nhật'}</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <form onSubmit={handleUpdateProfile} style={{ animation: 'fadeIn 0.3s ease' }}>
                                                        <div className="row g-3">
                                                            <div className="col-md-6 mb-3">
                                                                <label className="form-label" style={{ color: 'var(--wine-burgundy)', fontSize: '0.85rem', letterSpacing: '1px', fontWeight: 'bold' }}>HỌ VÀ TÊN</label>
                                                                <input type="text" className="form-control glass-input" name="fullName" value={editForm.fullName} onChange={handleEditChange} required />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <label className="form-label" style={{ color: 'var(--wine-burgundy)', fontSize: '0.85rem', letterSpacing: '1px', fontWeight: 'bold' }}>SỐ ĐIỆN THOẠI</label>
                                                                <input type="text" className="form-control glass-input" name="phone" value={editForm.phone} onChange={handleEditChange} />
                                                            </div>
                                                            <div className="col-12 mb-3">
                                                                <label className="form-label" style={{ color: 'var(--wine-burgundy)', fontSize: '0.85rem', letterSpacing: '1px', fontWeight: 'bold' }}>EMAIL</label>
                                                                <input type="email" className="form-control glass-input" name="email" value={editForm.email} onChange={handleEditChange} required />
                                                            </div>
                                                            <div className="col-12 mb-3">
                                                                <label className="form-label" style={{ color: 'var(--wine-burgundy)', fontSize: '0.85rem', letterSpacing: '1px', fontWeight: 'bold' }}>ĐỊA CHỈ GIAO HÀNG</label>
                                                                <textarea className="form-control glass-input" name="address" value={editForm.address} onChange={handleEditChange} rows="2"></textarea>
                                                            </div>
                                                            <div className="col-12 mb-4">
                                                                <label className="form-label" style={{ color: 'var(--wine-burgundy)', fontSize: '0.85rem', letterSpacing: '1px', fontWeight: 'bold' }}>ĐỔI MẬT KHẨU <span style={{ textTransform: 'none', color: '#888', fontWeight: 'normal' }}>(để trống nếu giữ nguyên)</span></label>
                                                                <input type="password" className="form-control glass-input" name="password" value={editForm.password} onChange={handleEditChange} placeholder="••••••••" />
                                                            </div>
                                                            
                                                            <div className="col-12 d-flex gap-3 mt-3">
                                                                <button type="submit" className="btn-glass-gold rounded-pill px-5 py-2 fw-semibold">
                                                                    <i className="fa-solid fa-save me-2"></i> Lưu thay đổi
                                                                </button>
                                                                <button type="button" className="btn-glass-light rounded-pill px-5 py-2 fw-semibold" onClick={() => setIsEditing(false)}>
                                                                    Hủy bỏ
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'orders' && (
                                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                                        {error && <div className="alert alert-danger shadow-sm rounded-3">{error}</div>}
                                        
                                        {orders.length === 0 && !error ? (
                                            <div className="text-center py-5">
                                                <div className="mb-4">
                                                    <img src="/images/wine-glass-empty.png" alt="Empty Orders" style={{ width: '120px', opacity: 0.3 }} onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/3014/3014457.png'; e.target.style.opacity = '0.1'; }} />
                                                </div>
                                                <h4 className="font-serif mb-3 text-dark">Bạn chưa có đơn hàng nào</h4>
                                                <p className="text-muted mb-5">Hãy thêm những tuyệt tác vang vào bộ sưu tập của bạn.</p>
                                                <Link to="/shop" className="btn-glass-gold rounded-pill px-5 py-3 fs-5">
                                                    <i className="fa-solid fa-wine-glass-empty me-2"></i> Khám phá cửa hàng
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="order-scroll-container pe-3" style={{ maxHeight: '650px', overflowY: 'auto' }}>
                                                {orders.map((order) => {
                                                    const details = order.Details || order.details || [];
                                                    const isExpanded = expandedOrders[order.Id || order.id];
                                                    
                                                    return (
                                                        <div key={order.Id || order.id} className="glass-order-card mb-4" style={{ 
                                                            background: isExpanded ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.6)',
                                                            border: isExpanded ? '1px solid rgba(226, 189, 117, 0.6)' : '1px solid rgba(0,0,0,0.05)',
                                                            borderRadius: '15px',
                                                            transition: 'all 0.3s ease',
                                                            boxShadow: isExpanded ? '0 10px 30px rgba(226, 189, 117, 0.15)' : 'none'
                                                        }}>
                                                            {/* Order Header Summary */}
                                                            <div 
                                                                className="p-4 d-flex justify-content-between align-items-center flex-wrap position-relative overflow-hidden"
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => toggleOrder(order.Id || order.id)}
                                                            >
                                                                <div className="d-flex align-items-center mb-3 mb-md-0 position-relative" style={{ zIndex: 1 }}>
                                                                    <div className="order-icon-box me-4" style={{ 
                                                                        width: '55px', height: '55px', 
                                                                        borderRadius: '12px', 
                                                                        background: 'rgba(226,189,117,0.1)',
                                                                        color: 'var(--wine-gold)',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                                    }}>
                                                                        <i className="fa-solid fa-file-invoice-dollar fs-4"></i>
                                                                    </div>
                                                                    <div>
                                                                        <h5 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', transition: 'color 0.3s' }}>Đơn hàng #{order.Id || order.id}</h5>
                                                                        <div style={{ fontSize: '0.85rem', color: '#888' }}>
                                                                            <i className="fa-regular fa-calendar-check me-2"></i> 
                                                                            {new Date(order.OrderDate || order.orderDate).toLocaleString('vi-VN')}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="d-flex align-items-center gap-4 position-relative" style={{ zIndex: 1 }}>
                                                                    <div className="text-end">
                                                                        <div className="mb-2">{getStatusText(order.Status ?? order.status)}</div>
                                                                        <div className="fw-bold font-serif" style={{ color: 'var(--wine-burgundy)', fontSize: '1.25rem' }}>
                                                                            {(order.TotalAmount || order.totalAmount).toLocaleString()} <span style={{ color: 'var(--wine-gold)', fontSize: '1rem' }}>đ</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="expand-icon" style={{ 
                                                                        color: isExpanded ? 'var(--wine-gold)' : '#bbb', 
                                                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                                                                        transform: isExpanded ? 'rotate(180deg) scale(1.2)' : 'rotate(0) scale(1)' 
                                                                    }}>
                                                                        <i className="fa-solid fa-chevron-down fs-5"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Expanded Details */}
                                                            {isExpanded && (
                                                                <div className="p-4 border-top" style={{ borderColor: 'rgba(0,0,0,0.05) !important', background: 'rgba(250, 249, 247, 0.5)' }}>
                                                                    <h6 className="font-serif fw-bold mb-4 text-uppercase" style={{ color: 'var(--text-primary)', letterSpacing: '1px', fontSize: '0.9rem' }}>
                                                                        <i className="fa-solid fa-boxes-stacked me-2" style={{ color: 'var(--wine-gold)' }}></i> Chi tiết sản phẩm
                                                                    </h6>
                                                                    
                                                                    {details.length === 0 ? (
                                                                        <p className="text-center fst-italic text-muted">Không có chi tiết sản phẩm.</p>
                                                                    ) : (
                                                                        <div className="d-flex flex-column gap-3">
                                                                            {details.map((detail, idx) => {
                                                                                const isCancelled = detail.IsCancelled || detail.isCancelled;
                                                                                return (
                                                                                <div key={idx} className="glass-item-row d-flex align-items-center p-3 rounded-3" style={{ 
                                                                                    background: isCancelled ? '#f8f9fa' : '#fff', 
                                                                                    border: isCancelled ? '1px dashed #dc3545' : '1px solid rgba(0,0,0,0.05)',
                                                                                    transition: 'all 0.2s ease',
                                                                                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                                                                                    opacity: isCancelled ? 0.7 : 1
                                                                                }}>
                                                                                    <div className="rounded-3 d-flex align-items-center justify-content-center overflow-hidden" 
                                                                                         style={{ width: '80px', height: '80px', background: '#fff', border: '1px solid #eee', padding: '5px', filter: isCancelled ? 'grayscale(100%)' : 'none' }}>
                                                                                        <img 
                                                                                            src={detail.ImageUrl || detail.imageUrl || '/images/wine-placeholder.png'} 
                                                                                            alt={detail.Name || detail.name} 
                                                                                            onError={(e) => { e.target.src = 'https://placehold.co/200x300?text=Wine'; }}
                                                                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                                                                                        />
                                                                                    </div>
                                                                                    <div className="ms-4 flex-grow-1">
                                                                                        <Link to={`/product/${detail.ProductId || detail.productId}`} className="text-decoration-none">
                                                                                            <h6 className="fw-bold mb-2 font-serif text-dark" style={{ fontSize: '1.1rem', textDecoration: isCancelled ? 'line-through' : 'none' }}>
                                                                                                {detail.Name || detail.name}
                                                                                            </h6>
                                                                                        </Link>
                                                                                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                                                                            <span className="badge" style={{ background: 'rgba(226, 189, 117, 0.1)', color: 'var(--wine-burgundy)', border: '1px solid rgba(226, 189, 117, 0.3)' }}>SL: {detail.Quantity || detail.quantity}</span>
                                                                                            <span className="ms-3">x &nbsp; {(detail.UnitPrice || detail.unitPrice).toLocaleString()} đ</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="fw-bold ms-3 font-serif" style={{ fontSize: '1.2rem', color: isCancelled ? '#999' : 'var(--wine-burgundy)', textDecoration: isCancelled ? 'line-through' : 'none' }}>
                                                                                        {((detail.Quantity || detail.quantity) * (detail.UnitPrice || detail.unitPrice)).toLocaleString()} đ
                                                                                    </div>
                                                                                    {isCancelled && (
                                                                                        <div className="ms-4 text-end" style={{ minWidth: '120px' }}>
                                                                                            <span className="badge bg-danger mb-1"><i className="bi bi-x-circle me-1"></i>Đã hủy</span><br/>
                                                                                            {(detail.RefundAmount || detail.refundAmount) > 0 && (
                                                                                                <small className="text-danger fw-bold">Hoàn tiền: {(detail.RefundAmount || detail.refundAmount).toLocaleString()} đ</small>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )})}
                                                                        </div>
                                                                    )}
                                                                    
                                                                    {/* Action Buttons */}
                                                                    {[0, 10, 101, 102].includes(order.Status ?? order.status) && (
                                                                        <div className="text-end mt-4 pt-3" style={{ borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                                                                            <button 
                                                                                onClick={() => openCancelModal(order.Id || order.id)}
                                                                                className="btn-glass-danger px-4 py-2 rounded-pill"
                                                                            >
                                                                                <i className="fa-solid fa-xmark-square me-2"></i> Yêu cầu hủy đơn
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Cancel Order Modal */}
            {cancelModal.isOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card shadow-lg border-0" style={{ width: '90%', maxWidth: '500px', borderRadius: '15px', animation: 'slideDown 0.3s ease-out' }}>
                        <div className="card-header bg-white border-bottom-0 pt-4 pb-0 text-center">
                            <h5 className="fw-bold text-danger mb-0">Hủy Đơn Hàng #{cancelModal.orderId}</h5>
                        </div>
                        <div className="card-body p-4 p-md-5">
                            <div className="text-center mb-4">
                                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#dc3545' }}>
                                    <i className="fa-solid fa-triangle-exclamation fs-3"></i>
                                </div>
                                <p className="text-muted" style={{ fontSize: '0.95rem' }}>Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng này. Điều này sẽ giúp chúng tôi cải thiện dịch vụ tốt hơn.</p>
                            </div>
                            
                            <div className="d-flex flex-column gap-2 mb-4">
                                {[
                                    { id: 'Thay đổi ý định mua hàng', label: 'Thay đổi ý định mua hàng', icon: 'fa-rotate-left' },
                                    { id: 'Tìm thấy giá rẻ hơn ở nơi khác', label: 'Tìm thấy giá rẻ hơn ở nơi khác', icon: 'fa-tags' },
                                    { id: 'Thời gian giao hàng quá lâu', label: 'Thời gian giao hàng quá lâu', icon: 'fa-clock' },
                                    { id: 'Đặt nhầm sản phẩm/số lượng', label: 'Đặt nhầm sản phẩm/số lượng', icon: 'fa-box-open' },
                                    { id: 'Khác', label: 'Lý do khác...', icon: 'fa-comment-dots' }
                                ].map(reason => {
                                    const isSelected = cancelReasonType === reason.id;
                                    return (
                                        <div 
                                            key={reason.id}
                                            onClick={() => setCancelReasonType(reason.id)}
                                            className="p-3 rounded-3 d-flex align-items-center"
                                            style={{ 
                                                cursor: 'pointer', 
                                                transition: 'all 0.2s', 
                                                border: isSelected ? '2px solid var(--wine-burgundy)' : '1px solid #e9ecef',
                                                backgroundColor: isSelected ? 'rgba(121, 30, 50, 0.05)' : '#fff'
                                            }}
                                        >
                                            <div className="me-3 fs-5" style={{ color: isSelected ? 'var(--wine-burgundy)' : '#adb5bd', width: '25px', textAlign: 'center' }}>
                                                <i className={`fa-solid ${reason.icon}`}></i>
                                            </div>
                                            <div className="flex-grow-1 fw-medium" style={{ color: isSelected ? 'var(--wine-burgundy)' : '#495057' }}>
                                                {reason.label}
                                            </div>
                                            <div className="ms-2">
                                                <div style={{
                                                    width: '22px', height: '22px', borderRadius: '50%', 
                                                    border: isSelected ? '6px solid var(--wine-burgundy)' : '2px solid #dee2e6',
                                                    backgroundColor: '#fff',
                                                    transition: 'all 0.2s'
                                                }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {cancelReasonType === 'Khác' && (
                                <div className="mb-4" style={{ animation: 'slideDown 0.3s ease-out' }}>
                                    <label className="form-label fw-bold" style={{ fontSize: '0.9rem', color: 'var(--wine-burgundy)' }}>NHẬP LÝ DO CỤ THỂ (BẮT BUỘC):</label>
                                    <textarea 
                                        className="form-control" 
                                        rows="3" 
                                        value={cancelOtherReason}
                                        onChange={(e) => setCancelOtherReason(e.target.value)}
                                        placeholder="Vui lòng cho chúng tôi biết lý do chi tiết..."
                                        autoFocus
                                        style={{ border: '2px solid rgba(121, 30, 50, 0.2)', backgroundColor: '#fff', boxShadow: 'none' }}
                                    ></textarea>
                                </div>
                            )}

                            <div className="d-flex gap-3 mt-4 pt-2 border-top">
                                <button className="btn btn-light w-50 rounded-pill py-3 fw-semibold text-muted" onClick={() => setCancelModal({ isOpen: false, orderId: null })} style={{ border: '1px solid #e9ecef' }}>
                                    Đóng lại
                                </button>
                                <button className="btn w-50 rounded-pill py-3 fw-semibold text-white shadow-sm" onClick={submitCancelOrder} style={{ backgroundColor: 'var(--wine-burgundy)' }}>
                                    <i className="fa-solid fa-check me-2"></i> Xác nhận hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    border-radius: 20px;
                    box-shadow: 0 15px 40px -10px rgba(0, 0, 0, 0.1);
                }
                
                .glass-tabs-header {
                    background: rgba(255, 255, 255, 0.6);
                    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                }
                
                .glass-tab {
                    color: #777;
                    font-weight: 600;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border-bottom: 3px solid transparent;
                }
                
                .glass-tab:hover {
                    color: var(--wine-burgundy);
                    background: rgba(0,0,0,0.01);
                }
                
                .glass-tab.active {
                    color: var(--wine-burgundy);
                    border-bottom: 3px solid var(--wine-burgundy);
                    background: linear-gradient(to top, rgba(121,30,50,0.05), transparent);
                }
                
                .btn-glass-gold {
                    background: var(--wine-burgundy);
                    border: 1px solid var(--wine-burgundy);
                    color: #fff;
                    transition: all 0.3s ease;
                }
                
                .btn-glass-gold:hover {
                    background: var(--wine-burgundy-deep);
                    color: #fff;
                    box-shadow: 0 5px 15px rgba(121, 30, 50, 0.3);
                    transform: translateY(-2px);
                }
                
                .btn-glass-danger {
                    background: #fff;
                    border: 1px solid #dc3545;
                    color: #dc3545;
                    transition: all 0.3s ease;
                }
                
                .btn-glass-danger:hover {
                    background: #dc3545;
                    color: #fff;
                    box-shadow: 0 5px 15px rgba(220, 53, 69, 0.2);
                }

                .btn-glass-light {
                    background: #f8f9fa;
                    border: 1px solid #ddd;
                    color: #333;
                    transition: all 0.3s ease;
                }
                
                .btn-glass-light:hover {
                    background: #e9ecef;
                }
                
                .glass-input {
                    background: rgba(255, 255, 255, 0.8) !important;
                    border: 1px solid rgba(0, 0, 0, 0.1) !important;
                    color: #333 !important;
                    transition: all 0.3s ease;
                }
                
                .glass-input:focus {
                    background: #fff !important;
                    border-color: var(--wine-gold) !important;
                    box-shadow: 0 0 0 3px rgba(226, 189, 117, 0.2) !important;
                }
                
                .glass-order-card:hover {
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                    transform: translateY(-2px);
                    background: #fff !important;
                }
                
                .glass-item-row:hover {
                    border-color: rgba(226, 189, 117, 0.4) !important;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.03) !important;
                }

                .order-scroll-container::-webkit-scrollbar {
                    width: 6px;
                }
                .order-scroll-container::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.02); 
                    border-radius: 10px;
                }
                .order-scroll-container::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.1); 
                    border-radius: 10px;
                }
                .order-scroll-container::-webkit-scrollbar-thumb:hover {
                    background: var(--wine-gold); 
                }
                
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Profile;
