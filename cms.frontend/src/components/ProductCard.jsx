import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartProvider';
import { formatCurrency } from '../utils/formatters';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    const isOutOfStock = product.stockQuantity !== undefined && product.stockQuantity <= 0;

    return (
        <div className="product-card">
            {/* Badge */}
            {isOutOfStock ? (
                <span className="product-badge badge-out">Hết hàng</span>
            ) : product.id % 3 === 0 ? (
                <span className="product-badge badge-hot">Hot</span>
            ) : product.id % 4 === 0 ? (
                <span className="product-badge badge-new">New</span>
            ) : null}

            {/* Image */}
            <div className="product-card-image">
                <Link to={`/product/${product.id}`} style={{ display: 'block', height: '100%' }}>
                    <img
                        src={product.imageUrl || 'https://placehold.co/200x300?text=Wine'}
                        alt={product.name}
                        onError={(e) => { e.target.src = 'https://placehold.co/200x300?text=Wine'; }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Link>
            </div>

            {/* Body */}
            <div className="product-card-body">
                <div className="product-card-category">
                    {product.categoryProduct?.name || 'Rượu Vang'}
                </div>

                {/* Stars */}
                <div className="star-rating">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star-half-stroke"></i>
                    <span className="ml-1" style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>(4.5)</span>
                </div>

                <h5 className="product-card-title">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h5>

                <div className="product-card-price">
                    <span className="price-value">{formatCurrency(product.price)}</span>
                    {!isOutOfStock ? (
                        <button
                            onClick={handleAddToCart}
                            className="btn btn-sm"
                            style={{
                                background: 'linear-gradient(135deg, var(--wine-gold), #D4B85A)',
                                color: '#fff',
                                width: '36px', height: '36px',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: 'none',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 8px rgba(201,169,78,0.3)'
                            }}
                            title="Thêm vào giỏ"
                        >
                            <i className="fa-solid fa-cart-plus" style={{ fontSize: '0.9rem' }}></i>
                        </button>
                    ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Hết hàng</span>
                    )}
                </div>
            </div>
        </div>
    );
};

/* Skeleton version for loading state */
export const ProductCardSkeleton = () => (
    <div className="skeleton-card">
        <div className="skeleton-image"></div>
        <div style={{ padding: '20px' }}>
            <div className="skeleton skeleton-text-sm" style={{ width: '40%', marginBottom: '12px' }}>&nbsp;</div>
            <div className="skeleton skeleton-text" style={{ width: '90%' }}>&nbsp;</div>
            <div className="skeleton skeleton-text" style={{ width: '70%', marginBottom: '16px' }}>&nbsp;</div>
            <div className="d-flex justify-content-between align-items-center" style={{ paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                <div className="skeleton" style={{ width: '80px', height: '20px' }}>&nbsp;</div>
                <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }}>&nbsp;</div>
            </div>
        </div>
    </div>
);

export default ProductCard;
