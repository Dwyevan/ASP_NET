import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

const LatestBlog = ({ posts }) => {
    if (!posts || posts.length === 0) return null;

    return (
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
                                    <Link to={`/blog/${post.id}`}>
                                        <img
                                            src={post.imageUrl || `https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400`}
                                            alt={post.title}
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400'; }}
                                        />
                                    </Link>
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
                                    <Link to={`/blog/${post.id}`} className="text-decoration-none mt-2 d-inline-block" style={{ color: 'var(--wine-gold)', fontWeight: 600, fontSize: '0.88rem' }}>
                                        Đọc tiếp <i className="fa-solid fa-arrow-right ml-1" style={{ fontSize: '0.75rem' }}></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestBlog;
