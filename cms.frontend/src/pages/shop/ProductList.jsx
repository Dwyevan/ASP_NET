import React from 'react';
import ProductCard, { ProductCardSkeleton } from '../../components/ProductCard';

const ProductList = ({ loading, filteredWines, setSelectedCat, setSearchTerm, setPriceRange, maxPrice }) => {
    if (loading) {
        return (
            <div className="row">
                {[...Array(6)].map((_, i) => (
                    <div className="col-md-4 col-6 mb-4" key={i}>
                        <ProductCardSkeleton />
                    </div>
                ))}
            </div>
        );
    }

    if (filteredWines.length === 0) {
        return (
            <div className="empty-state" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                <div className="empty-state-icon">
                    <i className="fa-solid fa-wine-bottle"></i>
                </div>
                <h4 style={{ color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>Không tìm thấy sản phẩm</h4>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '10px auto 20px' }}>
                    Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.
                </p>
                <button onClick={() => { setSelectedCat(null); setSearchTerm(''); setPriceRange([0, maxPrice]); }} className="btn btn-outline-gold">
                    Xóa bộ lọc
                </button>
            </div>
        );
    }

    return (
        <div className="row">
            {filteredWines.map(wine => (
                <div className="col-lg-4 col-md-6 col-6 mb-4" key={wine.id}>
                    <ProductCard product={wine} />
                </div>
            ))}
        </div>
    );
};

export default ProductList;
