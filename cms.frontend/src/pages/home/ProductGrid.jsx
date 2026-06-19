import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard, { ProductCardSkeleton } from '../../components/ProductCard';

const ProductGrid = ({ id, title, subtitle, badge, products, loading, showTopBadge = false, bgColor = 'transparent' }) => {
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
        <section id={id} style={{ padding: '80px 0', background: bgColor }}>
            <div className="container">
                {badge ? (
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <div>
                            <div style={{ color: 'var(--wine-gold)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
                                {badge}
                            </div>
                            <h2 className="font-serif mb-0" style={{ fontSize: '2.4rem' }}>{title}</h2>
                        </div>
                        <Link to="/shop" className="btn btn-outline-gold d-none d-md-inline-block">
                            Xem tất cả <i className="fa-solid fa-arrow-right ml-2"></i>
                        </Link>
                    </div>
                ) : (
                    <div className="section-header">
                        <h2>{title}</h2>
                        <div className="section-divider"></div>
                        {subtitle && <p className="subtitle">{subtitle}</p>}
                    </div>
                )}

                {loading ? renderSkeletons() : (
                    <div className="row">
                        {products.map((wine, idx) => (
                            <div className="col-lg-3 col-md-4 col-6 mb-4" key={wine.id}>
                                <div style={{position: 'relative', height: '100%'}}>
                                    {showTopBadge && idx === 0 && <span className="product-badge" style={{background: 'var(--wine-burgundy)', zIndex: 10, left: 10, top: 10}}>Top 1</span>}
                                    <ProductCard product={wine} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductGrid;
