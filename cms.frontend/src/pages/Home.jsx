import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import categoryProductService from '../services/categoryProductService';
import blogService from '../services/blogService';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import { formatDate } from '../utils/formatters';

const wineImages = [
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
    'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400',
    'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400',
    'https://images.unsplash.com/photo-1566995541428-f4e21d4f5a93?w=400',
];

const Home = () => {
    const [featuredWines, setFeaturedWines] = useState([]);
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoading(true);
                const [productsData, catData, postsData] = await Promise.allSettled([
                    productService.getAllProducts(),
                    categoryProductService.getAllCategoryProducts(),
                    blogService.getAllPosts()
                ]);
                if (productsData.status === 'fulfilled') setFeaturedWines(productsData.value.slice(0, 8));
                if (catData.status === 'fulfilled') setCategories(catData.value);
                if (postsData.status === 'fulfilled') setPosts(postsData.value.slice(0, 3));
            } catch (error) {
                console.error("Lỗi tải dữ liệu trang chủ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    const features = [
        { icon: 'fa-certificate', title: 'Chính Hãng 100%', desc: 'Cam kết rượu nhập khẩu chính hãng có giấy tờ đầy đủ' },
        { icon: 'fa-truck-fast', title: 'Giao Hàng Nhanh', desc: 'Giao hàng hỏa tốc 2h trong nội thành TP.HCM' },
        { icon: 'fa-tags', title: 'Giá Tốt Nhất', desc: 'Giá cạnh tranh nhất thị trường, cam kết hoàn tiền chênh lệch' },
        { icon: 'fa-headset', title: 'Tư Vấn 24/7', desc: 'Đội ngũ Sommelier chuyên nghiệp sẵn sàng hỗ trợ bạn' },
    ];

    return (
        <div className="home-page">
            {/* ========= HERO SECTION ========= */}
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
                        <Link to="/blog" className="btn btn-outline-gold btn-lg px-5" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>
                            <i className="fa-solid fa-book-open mr-2"></i> Câu Chuyện Vang
                        </Link>
                    </div>
                </div>
                {/* Decorative wave */}
                <div className="hero-decorative">
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
                        <path d="M0 40L48 35C96 30 192 20 288 25C384 30 480 50 576 55C672 60 768 50 864 40C960 30 1056 20 1152 25C1248 30 1344 50 1392 60L1440 70V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z" fill="var(--wine-ivory)" />
                    </svg>
                </div>
            </section>

            {/* ========= CATEGORIES SECTION ========= */}
            {categories.length > 0 && (
                <section style={{ padding: '80px 0' }}>
                    <div className="container">
                        <div className="section-header">
                            <h2>Danh Mục Sản Phẩm</h2>
                            <div className="section-divider"></div>
                            <p className="subtitle">Khám phá đa dạng các dòng rượu vang ngoại nhập cao cấp</p>
                        </div>
                        <div className="row">
                            {categories.map((cat, idx) => (
                                <div className="col-md-4 col-6 mb-4" key={cat.id}>
                                    <Link to={`/shop?category=${cat.id}`} className="text-decoration-none">
                                        <div className="category-card">
                                            <img src={wineImages[idx % wineImages.length]} alt={cat.name} />
                                            <div className="category-card-overlay">
                                                <div>
                                                    <div className="category-card-title">{cat.name}</div>
                                                    {cat.description && (
                                                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '5px' }}>{cat.description}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ========= FEATURED PRODUCTS ========= */}
            <section style={{ padding: '80px 0', background: 'var(--wine-cream)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Bộ Sưu Tập Nổi Bật</h2>
                        <div className="section-divider"></div>
                        <p className="subtitle">Những chai rượu vang được yêu thích nhất tại Royal Wine Estate</p>
                    </div>

                    {loading ? (
                        <div className="row">
                            {[...Array(4)].map((_, i) => (
                                <div className="col-lg-3 col-md-4 col-6 mb-4" key={i}>
                                    <ProductCardSkeleton />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="row">
                            {featuredWines.map(wine => (
                                <div className="col-lg-3 col-md-4 col-6 mb-4" key={wine.id}>
                                    <ProductCard product={wine} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-4">
                        <Link to="/shop" className="btn btn-outline-gold px-5 py-2">
                            Xem Tất Cả Sản Phẩm <i className="fa-solid fa-arrow-right ml-2"></i>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ========= PROMO BANNER ========= */}
            <section className="position-relative" style={{ padding: '100px 0', backgroundImage: 'url(https://images.unsplash.com/photo-1543499459-d1460946bdc6?w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
                <div className="position-absolute" style={{ inset: 0, background: 'linear-gradient(135deg, rgba(107,29,42,0.85), rgba(26,26,26,0.85))' }}></div>
                <div className="container position-relative text-center text-white" style={{ zIndex: 2 }}>
                    <div style={{ color: 'var(--wine-gold)', fontSize: '0.82rem', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '15px' }}>
                        ✦ Ưu đãi đặc biệt ✦
                    </div>
                    <h2 className="font-serif mb-3" style={{ fontSize: '2.5rem' }}>Miễn Phí Giao Hàng</h2>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '500px', margin: '0 auto 30px' }}>
                        Cho tất cả đơn hàng từ 500.000₫ trong nội thành TP.HCM. Giao hàng hỏa tốc 2 giờ.
                    </p>
                    <Link to="/shop" className="btn btn-gold btn-lg px-5">
                        Mua Ngay <i className="fa-solid fa-arrow-right ml-2"></i>
                    </Link>
                </div>
            </section>

            {/* ========= WHY CHOOSE US ========= */}
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Tại Sao Chọn Chúng Tôi</h2>
                        <div className="section-divider"></div>
                        <p className="subtitle">Royal Wine Estate - Đối tác tin cậy cho mọi trải nghiệm vang</p>
                    </div>
                    <div className="row">
                        {features.map((f, idx) => (
                            <div className="col-lg-3 col-md-6 mb-4" key={idx}>
                                <div className="feature-card h-100">
                                    <div className="feature-icon">
                                        <i className={`fa-solid ${f.icon}`}></i>
                                    </div>
                                    <h5 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', fontFamily: "'Playfair Display', serif" }}>{f.title}</h5>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 0, lineHeight: 1.6 }}>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========= BLOG SECTION ========= */}
            {posts.length > 0 && (
                <section style={{ padding: '80px 0', background: 'var(--wine-cream)' }}>
                    <div className="container">
                        <div className="section-header">
                            <h2>Tin Tức & Bài Viết</h2>
                            <div className="section-divider"></div>
                            <p className="subtitle">Cập nhật kiến thức và xu hướng mới nhất về thế giới rượu vang</p>
                        </div>
                        <div className="row">
                            {posts.map(post => (
                                <div className="col-md-4 mb-4" key={post.id}>
                                    <div className="blog-card">
                                        <div className="blog-card-image">
                                            <img
                                                src={post.imageUrl || `https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400`}
                                                alt={post.title}
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400'; }}
                                            />
                                        </div>
                                        <div className="blog-card-body">
                                            <div className="blog-card-date">
                                                <i className="fa-regular fa-calendar mr-1"></i> {formatDate(post.createdAt || post.createdDate)}
                                            </div>
                                            <h5 className="blog-card-title">
                                                <Link to={`/blog/${post.id}`}>{post.title}</Link>
                                            </h5>
                                            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {post.shortDescription || post.content?.substring(0, 120) || 'Khám phá thêm về thế giới rượu vang...'}
                                            </p>
                                            <Link to={`/blog/${post.id}`} className="text-decoration-none" style={{ color: 'var(--wine-gold)', fontWeight: 600, fontSize: '0.88rem' }}>
                                                Đọc thêm <i className="fa-solid fa-arrow-right ml-1" style={{ fontSize: '0.75rem' }}></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-3">
                            <Link to="/blog" className="btn btn-outline-gold px-5 py-2">
                                Xem Tất Cả Bài Viết <i className="fa-solid fa-arrow-right ml-2"></i>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ========= BRAND STORY ========= */}
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <div style={{ position: 'relative' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Vineyard"
                                    className="img-fluid"
                                    style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}
                                />
                                <div style={{
                                    position: 'absolute', bottom: '-20px', right: '-20px',
                                    background: 'linear-gradient(135deg, var(--wine-gold), #D4B85A)',
                                    color: '#fff', padding: '20px 30px', borderRadius: 'var(--radius-md)',
                                    boxShadow: 'var(--shadow-gold)', textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>10+</div>
                                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Năm kinh nghiệm</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 pl-lg-5">
                            <div style={{ color: 'var(--wine-gold)', fontSize: '0.82rem', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '10px' }}>
                                Về chúng tôi
                            </div>
                            <h2 className="font-serif mb-4" style={{ fontSize: '2rem', lineHeight: 1.3 }}>Câu Chuyện Royal Wine Estate</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '15px' }}>
                                Sự kết hợp hoàn hảo giữa truyền thống lâu đời và nghệ thuật thưởng thức hiện đại.
                                Royal Wine Estate mang đến cho bạn những trải nghiệm vang đích thực nhất, được lựa chọn kỹ lưỡng bởi các chuyên gia Sommelier hàng đầu.
                            </p>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '25px' }}>
                                Từ những vườn nho ngập nắng của Bordeaux cho đến những hầm rượu danh tiếng tại Tuscany.
                                Mọi tinh hoa đều hội tụ tại đây.
                            </p>
                            <div className="d-flex" style={{ gap: '30px', flexWrap: 'wrap' }}>
                                <div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--wine-burgundy)', fontFamily: "'Playfair Display', serif" }}>500+</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sản phẩm</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--wine-burgundy)', fontFamily: "'Playfair Display', serif" }}>15+</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Quốc gia</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--wine-burgundy)', fontFamily: "'Playfair Display', serif" }}>10K+</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Khách hàng</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
