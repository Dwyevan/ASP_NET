import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="site-footer mt-auto">
            <div className="container">
                <div className="row">
                    {/* Brand Column */}
                    <div className="col-lg-4 col-md-6 mb-4">
                        <div className="d-flex align-items-center mb-3" style={{ gap: '10px' }}>
                            <i className="fa-solid fa-wine-glass-empty" style={{ fontSize: '1.6rem', color: 'var(--wine-gold)' }}></i>
                            <div className="footer-brand" style={{ marginBottom: 0 }}>Royal Wine</div>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '20px' }}>
                            Nhà phân phối rượu vang nhập khẩu chính hãng cao cấp. Mang đến những trải nghiệm thưởng thức vang đích thực từ các vùng nho danh tiếng nhất thế giới.
                        </p>
                        <div className="footer-social">
                            <a href="#!"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="#!"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#!"><i className="fa-brands fa-tiktok"></i></a>
                            <a href="#!"><i className="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6 mb-4">
                        <h6 className="footer-heading">Liên Kết</h6>
                        <ul className="footer-links">
                            <li><Link to="/">Trang chủ</Link></li>
                            <li><Link to="/shop">Cửa hàng</Link></li>
                            <li><Link to="/blog">Tin tức</Link></li>
                            <li><Link to="/cart">Giỏ hàng</Link></li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h6 className="footer-heading">Chính Sách</h6>
                        <ul className="footer-links">
                            <li><a href="#!">Chính sách vận chuyển</a></li>
                            <li><a href="#!">Chính sách đổi trả</a></li>
                            <li><a href="#!">Chính sách bảo mật</a></li>
                            <li><a href="#!">Điều khoản sử dụng</a></li>
                            <li><a href="#!">Hướng dẫn mua hàng</a></li>
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h6 className="footer-heading">Liên Hệ</h6>
                        <ul className="footer-links" style={{ marginBottom: '20px' }}>
                            <li>
                                <i className="fa-solid fa-location-dot mr-2" style={{ color: 'var(--wine-gold)', width: '16px' }}></i>
                                123 Nguyễn Huệ, Q.1, TP.HCM
                            </li>
                            <li>
                                <i className="fa-solid fa-phone mr-2" style={{ color: 'var(--wine-gold)', width: '16px' }}></i>
                                <a href="tel:19008888">1900 8888</a>
                            </li>
                            <li>
                                <i className="fa-solid fa-envelope mr-2" style={{ color: 'var(--wine-gold)', width: '16px' }}></i>
                                <a href="mailto:contact@royalwine.vn">contact@royalwine.vn</a>
                            </li>
                        </ul>

                        <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, marginBottom: '10px' }}>Nhận tin khuyến mãi</p>
                        <div className="d-flex">
                            <input type="email" className="newsletter-input flex-fill" placeholder="Email của bạn..." />
                            <button className="newsletter-btn">
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <span>&copy; {new Date().getFullYear()} Royal Wine Estate. Thiết kế bởi Hà Nhật Duy.</span>
                    <span className="mt-2 mt-md-0">
                        <i className="fa-solid fa-shield-halved mr-1" style={{ color: 'var(--wine-gold)' }}></i>
                        Cam kết rượu chính hãng 100%
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
