import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
    return (
        <section className="hero-section" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)' }}>
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <div style={{ color: 'var(--wine-gold)', fontSize: '0.85rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '15px' }} className="animate-fadeInUp">
                    ✦ Premium Wine Collection ✦
                </div>
                <h1>Tinh Hoa Rượu Vang<br />Từ Khắp Thế Giới</h1>
                <p>
                    Khám phá bộ sưu tập rượu vang tuyệt hảo từ các nhà làm vang danh tiếng nhất.
                    Trải nghiệm hương vị đẳng cấp và phong cách sống thanh lịch.
                </p>
                <div className="d-flex justify-content-center" style={{ gap: '15px', flexWrap: 'wrap' }}>
                    <Link to="/shop" className="btn btn-gold btn-lg px-5">
                        <i className="fa-solid fa-store mr-2"></i> Khám Phá Ngay
                    </Link>
                    <a href="#best-seller" className="btn btn-outline-gold btn-lg px-5" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>
                        <i className="fa-solid fa-fire mr-2"></i> Bán Chạy Nhất
                    </a>
                </div>
            </div>
            {/* Decorative wave */}
            <div className="hero-decorative">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
                    <path d="M0 40L48 35C96 30 192 20 288 25C384 30 480 50 576 55C672 60 768 50 864 40C960 30 1056 20 1152 25C1248 30 1344 50 1392 60L1440 70V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z" fill="var(--wine-ivory)" />
                </svg>
            </div>
        </section>
    );
};

export default HeroBanner;
