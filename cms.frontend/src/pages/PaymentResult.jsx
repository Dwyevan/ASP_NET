import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // loading | success | failed
    const [orderInfo, setOrderInfo] = useState({});

    useEffect(() => {
        const resultCode = searchParams.get('resultCode');
        const orderId = searchParams.get('orderId');
        const amount = searchParams.get('amount');
        const orderInfoParam = searchParams.get('orderInfo');
        const transId = searchParams.get('transId');

        // Lưu thông tin đơn hàng để hiển thị
        const realOrderId = orderId ? orderId.split('_')[0] : '';
        setOrderInfo({
            orderId: realOrderId,
            amount: amount,
            orderInfo: orderInfoParam,
            transId: transId
        });

        if (resultCode === '0') {
            // Thanh toán thành công -> Gọi API cập nhật trạng thái
            setStatus('success');
        } else {
            setStatus('failed');
        }

        // Luôn gọi Backend báo cáo kết quả (dù thành công hay thất bại)
        axiosClient.post('/Payment/MoMoReturn', {
            resultCode: resultCode,
            orderId: orderId,
            amount: amount,
            transId: transId
        }).catch(err => console.error('Lỗi cập nhật trạng thái:', err));
    }, [searchParams]);

    return (
        <div>
            <div className="page-banner">
                <div className="container">
                    <h1 className="font-serif">Kết Quả Thanh Toán</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Kết quả thanh toán</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container" style={{ padding: '60px 15px' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    {status === 'loading' && (
                        <div className="text-center py-5">
                            <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3 text-muted">Đang xử lý kết quả thanh toán...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '50px 40px',
                            border: '1px solid #e8e8e8',
                            textAlign: 'center',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.06)'
                        }}>
                            {/* Icon thành công */}
                            <div style={{
                                width: '90px', height: '90px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1cc88a, #17a673)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 25px', boxShadow: '0 8px 25px rgba(28,200,138,0.3)',
                                animation: 'fadeInUp 0.5s ease'
                            }}>
                                <i className="fa-solid fa-check" style={{ fontSize: '2.5rem', color: '#fff' }}></i>
                            </div>

                            <h2 className="font-serif mb-2" style={{ fontSize: '1.8rem', color: '#1cc88a' }}>Thanh Toán Thành Công!</h2>
                            <p style={{ color: '#666', marginBottom: '30px', lineHeight: 1.7 }}>
                                Đơn hàng của bạn đã được thanh toán qua <strong style={{ color: '#A50064' }}>MoMo</strong> thành công.
                            </p>

                            {/* Chi tiết giao dịch */}
                            <div style={{
                                background: '#f8f9fa', borderRadius: '12px', padding: '20px 25px',
                                textAlign: 'left', marginBottom: '30px', border: '1px solid #eee'
                            }}>
                                <h6 className="fw-bold mb-3" style={{ color: '#333', borderBottom: '2px solid #1cc88a', display: 'inline-block', paddingBottom: '5px' }}>
                                    <i className="fa-solid fa-receipt me-2"></i>Chi tiết giao dịch
                                </h6>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Mã đơn hàng:</span>
                                    <span className="fw-bold">#{orderInfo.orderId}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Số tiền:</span>
                                    <span className="fw-bold" style={{ color: '#A50064' }}>
                                        {orderInfo.amount ? parseInt(orderInfo.amount).toLocaleString() : '0'} ₫
                                    </span>
                                </div>
                                {orderInfo.transId && (
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Mã giao dịch MoMo:</span>
                                        <span className="fw-bold text-secondary" style={{ fontSize: '0.9rem' }}>{orderInfo.transId}</span>
                                    </div>
                                )}
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Phương thức:</span>
                                    <span className="fw-bold d-flex align-items-center">
                                        <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" style={{ height: '20px', marginRight: '6px' }} />
                                        Ví MoMo
                                    </span>
                                </div>
                            </div>

                            <div className="d-flex justify-content-center" style={{ gap: '12px', flexWrap: 'wrap' }}>
                                <Link to="/profile" className="btn btn-gold px-4">
                                    <i className="fa-solid fa-receipt me-2"></i> Xem đơn hàng
                                </Link>
                                <Link to="/shop" className="btn btn-outline-gold px-4">
                                    <i className="fa-solid fa-store me-2"></i> Tiếp tục mua sắm
                                </Link>
                            </div>
                        </div>
                    )}

                    {status === 'failed' && (
                        <div style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '50px 40px',
                            border: '1px solid #e8e8e8',
                            textAlign: 'center',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.06)'
                        }}>
                            {/* Icon thất bại */}
                            <div style={{
                                width: '90px', height: '90px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #e74a3b, #be2617)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 25px', boxShadow: '0 8px 25px rgba(231,74,59,0.3)',
                                animation: 'fadeInUp 0.5s ease'
                            }}>
                                <i className="fa-solid fa-times" style={{ fontSize: '2.5rem', color: '#fff' }}></i>
                            </div>

                            <h2 className="font-serif mb-2" style={{ fontSize: '1.8rem', color: '#e74a3b' }}>Thanh Toán Thất Bại</h2>
                            <p style={{ color: '#666', marginBottom: '15px', lineHeight: 1.7 }}>
                                Giao dịch MoMo chưa thực hiện thành công. Đơn hàng <strong>#{orderInfo.orderId}</strong> vẫn đang ở trạng thái chờ xử lý.
                            </p>
                            <p style={{ color: '#999', marginBottom: '30px', fontSize: '0.9rem' }}>
                                Bạn có thể thanh toán lại hoặc liên hệ hotline <strong style={{ color: 'var(--wine-burgundy)' }}>1900 8888</strong> để được hỗ trợ.
                            </p>

                            <div className="d-flex justify-content-center" style={{ gap: '12px', flexWrap: 'wrap' }}>
                                <Link to="/profile" className="btn btn-gold px-4">
                                    <i className="fa-solid fa-receipt me-2"></i> Xem đơn hàng
                                </Link>
                                <Link to="/" className="btn btn-outline-gold px-4">
                                    <i className="fa-solid fa-house me-2"></i> Trang chủ
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default PaymentResult;
