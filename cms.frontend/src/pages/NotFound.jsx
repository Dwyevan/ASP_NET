import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div>
            <div className="page-banner">
                <div className="container">
                    <h1 className="font-serif">404 - Không Tìm Thấy Trang</h1>
                </div>
            </div>
            <div className="container" style={{ padding: '100px 15px', textAlign: 'center' }}>
                <div className="empty-state">
                    <div className="empty-state-icon" style={{ fontSize: '4rem', color: 'var(--wine-burgundy)' }}>
                        <i className="fa-solid fa-wine-bottle"></i>
                        <i className="fa-solid fa-question ml-2" style={{ fontSize: '2rem', position: 'absolute', right: '-10px', top: '0' }}></i>
                    </div>
                    <h2 className="font-serif mt-4" style={{ fontSize: '2rem' }}>Opps! Trang này không tồn tại</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '15px auto 30px' }}>
                        Có vẻ như bạn đã đi lạc. Đường dẫn bạn đang tìm kiếm có thể đã bị thay đổi, xóa bỏ hoặc không bao giờ tồn tại.
                    </p>
                    <div className="d-flex justify-content-center" style={{ gap: '15px' }}>
                        <Link to="/" className="btn btn-outline-gold px-4">
                            <i className="fa-solid fa-house mr-2"></i> Về Trang Chủ
                        </Link>
                        <Link to="/shop" className="btn btn-gold px-4">
                            <i className="fa-solid fa-store mr-2"></i> Đến Cửa Hàng
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
