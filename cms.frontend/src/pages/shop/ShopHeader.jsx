import React from 'react';

const ShopHeader = ({ filteredWinesLength, selectedCat, categories, setSelectedCat, sortBy, setSortBy }) => {
    return (
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 p-3" style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Hiển thị <strong style={{ color: 'var(--text-primary)' }}>{filteredWinesLength}</strong> sản phẩm
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
    );
};

export default ShopHeader;
