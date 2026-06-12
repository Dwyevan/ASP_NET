import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import categoryProductService from '../services/categoryProductService';
import blogService from '../services/blogService';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import { formatDate } from '../utils/formatters';

const wineImages = [
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600',
    'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600',
    'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600',
    'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600', 
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600',
    'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600'
];

const Home = () => {
    // Phân loại danh sách sản phẩm theo tâm lý mua hàng
    const [bestSellers, setBestSellers] = useState([]);
    const [hotTrends, setHotTrends] = useState([]);
    const [summerWines, setSummerWines] = useState([]);
    const [sweetWines, setSweetWines] = useState([]);
    const [boldWines, setBoldWines] = useState([]);

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

                if (productsData.status === 'fulfilled') {
                    const allProducts = productsData.value;
                    
                    // 1. Best Sellers (Sản phẩm bán chạy - Giả lập 4 sản phẩm đầu)
                    setBestSellers(allProducts.slice(0, 4));

                    // 2. Hot Trends (Xu hướng - 4 sản phẩm tiếp theo)
                    setHotTrends(allProducts.slice(4, 8).length > 0 ? allProducts.slice(4, 8) : allProducts.slice(0, 4));

                    // 3. Mùa hè sảng khoái (Vang trắng, vang sủi)
                    const summer = allProducts.filter(p => {
                        const cat = (p.categoryProduct?.name || '').toLowerCase();
                        return cat.includes('trắng') || cat.includes('sủi') || cat.includes('champagne');
                    });
                    setSummerWines(summer.length > 0 ? summer.slice(0, 4) : allProducts.slice(0, 4));

                    // 4. Khẩu vị Ngọt ngào (Vang ngọt)
                    const sweet = allProducts.filter(p => {
                        const cat = (p.categoryProduct?.name || '').toLowerCase();
                        return cat.includes('ngọt');
                    });
                    setSweetWines(sweet.length > 0 ? sweet.slice(0, 4) : allProducts.slice(0, 4));

                    // 5. Khẩu vị Đậm đà (Vang đỏ)
                    const bold = allProducts.filter(p => {
                        const cat = (p.categoryProduct?.name || '').toLowerCase();
                        return cat.includes('đỏ');
                    });
                    setBoldWines(bold.length > 0 ? bold.slice(0, 4) : allProducts.slice(0, 4));
                }

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

    // Hàm render khung xương (Loading Skeleton)
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

            {/* ========= DANH MỤC CƠ BẢN ĐỈNH CAO THẨM MỸ ========= */}
            {categories.length > 0 && (
                <section style={{ padding: '60px 0 40px', background: 'var(--wine-ivory)' }}>
                    <div className="container">
                        <div className="text-center mb-5">
                            <h2 className="font-serif" style={{ color: 'var(--wine-burgundy)', fontSize: '2.2rem', marginBottom: '10px' }}>Tinh Hoa Giao Thoa</h2>
                            <p className="text-muted" style={{ fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>Lựa chọn dòng vang phù hợp nhất với phong cách và cá tính của riêng bạn.</p>
                        </div>
                        <div className="row justify-content-center">
                            {categories.map((cat, idx) => {
                                // Gán hình ảnh mẫu dựa trên tên danh mục để tăng tính thẩm mỹ
                                let bgImage = 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600'; // Default
                                const catName = cat.name.toLowerCase();
                                if (catName.includes('đỏ')) bgImage = 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600';
                                else if (catName.includes('trắng')) bgImage = 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600';
                                else if (catName.includes('sủi') || catName.includes('champagne')) bgImage = 'https://images.unsplash.com/photo-1599939571322-792a326e4e59?w=600';
                                else if (catName.includes('ngọt')) bgImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600';

                                return (
                                    <div className="col-lg-3 col-md-4 col-6 mb-4" key={cat.id}>
                                        <Link to={`/shop?category=${cat.id}`} className="text-decoration-none d-block h-100">
                                            <div className="category-image-card" style={{ 
                                                position: 'relative', 
                                                height: '280px', 
                                                borderRadius: '16px', 
                                                overflow: 'hidden',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                                backgroundImage: `url(${bgImage})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}>
                                                <div className="category-overlay" style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
                                                    transition: 'all 0.4s ease'
                                                }}></div>
                                                <div className="category-content" style={{
                                                    position: 'absolute',
                                                    bottom: '0',
                                                    left: '0',
                                                    width: '100%',
                                                    padding: '25px 20px',
                                                    textAlign: 'center',
                                                    color: '#fff',
                                                    zIndex: 2,
                                                    transition: 'all 0.4s ease'
                                                }}>
                                                    <h3 className="font-serif mb-2" style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '1px' }}>{cat.name}</h3>
                                                    <span className="explore-btn" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--wine-gold)', opacity: 0, transition: 'all 0.4s ease', transform: 'translateY(10px)', display: 'inline-block' }}>Khám phá <i className="fa-solid fa-arrow-right ms-1"></i></span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ========= 1. BEST SELLER SECTION ========= */}
            <section id="best-seller" style={{ padding: '80px 0' }}>
                <div className="container">
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <div>
                            <div style={{ color: 'var(--wine-gold)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
                                <i className="fa-solid fa-crown mr-2"></i> Khách Hàng Yêu Thích
                            </div>
                            <h2 className="font-serif mb-0" style={{ fontSize: '2.4rem' }}>Best Sellers</h2>
                        </div>
                        <Link to="/shop" className="btn btn-outline-gold d-none d-md-inline-block">
                            Xem tất cả <i className="fa-solid fa-arrow-right ml-2"></i>
                        </Link>
                    </div>
                    
                    {loading ? renderSkeletons() : (
                        <div className="row">
                            {bestSellers.map((wine, idx) => (
                                <div className="col-lg-3 col-md-4 col-6 mb-4" key={wine.id}>
                                    {/* Override badge manually for visual effect */}
                                    <div style={{position: 'relative', height: '100%'}}>
                                        {idx === 0 && <span className="product-badge" style={{background: 'var(--wine-burgundy)', zIndex: 10, left: 10, top: 10}}>Top 1</span>}
                                        <ProductCard product={wine} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ========= BANNER THEO MÙA ========= */}
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

            {/* ========= 2. SEASONAL PRODUCTS (VANG TRẮNG / SỦI) ========= */}
            <section style={{ padding: '0 0 80px 0' }}>
                <div className="container">
                    {loading ? renderSkeletons() : (
                        <div className="row">
                            {summerWines.map(wine => (
                                <div className="col-lg-3 col-md-4 col-6 mb-4" key={wine.id}>
                                    <ProductCard product={wine} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ========= 3. LỰA CHỌN THEO KHẨU VỊ (TABS HOẶC LƯỚI) ========= */}
            <section style={{ padding: '80px 0', background: 'var(--wine-cream)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Lựa Chọn Theo Khẩu Vị</h2>
                        <div className="section-divider"></div>
                        <p className="subtitle">Mỗi người một gu thưởng thức. Hãy để chúng tôi tìm ra chai vang dành riêng cho bạn.</p>
                    </div>

                    <div className="row mb-5">
                        <div className="col-lg-6 mb-4">
                            <div className="taste-card" style={{ background: '#fff', padding: '40px', borderRadius: 'var(--radius-lg)', height: '100%', border: '1px solid var(--border-light)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '10rem', color: 'var(--wine-cream)', zIndex: 0 }}>
                                    <i className="fa-solid fa-heart"></i>
                                </div>
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <h3 className="font-serif text-burgundy mb-3">Ngọt ngào, dễ uống</h3>
                                    <p className="text-secondary mb-4">Lựa chọn lý tưởng cho phái nữ hoặc những người mới bắt đầu làm quen với rượu vang. Vị ngọt dịu, hương trái cây đậm đà không gắt cồn.</p>
                                    <div className="row">
                                        {sweetWines.slice(0, 2).map(wine => (
                                            <div className="col-6" key={wine.id}>
                                                <ProductCard product={wine} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 mb-4">
                            <div className="taste-card" style={{ background: '#fff', padding: '40px', borderRadius: 'var(--radius-lg)', height: '100%', border: '1px solid var(--border-light)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '10rem', color: 'var(--wine-cream)', zIndex: 0 }}>
                                    <i className="fa-solid fa-wine-bottle"></i>
                                </div>
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <h3 className="font-serif text-burgundy mb-3">Đậm đà, cấu trúc chắc</h3>
                                    <p className="text-secondary mb-4">Dành cho những quý ông sành sỏi. Hương gỗ sồi xen lẫn vị chát (tannin) mạnh mẽ, mang lại hậu vị kéo dài đầy ấn tượng.</p>
                                    <div className="row">
                                        {boldWines.slice(0, 2).map(wine => (
                                            <div className="col-6" key={wine.id}>
                                                <ProductCard product={wine} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========= 4. HOT TRENDS ========= */}
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Xu Hướng Hiện Nay (Hot Trends)</h2>
                        <div className="section-divider"></div>
                        <p className="subtitle">Những dòng vang đang làm mưa làm gió trong cộng đồng yêu rượu</p>
                    </div>

                    {loading ? renderSkeletons() : (
                        <div className="row">
                            {hotTrends.map(wine => (
                                <div className="col-lg-3 col-md-4 col-6 mb-4" key={wine.id}>
                                    <ProductCard product={wine} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>


            {/* ========= WHY CHOOSE US ========= */}
            <section style={{ padding: '80px 0', background: 'var(--wine-dark)', color: '#fff' }}>
                <div className="container">
                    <div className="row">
                        {features.map((f, idx) => (
                            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0 text-center" key={idx}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wine-gold)', fontSize: '1.5rem', margin: '0 auto 20px' }}>
                                    <i className={`fa-solid ${f.icon}`}></i>
                                </div>
                                <h5 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '10px' }}>{f.title}</h5>
                                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: 0, opacity: 0.8 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========= BLOG SECTION ========= */}
            {posts.length > 0 && (
                <section style={{ padding: '80px 0', background: 'var(--wine-ivory)' }}>
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-end mb-5">
                            <div>
                                <h2 className="font-serif mb-2">Tạp Chí Rượu Vang</h2>
                                <p className="text-secondary mb-0">Kiến thức thưởng thức và tin tức mới nhất</p>
                            </div>
                            <Link to="/blog" className="btn btn-outline-gold d-none d-md-inline-block">
                                Khám phá thêm <i className="fa-solid fa-arrow-right ml-2"></i>
                            </Link>
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
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
