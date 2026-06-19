import React from 'react';

const ShopSidebar = ({ 
    searchTerm, 
    setSearchTerm, 
    categories, 
    selectedCat, 
    handleFilterCategory, 
    allWines, 
    priceRange, 
    setPriceRange, 
    maxPrice 
}) => {
    return (
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
    );
};

export default ShopSidebar;
