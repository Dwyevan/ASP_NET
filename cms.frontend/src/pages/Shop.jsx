import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import productService from '../services/productService';
import categoryProductService from '../services/categoryProductService';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';

const Shop = () => {
    const [allWines, setAllWines] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCat, setSelectedCat] = useState(null);
    const [sortBy, setSortBy] = useState('default');
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [winesData, catData] = await Promise.all([
                    productService.getAllProducts(),
                    categoryProductService.getAllCategoryProducts()
                ]);
                setAllWines(winesData);
                setCategories(catData);

                // Check URL params for category and search filter
                const catParam = searchParams.get('category');
                if (catParam) {
                    setSelectedCat(parseInt(catParam));
                }
                const qParam = searchParams.get('q');
                if (qParam) {
                    setSearchTerm(qParam);
                }
            } catch (error) {
                console.error("Lỗi tải trang shop:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [searchParams]);

    // Filter & sort with useMemo
    const filteredWines = useMemo(() => {
        let result = [...allWines];

        // Category filter
        if (selectedCat) {
            result = result.filter(w => w.categoryProduct?.id === selectedCat);
        }

        // Search filter
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(w =>
                w.name?.toLowerCase().includes(term) ||
                w.description?.toLowerCase().includes(term)
            );
        }

        // Price filter
        result = result.filter(w => w.price >= priceRange[0] && w.price <= priceRange[1]);

        // Sort
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
            case 'name-desc':
                result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
                break;
            default:
                break;
        }

        return result;
    }, [allWines, selectedCat, sortBy, searchTerm, priceRange]);

    const handleFilterCategory = (catId) => {
        setSelectedCat(catId);
    };

    const maxPrice = useMemo(() => {
        if (allWines.length === 0) return 10000000;
        return Math.max(...allWines.map(w => w.price || 0));
    }, [allWines]);

    return (
        <div>
            {/* Page Banner */}
            <div className="page-banner">
                <div className="container">
                    <h1 className="font-serif">Cửa Hàng Rượu Ngoại</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Cửa hàng</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container" style={{ padding: '50px 15px' }}>
                <div className="row">
                    {/* ========= SIDEBAR ========= */}
                    <div className="col-lg-3 mb-4 shop-sidebar">
                        {/* Search */}
                        <div className="card border-0 mb-4" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                            <div className="sidebar-heading">
                                <i className="fa-solid fa-search mr-2" style={{ color: 'var(--wine-gold)' }}></i>
                                Tìm kiếm
                            </div>
                            <div style={{ padding: '16px 20px' }}>
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-wine w-100"
                                        placeholder="Tìm rượu vang..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        style={{ paddingRight: '40px' }}
                                    />
                                    <i className="fa-solid fa-search position-absolute" style={{ right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="card border-0 mb-4" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                            <div className="sidebar-heading">
                                <i className="fa-solid fa-layer-group mr-2" style={{ color: 'var(--wine-gold)' }}></i>
                                Danh mục sản phẩm
                            </div>
                            <div
                                className={`sidebar-item ${selectedCat === null ? 'active' : ''}`}
                                onClick={() => handleFilterCategory(null)}
                            >
                                <i className="fa-solid fa-wine-bottle mr-2" style={{ color: 'var(--wine-gold)', width: '16px' }}></i>
                                Tất cả sản phẩm
                                <span className="float-right" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({allWines.length})</span>
                            </div>
                            {categories.map(cat => (
                                <div
                                    className={`sidebar-item ${selectedCat === cat.id ? 'active' : ''}`}
                                    key={cat.id}
                                    onClick={() => handleFilterCategory(cat.id)}
                                >
                                    <i className="fa-solid fa-wine-glass mr-2" style={{ color: 'var(--wine-gold)', width: '16px' }}></i>
                                    {cat.name}
                                    <span className="float-right" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        ({allWines.filter(w => w.categoryProduct?.id === cat.id).length})
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Price Range */}
                        <div className="card border-0 mb-4" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                            <div className="sidebar-heading">
                                <i className="fa-solid fa-sliders mr-2" style={{ color: 'var(--wine-gold)' }}></i>
                                Khoảng giá
                            </div>
                            <div className="price-range">
                                <input
                                    type="range"
                                    min="0"
                                    max={maxPrice}
                                    step="50000"
                                    value={priceRange[1]}
                                    onChange={e => setPriceRange([0, parseInt(e.target.value)])}
                                    style={{ width: '100%' }}
                                />
                                <div className="d-flex justify-content-between mt-2" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                    <span>0₫</span>
                                    <span style={{ fontWeight: 600, color: 'var(--wine-burgundy)' }}>
                                        {new Intl.NumberFormat('vi-VN').format(priceRange[1])}₫
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="card border-0" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'linear-gradient(135deg, var(--wine-burgundy-deep), var(--wine-burgundy))', color: '#fff' }}>
                            <div style={{ padding: '30px', textAlign: 'center' }}>
                                <i className="fa-solid fa-headset mb-3" style={{ fontSize: '2.2rem', color: 'var(--wine-gold)' }}></i>
                                <h6 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: '8px' }}>Cần tư vấn?</h6>
                                <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '15px' }}>Đội ngũ Sommelier sẵn sàng hỗ trợ bạn chọn vang phù hợp.</p>
                                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--wine-gold)', fontFamily: "'Playfair Display', serif" }}>
                                    <i className="fa-solid fa-phone mr-2"></i>1900 8888
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ========= MAIN CONTENT ========= */}
                    <div className="col-lg-9">
                        {/* Toolbar */}
                        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 p-3" style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Hiển thị <strong style={{ color: 'var(--text-primary)' }}>{filteredWines.length}</strong> sản phẩm
                                {selectedCat && categories.find(c => c.id === selectedCat) && (
                                    <span className="ml-2" style={{ background: 'rgba(107,29,42,0.08)', color: 'var(--wine-burgundy)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
                                        {categories.find(c => c.id === selectedCat).name}
                                        <button
                                            onClick={() => setSelectedCat(null)}
                                            style={{ background: 'none', border: 'none', marginLeft: '5px', cursor: 'pointer', color: 'var(--wine-burgundy)', fontWeight: 700 }}
                                        >×</button>
                                    </span>
                                )}
                            </span>
                            <select
                                className="form-wine"
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                style={{ width: 'auto', padding: '8px 16px', cursor: 'pointer' }}
                            >
                                <option value="default">Sắp xếp: Mặc định</option>
                                <option value="price-asc">Giá: Thấp đến cao</option>
                                <option value="price-desc">Giá: Cao đến thấp</option>
                                <option value="name-asc">Tên: A → Z</option>
                                <option value="name-desc">Tên: Z → A</option>
                            </select>
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="row">
                                {[...Array(6)].map((_, i) => (
                                    <div className="col-md-4 col-6 mb-4" key={i}>
                                        <ProductCardSkeleton />
                                    </div>
                                ))}
                            </div>
                        ) : filteredWines.length === 0 ? (
                            <div className="empty-state" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                                <div className="empty-state-icon">
                                    <i className="fa-solid fa-wine-bottle"></i>
                                </div>
                                <h4 style={{ color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>Không tìm thấy sản phẩm</h4>
                                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '10px auto 20px' }}>
                                    Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.
                                </p>
                                <button onClick={() => { setSelectedCat(null); setSearchTerm(''); setPriceRange([0, maxPrice]); }} className="btn btn-outline-gold">
                                    Xóa bộ lọc
                                </button>
                            </div>
                        ) : (
                            <div className="row">
                                {filteredWines.map(wine => (
                                    <div className="col-lg-4 col-md-6 col-6 mb-4" key={wine.id}>
                                        <ProductCard product={wine} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
