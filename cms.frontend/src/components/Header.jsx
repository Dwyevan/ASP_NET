import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from './CartProvider';
import { useAuth } from './AuthProvider';
import { formatCurrency } from '../utils/formatters';
import categoryProductService from '../services/categoryProductService';
import blogService from '../services/blogService';

const Header = () => {
    const { cartItems, getCartCount, getCartTotal, removeFromCart } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [productCategories, setProductCategories] = useState([]);
    const [blogCategories, setBlogCategories] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setMobileOpen(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        
        // Fetch categories for dropdowns
        const fetchCategories = async () => {
            try {
                const [pCat, bCat] = await Promise.allSettled([
                    categoryProductService.getAllCategoryProducts(),
                    blogService.getBlogCategories()
                ]);
                if (pCat.status === 'fulfilled') setProductCategories(pCat.value);
                if (bCat.status === 'fulfilled') setBlogCategories(bCat.value);
            } catch (err) {
                console.error("Error fetching categories for header", err);
            }
        };
        fetchCategories();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    const navLinks = [
        { path: '/', label: 'Trang Chủ', icon: 'fa-house' },
        { path: '/shop', label: 'Cửa Hàng', icon: 'fa-store' },
        { path: '/blog', label: 'Tin Tức', icon: 'fa-newspaper' },
    ];

    return (
        <>
            {/* Top Bar */}
            <div className="top-bar d-none d-lg-block">
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center" style={{ gap: '20px' }}>
                        <span><i className="fa-solid fa-phone mr-2" style={{ color: 'var(--wine-gold)' }}></i> 1900 8888</span>
                        <span><i className="fa-solid fa-envelope mr-2" style={{ color: 'var(--wine-gold)' }}></i> contact@royalwine.vn</span>
                    </div>
                    <div className="d-flex align-items-center" style={{ gap: '15px' }}>
                        <span>Giao hàng miễn phí đơn từ 500.000₫</span>
                        <span className="mx-2">|</span>
                        <a href="#!"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="#!"><i className="fa-brands fa-instagram"></i></a>
                        <a href="#!"><i className="fa-brands fa-tiktok"></i></a>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className={`main-header sticky-top ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center" style={{ padding: '12px 0' }}>
                        {/* Logo */}
                        <Link to="/" className="text-decoration-none d-flex align-items-center" style={{ gap: '10px' }}>
                            <i className="fa-solid fa-wine-glass-empty" style={{ fontSize: '1.8rem', color: 'var(--wine-burgundy)' }}></i>
                            <div>
                                <div className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--wine-burgundy)', lineHeight: 1.1 }}>Royal Wine</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--wine-gold)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>Estate</div>
                            </div>
                        </Link>

                        {/* Nav - Desktop */}
                        <nav className="d-none d-lg-flex align-items-center" style={{ gap: '15px' }}>
                            <Link to="/" className={`nav-link-wine ${location.pathname === '/' ? 'active' : ''}`}>Trang Chủ</Link>
                            
                            <div className="nav-item-dropdown">
                                <Link to="/shop" className={`nav-link-wine ${location.pathname.startsWith('/shop') ? 'active' : ''}`}>
                                    Cửa Hàng <i className="fa-solid fa-angle-down ml-1" style={{ fontSize: '0.8rem' }}></i>
                                </Link>
                                {productCategories.length > 0 && (
                                    <div className="dropdown-menu-wine">
                                        <Link to="/shop" className="dropdown-item-wine">Tất cả sản phẩm</Link>
                                        {productCategories.map(cat => (
                                            <Link key={cat.id} to={`/shop?category=${cat.id}`} className="dropdown-item-wine">
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="nav-item-dropdown">
                                <Link to="/blog" className={`nav-link-wine ${location.pathname.startsWith('/blog') ? 'active' : ''}`}>
                                    Tin Tức <i className="fa-solid fa-angle-down ml-1" style={{ fontSize: '0.8rem' }}></i>
                                </Link>
                                {blogCategories.length > 0 && (
                                    <div className="dropdown-menu-wine">
                                        <Link to="/blog" className="dropdown-item-wine">Tất cả bài viết</Link>
                                        {blogCategories.map(cat => (
                                            <Link key={cat.id} to={`/blog?category=${cat.id}`} className="dropdown-item-wine">
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </nav>

                        {/* Right Side */}
                        <div className="d-flex align-items-center" style={{ gap: '15px' }}>
                            {/* Search Form - Desktop */}
                            <form onSubmit={handleSearch} className="d-none d-lg-flex position-relative align-items-center" style={{ width: '220px' }}>
                                <input 
                                    type="text" 
                                    placeholder="Tìm kiếm..." 
                                    className="form-wine" 
                                    style={{ padding: '6px 35px 6px 15px', height: '38px', borderRadius: '20px', fontSize: '0.85rem' }}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" style={{ background: 'none', border: 'none', position: 'absolute', right: '10px', color: 'var(--wine-gold)', cursor: 'pointer' }}>
                                    <i className="fa-solid fa-search"></i>
                                </button>
                            </form>

                            {/* Cart */}
                            <div className="position-relative mini-cart-trigger">
                                <Link to="/cart" className="btn p-2 position-relative" style={{ color: 'var(--wine-charcoal)', fontSize: '1.2rem' }}>
                                    <i className="fa-solid fa-bag-shopping"></i>
                                    {getCartCount() > 0 && (
                                        <span className="cart-badge">{getCartCount()}</span>
                                    )}
                                </Link>

                                {/* Mini Cart Dropdown */}
                                {cartItems.length > 0 && (
                                    <div className="mini-cart-dropdown d-none d-lg-block">
                                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
                                            <strong style={{ fontSize: '0.9rem' }}>Giỏ hàng ({getCartCount()} sản phẩm)</strong>
                                        </div>
                                        <div style={{ maxHeight: '250px', overflowY: 'auto', padding: '12px 20px' }}>
                                            {cartItems.slice(0, 3).map(item => (
                                                <div key={item.id} className="d-flex align-items-center mb-3" style={{ gap: '12px' }}>
                                                    <div style={{ width: '50px', height: '60px', background: 'var(--surface-light)', borderRadius: '6px', padding: '4px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <img src={item.imageUrl || 'https://placehold.co/50x60'} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--wine-burgundy)', fontWeight: 600 }}>{item.quantity} × {formatCurrency(item.price)}</div>
                                                    </div>
                                                    <button onClick={(e) => { e.preventDefault(); removeFromCart(item.id); }} className="cart-remove-btn" style={{ width: '28px', height: '28px', fontSize: '0.7rem' }}>
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </button>
                                                </div>
                                            ))}
                                            {cartItems.length > 3 && (
                                                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                                    +{cartItems.length - 3} sản phẩm khác
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-light)', background: 'var(--surface-light)' }}>
                                            <div className="d-flex justify-content-between mb-3">
                                                <span style={{ fontWeight: 600 }}>Tổng cộng:</span>
                                                <span style={{ fontWeight: 700, color: 'var(--wine-burgundy)', fontFamily: "'Playfair Display', serif" }}>{formatCurrency(getCartTotal())}</span>
                                            </div>
                                            <div className="d-flex" style={{ gap: '8px' }}>
                                                <Link to="/cart" className="btn btn-outline-gold btn-sm flex-fill" style={{ fontSize: '0.82rem', padding: '8px' }}>Xem giỏ hàng</Link>
                                                <Link to="/checkout" className="btn btn-gold btn-sm flex-fill" style={{ fontSize: '0.82rem', padding: '8px' }}>Thanh toán</Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Account */}
                            <div className="nav-item-dropdown d-none d-lg-flex">
                                {isAuthenticated ? (
                                    <>
                                        <div className="btn p-2" style={{ color: 'var(--wine-charcoal)', cursor: 'pointer' }}>
                                            <i className="fa-regular fa-user mr-2"></i>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.fullName?.split(' ')[user?.fullName?.split(' ').length - 1] || 'Tài khoản'}</span>
                                        </div>
                                        <div className="dropdown-menu-wine" style={{ width: '200px', left: 'auto', right: 0 }}>
                                            <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--surface-light)' }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.fullName}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                                            </div>
                                            <Link to="/profile" className="dropdown-item-wine"><i className="fa-regular fa-circle-user mr-2"></i>Thông tin tài khoản</Link>
                                            <Link to="/profile" className="dropdown-item-wine"><i className="fa-solid fa-box mr-2"></i>Đơn hàng của tôi</Link>
                                            <button onClick={logout} className="dropdown-item-wine w-100 text-left" style={{ background: 'none', border: 'none', borderLeft: '3px solid transparent', color: '#E74C3C', cursor: 'pointer' }}>
                                                <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>Đăng xuất
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <Link to="/login" className="btn btn-gold btn-sm ml-2" style={{ padding: '8px 20px' }}>
                                        <i className="fa-regular fa-user mr-2"></i>Đăng Nhập
                                    </Link>
                                )}
                            </div>

                            {/* Mobile Toggle */}
                            <button className="btn d-lg-none p-2" onClick={() => setMobileOpen(!mobileOpen)} style={{ fontSize: '1.3rem', color: 'var(--wine-charcoal)' }}>
                                <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileOpen && (
                        <div className="d-lg-none pb-3 animate-fadeInUp" style={{ borderTop: '1px solid var(--border-light)' }}>
                            <Link to="/" className="d-block py-3 px-2 text-decoration-none" style={{ color: location.pathname === '/' ? 'var(--wine-burgundy)' : 'var(--text-primary)', borderBottom: '1px solid var(--border-light)' }}>
                                <i className="fa-solid fa-house mr-2" style={{ color: 'var(--wine-gold)', width: '20px' }}></i> Trang Chủ
                            </Link>
                            <Link to="/shop" className="d-block py-3 px-2 text-decoration-none" style={{ color: location.pathname.startsWith('/shop') ? 'var(--wine-burgundy)' : 'var(--text-primary)', borderBottom: '1px solid var(--border-light)' }}>
                                <i className="fa-solid fa-store mr-2" style={{ color: 'var(--wine-gold)', width: '20px' }}></i> Cửa Hàng
                            </Link>
                            <div style={{ paddingLeft: '30px', borderBottom: '1px solid var(--border-light)' }}>
                                {productCategories.map(cat => (
                                    <Link key={cat.id} to={`/shop?category=${cat.id}`} className="d-block py-2 text-decoration-none" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        - {cat.name}
                                    </Link>
                                ))}
                            </div>
                            <Link to="/blog" className="d-block py-3 px-2 text-decoration-none" style={{ color: location.pathname.startsWith('/blog') ? 'var(--wine-burgundy)' : 'var(--text-primary)', borderBottom: '1px solid var(--border-light)' }}>
                                <i className="fa-solid fa-newspaper mr-2" style={{ color: 'var(--wine-gold)', width: '20px' }}></i> Tin Tức
                            </Link>
                            <div style={{ paddingLeft: '30px', borderBottom: '1px solid var(--border-light)' }}>
                                {blogCategories.map(cat => (
                                    <Link key={cat.id} to={`/blog?category=${cat.id}`} className="d-block py-2 text-decoration-none" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        - {cat.name}
                                    </Link>
                                ))}
                            </div>
                            
                            {/* Mobile Auth */}
                            <div style={{ padding: '20px 10px', borderBottom: '1px solid var(--border-light)' }}>
                                {isAuthenticated ? (
                                    <>
                                        <div style={{ marginBottom: '10px', fontWeight: 600 }}>Xin chào, {user?.fullName}</div>
                                        <Link to="/profile" className="btn btn-outline-gold btn-sm w-100 mb-2">Đơn hàng của tôi</Link>
                                        <button onClick={logout} className="btn btn-outline-danger btn-sm w-100">Đăng Xuất</button>
                                    </>
                                ) : (
                                    <div className="d-flex" style={{ gap: '10px' }}>
                                        <Link to="/login" className="btn btn-outline-gold btn-sm flex-fill">Đăng Nhập</Link>
                                        <Link to="/register" className="btn btn-gold btn-sm flex-fill">Đăng Ký</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;
