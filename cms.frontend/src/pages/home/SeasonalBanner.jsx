import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard, { ProductCardSkeleton } from '../../components/ProductCard';

const SeasonalBanner = ({ products, loading }) => {
    const renderSkeletons = () => (
        <div className="row">
            {[...Array(4)].map((_, i) => (
                <div className="col-lg-3 col-md-4 col-6 mb-4" key={i}>
                    <ProductCardSkeleton />
                </div>
            ))}
        </div>
    );

    return (
        <>
            <section style={{ padding: '0 0 80px 0' }}>
                <div className="container">
                    <div className="seasonal-banner" style={{ 
                        borderRadius: 'var(--radius-lg)', 
                        overflow: 'hidden', 
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        minHeight: '300px',
                        backgroundImage: 'url(https://images.unsplash.com/photo-1572913017551-71fb278cb7bf?w=1200&q=80)',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(26,26,26,0.9) 0%, rgba(26,26,26,0.4) 100%)' }}></div>
                        <div style={{ position: 'relative', zIndex: 2, padding: '40px 50px', color: '#fff', maxWidth: '600px' }}>
                            <div className="badge mb-3" style={{ background: '#4fa8d1', color: '#fff', fontSize: '0.8rem', padding: '6px 12px' }}>
                                <i className="fa-solid fa-sun mr-1"></i> BST Giải Nhiệt Mùa Hè
                            </div>
                            <h3 className="font-serif mb-3" style={{ fontSize: '2.2rem' }}>Thanh mát & Sảng khoái</h3>
                            <p style={{ opacity: 0.9, lineHeight: 1.6, marginBottom: '25px' }}>
                                Xua tan cái nóng nực của mùa hè với những ly vang trắng giòn giã hay sâm banh sủi bọt ướp lạnh tuyệt hảo. Sự lựa chọn hoàn hảo cho những buổi tiệc hồ bơi.
                            </p>
                            <Link to="/shop?category=trang" className="btn btn-gold px-4">Khám phá Vang Trắng</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: '0 0 80px 0' }}>
                <div className="container">
                    {loading ? renderSkeletons() : (
                        <div className="row">
                            {products.map(wine => (
                                <div className="col-lg-3 col-md-4 col-6 mb-4" key={wine.id}>
                                    <ProductCard product={wine} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default SeasonalBanner;
