import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const ProductInfo = ({ wine, quantity, setQuantity, handleAddToCart }) => {
    return (
        <div style={{ paddingLeft: '10px' }}>
            <span className="product-info-badge" style={{ background: 'rgba(201,169,78,0.15)', color: 'var(--wine-gold)', marginBottom: '15px' }}>
                {wine.categoryProduct?.name || 'Rượu Vang'}
            </span>

            <h2 className="font-serif mt-3 mb-3" style={{ fontSize: '2rem', lineHeight: 1.3 }}>{wine.name}</h2>

            {/* Stars */}
            <div className="mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                <div className="star-rating" style={{ fontSize: '0.9rem' }}>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star-half-stroke"></i>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>(4.5 / 5 - 28 đánh giá)</span>
            </div>

            <div className="mb-4" style={{ paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: 'var(--wine-burgundy)' }}>
                    {formatCurrency(wine.price)}
                </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '25px', fontSize: '0.95rem' }}>
                {wine.description || 'Rượu vang cao cấp nhập khẩu chính hãng. Hương vị đậm đà, thơm nồng đặc trưng, phù hợp cho mọi dịp thưởng thức.'}
            </p>

            {/* Info Grid */}
            <div className="info-grid mb-4">
                <div className="info-grid-item">
                    <i className="fa-solid fa-wine-glass"></i>
                    <div className="label">Danh mục</div>
                    <div className="value">{wine.categoryProduct?.name || 'Vang'}</div>
                </div>
                <div className="info-grid-item">
                    <i className="fa-solid fa-boxes-stacked"></i>
                    <div className="label">Tồn kho</div>
                    <div className="value">{wine.stockQuantity} chai</div>
                </div>
                <div className="info-grid-item">
                    <i className="fa-solid fa-earth-americas"></i>
                    <div className="label">Xuất xứ</div>
                    <div className="value">Nhập khẩu</div>
                </div>
                <div className="info-grid-item">
                    <i className="fa-solid fa-droplet"></i>
                    <div className="label">Dung tích</div>
                    <div className="value">750ml</div>
                </div>
            </div>

            {/* Add to Cart */}
            {wine.stockQuantity > 0 ? (
                <div style={{ background: 'var(--surface-light)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                    <div className="d-flex align-items-center mb-3" style={{ gap: '20px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Số lượng:</span>
                        <div className="quantity-selector">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                <i className="fa-solid fa-minus" style={{ fontSize: '0.8rem' }}></i>
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, Math.min(wine.stockQuantity, parseInt(e.target.value) || 1)))}
                                min="1"
                                max={wine.stockQuantity}
                            />
                            <button onClick={() => setQuantity(Math.min(wine.stockQuantity, quantity + 1))}>
                                <i className="fa-solid fa-plus" style={{ fontSize: '0.8rem' }}></i>
                            </button>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            (Còn {wine.stockQuantity} chai)
                        </span>
                    </div>
                    <button className="btn btn-gold btn-lg w-100" onClick={handleAddToCart}>
                        <i className="fa-solid fa-cart-plus mr-2"></i> Thêm Vào Giỏ Hàng
                    </button>
                </div>
            ) : (
                <div style={{ background: '#fff5f5', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #ffcccc', textAlign: 'center' }}>
                    <i className="fa-solid fa-circle-exclamation mr-2" style={{ color: '#E74C3C' }}></i>
                    <strong style={{ color: '#E74C3C' }}>SẢN PHẨM TẠM HẾT HÀNG</strong>
                </div>
            )}

            {/* Guarantees */}
            <div className="mt-4">
                <div className="guarantee-item">
                    <i className="fa-solid fa-truck-fast"></i>
                    <span>Giao hàng hỏa tốc 2h nội thành TP.HCM</span>
                </div>
                <div className="guarantee-item">
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>Cam kết chính hãng 100%, hoàn tiền nếu phát hiện hàng giả</span>
                </div>
                <div className="guarantee-item">
                    <i className="fa-solid fa-rotate-left"></i>
                    <span>Đổi trả miễn phí trong 7 ngày nếu sản phẩm lỗi</span>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;
