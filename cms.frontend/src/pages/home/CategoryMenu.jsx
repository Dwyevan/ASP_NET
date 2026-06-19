import React from 'react';
import { Link } from 'react-router-dom';

const CategoryMenu = ({ categories }) => {
    if (!categories || categories.length === 0) return null;

    return (
        <section style={{ padding: '60px 0 40px', background: 'var(--wine-ivory)' }}>
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="font-serif" style={{ color: 'var(--wine-burgundy)', fontSize: '2.2rem', marginBottom: '10px' }}>Tinh Hoa Giao Thoa</h2>
                    <p className="text-muted" style={{ fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>Lựa chọn dòng vang phù hợp nhất với phong cách và cá tính của riêng bạn.</p>
                </div>
                <div className="row justify-content-center">
                    {categories.map((cat) => {
                        // Lấy hình ảnh từ database (cat.imageUrl), nếu không có thì dùng ảnh mặc định
                        const bgImage = cat.imageUrl || 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600';

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
    );
};

export default CategoryMenu;
