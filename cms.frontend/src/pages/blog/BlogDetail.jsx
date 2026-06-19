import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogService from '../../services/blogService';
import { formatDate } from '../../utils/formatters';

const BlogDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const data = await blogService.getPostById(id);
                setPost(data);

                // Fetch related posts
                try {
                    const allPosts = await blogService.getAllPosts();
                    setRelatedPosts(allPosts.filter(p => p.id !== data.id).slice(0, 3));
                } catch (e) {
                    console.error("Lỗi tải bài viết liên quan:", e);
                }
            } catch (error) {
                console.error("Lỗi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div>
            <div className="page-banner">
                <div className="container"><h1 className="font-serif">Đang tải...</h1></div>
            </div>
            <div className="container" style={{ padding: '50px 15px', maxWidth: '800px' }}>
                <div className="skeleton skeleton-text-lg mb-3">&nbsp;</div>
                <div className="skeleton skeleton-text-sm mb-4" style={{ width: '30%' }}>&nbsp;</div>
                <div className="skeleton" style={{ height: '350px', borderRadius: 'var(--radius-lg)', marginBottom: '30px' }}>&nbsp;</div>
                <div className="skeleton skeleton-text mb-2">&nbsp;</div>
                <div className="skeleton skeleton-text mb-2">&nbsp;</div>
                <div className="skeleton skeleton-text mb-2" style={{ width: '80%' }}>&nbsp;</div>
            </div>
        </div>
    );

    if (!post) return (
        <div className="container" style={{ padding: '100px 15px', textAlign: 'center' }}>
            <div className="empty-state">
                <div className="empty-state-icon"><i className="fa-solid fa-newspaper"></i></div>
                <h3 style={{ fontFamily: "'Playfair Display', serif" }}>Không tìm thấy bài viết</h3>
                <Link to="/blog" className="btn btn-outline-gold mt-3">Quay lại Blog</Link>
            </div>
        </div>
    );

    return (
        <div>
            <div className="page-banner">
                <div className="container">
                    <h1 className="font-serif" style={{ fontSize: '1.6rem', maxWidth: '700px', margin: '0 auto' }}>{post.title}</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                            <li className="breadcrumb-item"><Link to="/blog">Blog</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{post.title}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container" style={{ padding: '50px 15px' }}>
                <div className="row">
                    {/* Article */}
                    <div className="col-lg-8">
                        <article style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
                            {/* Featured Image */}
                            {post.imageUrl && (
                                <div style={{ height: '400px', overflow: 'hidden' }}>
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800'; }}
                                    />
                                </div>
                            )}

                            <div style={{ padding: '35px 40px' }}>
                                {/* Meta */}
                                <div className="d-flex align-items-center mb-4" style={{ gap: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <span><i className="fa-regular fa-calendar mr-1" style={{ color: 'var(--wine-gold)' }}></i> {formatDate(post.createdAt || post.createdDate)}</span>
                                    <span><i className="fa-regular fa-user mr-1" style={{ color: 'var(--wine-gold)' }}></i> Admin</span>
                                    {post.category && <span><i className="fa-regular fa-folder mr-1" style={{ color: 'var(--wine-gold)' }}></i> {post.category.name}</span>}
                                </div>

                                {/* Content */}
                                <div style={{ color: 'var(--text-secondary)', lineHeight: 2, fontSize: '0.95rem' }}
                                    dangerouslySetInnerHTML={{ __html: post.content || '<p>Nội dung bài viết sẽ được cập nhật sớm.</p>' }}
                                />

                                {/* Tags */}
                                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
                                    <div className="d-flex align-items-center" style={{ gap: '10px', flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Tags:</span>
                                        {['Rượu vang', 'Kiến thức', 'Thưởng thức'].map(tag => (
                                            <span key={tag} style={{ background: 'var(--surface-light)', padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="col-lg-4">
                        {/* Related Posts */}
                        {relatedPosts.length > 0 && (
                            <div className="card border-0 mb-4" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                                <div className="sidebar-heading">
                                    <i className="fa-solid fa-newspaper mr-2" style={{ color: 'var(--wine-gold)' }}></i>
                                    Bài viết khác
                                </div>
                                <div style={{ padding: '16px 20px' }}>
                                    {relatedPosts.map(rp => (
                                        <div key={rp.id} className="d-flex mb-3 pb-3" style={{ gap: '12px', borderBottom: '1px solid var(--border-light)' }}>
                                            <div style={{ width: '70px', height: '55px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: 'var(--surface-light)' }}>
                                                <img
                                                    src={rp.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100'}
                                                    alt={rp.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100'; }}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <Link to={`/blog/${rp.id}`} className="text-decoration-none" style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {rp.title}
                                                </Link>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                                    <i className="fa-regular fa-calendar mr-1"></i> {formatDate(rp.createdAt || rp.createdDate)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Back to blog */}
                        <Link to="/blog" className="btn btn-outline-gold w-100">
                            <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại Blog
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
