import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/productService';
import { useCart } from '../../components/CartProvider';
import ProductCard from '../../components/ProductCard';
import ProductInfo from './ProductInfo';

const ProductDetail = () => {
    const { id } = useParams();
    const [wine, setWine] = useState(null);
    const [relatedWines, setRelatedWines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchWine = async () => {
            try {
                setLoading(true);
                setQuantity(1);
                const data = await productService.getProductById(id);
                setWine(data);

                // Fetch related products
                try {
                    if (data.categoryProduct?.id) {
                        const related = await productService.getProductsByCategory(data.categoryProduct.id);
                        setRelatedWines(related.filter(w => w.id !== data.id).slice(0, 4));
                    } else {
                        const all = await productService.getAllProducts();
                        setRelatedWines(all.filter(w => w.id !== data.id).slice(0, 4));
                    }
                } catch (e) {
                    console.error("Lỗi tải SP liên quan:", e);
                }
            } catch (error) {
                console.error("Lỗi tải chi tiết rượu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWine();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = () => {
        addToCart(wine, quantity);
    };

    if (loading) return (
        <div>
            <div className="page-banner">
                <div className="container">
                    <h1 className="font-serif">Chi Tiết Sản Phẩm</h1>
                </div>
            </div>
            <div className="container" style={{ padding: '50px 15px' }}>
                <div className="row">
                    <div className="col-md-5"><div className="skeleton" style={{ height: '500px', borderRadius: 'var(--radius-lg)' }}>&nbsp;</div></div>
                    <div className="col-md-7">
                        <div className="skeleton skeleton-text-sm mb-3" style={{ width: '30%' }}>&nbsp;</div>
                        <div className="skeleton skeleton-text-lg mb-3">&nbsp;</div>
                        <div className="skeleton skeleton-text-lg mb-4" style={{ width: '40%' }}>&nbsp;</div>
                        <div className="skeleton" style={{ height: '100px' }}>&nbsp;</div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!wine) return (
        <div className="container" style={{ padding: '100px 15px', textAlign: 'center' }}>
            <div className="empty-state">
                <div className="empty-state-icon"><i className="fa-solid fa-wine-glass-empty"></i></div>
                <h3 style={{ fontFamily: "'Playfair Display', serif" }}>Không tìm thấy sản phẩm</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị gỡ.</p>
                <Link to="/shop" className="btn btn-outline-gold mt-3">Quay lại cửa hàng</Link>
            </div>
        </div>
    );

    return (
        <div>
            {/* Page Banner */}
            <div className="page-banner">
                <div className="container">
                    <h1 className="font-serif" style={{ fontSize: '1.8rem' }}>{wine.name}</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                            <li className="breadcrumb-item"><Link to="/shop">Cửa hàng</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{wine.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container" style={{ padding: '50px 15px' }}>
                <div className="row">
                    {/* Image */}
                    <div className="col-lg-5 mb-4">
                        <div className="product-detail-image">
                            <img
                                src={wine.imageUrl || 'https://placehold.co/400x600?text=Premium+Wine'}
                                alt={wine.name}
                                onError={(e) => { e.target.src = 'https://placehold.co/400x600?text=Premium+Wine'; }}
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="col-lg-7">
                        <ProductInfo 
                            wine={wine} 
                            quantity={quantity} 
                            setQuantity={setQuantity} 
                            handleAddToCart={handleAddToCart} 
                        />
                    </div>
                </div>

                {/* ========= TABS ========= */}
                <div className="detail-tabs mt-5">
                    <ul className="nav nav-tabs mb-0">
                        {[
                            { key: 'description', label: 'Mô tả', icon: 'fa-file-lines' },
                            { key: 'info', label: 'Thông tin', icon: 'fa-circle-info' },
                            { key: 'reviews', label: 'Đánh giá (28)', icon: 'fa-star' }
                        ].map(tab => (
                            <li className="nav-item" key={tab.key}>
                                <button
                                    className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    <i className={`fa-solid ${tab.icon} mr-2`} style={{ fontSize: '0.85rem' }}></i>
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div style={{ padding: '30px', background: '#fff', border: '1px solid var(--border-light)', borderTop: 'none', borderRadius: '0 0 var(--radius-md) var(--radius-md)' }}>
                        {activeTab === 'description' && (
                            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                                <p>{wine.description || 'Rượu vang cao cấp nhập khẩu chính hãng. Hương vị đậm đà, thơm nồng đặc trưng.'}</p>
                                <p>Sản phẩm được nhập khẩu trực tiếp từ các nhà làm rượu danh tiếng, đảm bảo chất lượng và nguồn gốc rõ ràng. Phù hợp với các dịp tiệc tùng, tặng quà, hoặc thưởng thức hàng ngày.</p>
                            </div>
                        )}
                        {activeTab === 'info' && (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                    {[
                                        ['Tên sản phẩm', wine.name],
                                        ['Danh mục', wine.categoryProduct?.name || 'Rượu Vang'],
                                        ['Dung tích', '750ml'],
                                        ['Xuất xứ', 'Nhập khẩu chính hãng'],
                                        ['Bảo quản', 'Nơi khô ráo, thoáng mát, tránh ánh sáng trực tiếp'],
                                        ['Tình trạng', wine.stockQuantity > 0 ? `Còn hàng (${wine.stockQuantity} chai)` : 'Hết hàng']
                                    ].map(([label, value], idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                            <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)', width: '40%', background: idx % 2 === 0 ? 'var(--surface-light)' : 'transparent' }}>{label}</td>
                                            <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', background: idx % 2 === 0 ? 'var(--surface-light)' : 'transparent' }}>{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="text-center" style={{ padding: '30px' }}>
                                <i className="fa-solid fa-star mb-3" style={{ fontSize: '2rem', color: 'var(--wine-gold)' }}></i>
                                <h5 style={{ fontFamily: "'Playfair Display', serif" }}>Đánh giá sản phẩm</h5>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Chức năng đánh giá sẽ sớm được cập nhật. Cảm ơn bạn đã quan tâm!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ========= RELATED PRODUCTS ========= */}
                {relatedWines.length > 0 && (
                    <div className="mt-5">
                        <div className="section-header">
                            <h2>Sản Phẩm Liên Quan</h2>
                            <div className="section-divider"></div>
                        </div>
                        <div className="row">
                            {relatedWines.map(w => (
                                <div className="col-lg-3 col-md-4 col-6 mb-4" key={w.id}>
                                    <ProductCard product={w} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
