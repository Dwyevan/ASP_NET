import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../services/blogService';
import { formatDate } from '../utils/formatters';

const blogImages = [
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600',
    'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600',
    'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600',
    'https://images.unsplash.com/photo-1566995541428-f4e21d4f5a93?w=600',
    'https://images.unsplash.com/photo-1543499459-d1460946bdc6?w=600',
];

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCat, setSelectedCat] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [postsData, catData] = await Promise.allSettled([
                    blogService.getAllPosts(),
                    blogService.getBlogCategories()
                ]);
                if (postsData.status === 'fulfilled') setPosts(postsData.value);
                if (catData.status === 'fulfilled') setCategories(catData.value);
            } catch (error) {
                console.error("Lỗi tải blog:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredPosts = selectedCat
        ? posts.filter(p => p.categoryId === selectedCat)
        : posts;

    return (
        <div>
            {/* Page Banner */}
            <div className="page-banner">
                <div className="container">
                    <h1 className="font-serif">Tin Tức & Bài Viết</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Blog</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container" style={{ padding: '50px 15px' }}>
                <div className="row">
                    {/* Main Content */}
                    <div className="col-lg-8">
                        {loading ? (
                            <div className="row">
                                {[...Array(4)].map((_, i) => (
                                    <div className="col-md-6 mb-4" key={i}>
                                        <div className="skeleton-card">
                                            <div className="skeleton-image" style={{ height: '200px' }}></div>
                                            <div style={{ padding: '25px' }}>
                                                <div className="skeleton skeleton-text-sm mb-2">&nbsp;</div>
                                                <div className="skeleton skeleton-text-lg mb-2">&nbsp;</div>
                                                <div className="skeleton skeleton-text" style={{ width: '90%' }}>&nbsp;</div>
                                                <div className="skeleton skeleton-text" style={{ width: '70%' }}>&nbsp;</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredPosts.length === 0 ? (
                            <div className="empty-state" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                                <div className="empty-state-icon"><i className="fa-solid fa-newspaper"></i></div>
                                <h4 style={{ fontFamily: "'Playfair Display', serif" }}>Chưa có bài viết nào</h4>
                                <p style={{ color: 'var(--text-secondary)' }}>Bài viết sẽ sớm được cập nhật. Hãy quay lại sau nhé!</p>
                            </div>
                        ) : (
                            <div className="row">
                                {filteredPosts.map((post, idx) => (
                                    <div className="col-md-6 mb-4" key={post.id}>
                                        <div className="blog-card">
                                            <div className="blog-card-image">
                                                <img
                                                    src={post.imageUrl || blogImages[idx % blogImages.length]}
                                                    alt={post.title}
                                                    onError={(e) => { e.target.src = blogImages[idx % blogImages.length]; }}
                                                />
                                            </div>
                                            <div className="blog-card-body">
                                                <div className="blog-card-date">
                                                    <i className="fa-regular fa-calendar mr-1"></i>
                                                    {formatDate(post.createdAt || post.createdDate)}
                                                </div>
                                                <h5 className="blog-card-title">
                                                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                                                </h5>
                                                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {post.shortDescription || post.content?.substring(0, 150) || 'Khám phá thêm về thế giới rượu vang...'}
                                                </p>
                                                <Link to={`/blog/${post.id}`} className="text-decoration-none" style={{ color: 'var(--wine-gold)', fontWeight: 600, fontSize: '0.88rem' }}>
                                                    Đọc tiếp <i className="fa-solid fa-arrow-right ml-1" style={{ fontSize: '0.75rem' }}></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="col-lg-4">
                        {/* Categories */}
                        {categories.length > 0 && (
                            <div className="card border-0 mb-4" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                                <div className="sidebar-heading">
                                    <i className="fa-solid fa-folder mr-2" style={{ color: 'var(--wine-gold)' }}></i>
                                    Chuyên mục
                                </div>
                                <div className={`sidebar-item ${selectedCat === null ? 'active' : ''}`} onClick={() => setSelectedCat(null)}>
                                    Tất cả bài viết
                                    <span className="float-right" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({posts.length})</span>
                                </div>
                                {categories.map(cat => (
                                    <div className={`sidebar-item ${selectedCat === cat.id ? 'active' : ''}`} key={cat.id} onClick={() => setSelectedCat(cat.id)}>
                                        {cat.name}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* About Widget */}
                        <div className="card border-0 mb-4" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                            <div style={{ padding: '30px', textAlign: 'center' }}>
                                <i className="fa-solid fa-wine-glass mb-3" style={{ fontSize: '2.5rem', color: 'var(--wine-gold)' }}></i>
                                <h6 className="font-serif" style={{ fontWeight: 700 }}>Về Royal Wine</h6>
                                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    Blog chia sẻ kiến thức thưởng thức rượu vang, cách bảo quản, và những câu chuyện thú vị từ các vùng nho danh tiếng.
                                </p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="card border-0" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'linear-gradient(135deg, var(--wine-burgundy-deep), var(--wine-burgundy))', color: '#fff' }}>
                            <div style={{ padding: '30px', textAlign: 'center' }}>
                                <i className="fa-solid fa-store mb-3" style={{ fontSize: '2rem', color: 'var(--wine-gold)' }}></i>
                                <h6 className="font-serif" style={{ fontWeight: 700, color: '#fff' }}>Ghé thăm cửa hàng</h6>
                                <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '15px' }}>Khám phá bộ sưu tập rượu vang cao cấp ngay bây giờ</p>
                                <Link to="/shop" className="btn btn-gold btn-sm px-4">Xem sản phẩm</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
