import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import ProductCard from '../components/ProductCard';

const Shop = () => {
    const [wines, setWines] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCat, setSelectedCat] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [winesData, catData] = await Promise.all([
                    productService.getAllProducts(),
                    categoryService.getAllCategories()
                ]);
                setWines(winesData);
                setCategories(catData);
            } catch (error) {
                console.error("Lỗi tải trang shop:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleFilterCategory = async (catId) => {
        setSelectedCat(catId);
        try {
            setLoading(true);
            if (catId) {
                const data = await productService.getProductsByCategory(catId);
                setWines(data);
            } else {
                const data = await productService.getAllProducts();
                setWines(data);
            }
        } catch (error) {
            console.error("Lỗi filter:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 bg-light-wine">
            <h2 className="text-dark font-weight-bold font-serif text-uppercase mb-4 border-bottom pb-3">
                Cửa hàng Rượu Ngoại
            </h2>
            
            <div className="row">
                {/* Sidebar Filter */}
                <div className="col-md-3 mb-4">
                    <div className="card bg-white border-0 shadow-sm mb-4 rounded">
                        <div className="card-header bg-white border-bottom text-dark font-weight-bold text-uppercase py-3">
                            <i className="fa-solid fa-filter text-gold mr-2"></i> Danh mục sản phẩm
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className={`list-group-item bg-transparent cursor-pointer border-0 py-3 ${selectedCat === null ? 'font-weight-bold text-burgundy' : 'text-dark'}`} 
                                onClick={() => handleFilterCategory(null)}
                                style={{cursor: 'pointer'}}
                            >
                                <i className="fa-solid fa-caret-right mr-2 text-gold"></i> Tất cả sản phẩm
                            </li>
                            {categories.map(cat => (
                                <li className={`list-group-item bg-transparent cursor-pointer border-0 py-3 ${selectedCat === cat.id ? 'font-weight-bold text-burgundy' : 'text-dark'}`} 
                                    key={cat.id} 
                                    onClick={() => handleFilterCategory(cat.id)}
                                    style={{cursor: 'pointer'}}
                                >
                                    <i className="fa-solid fa-caret-right mr-2 text-gold"></i> {cat.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="card bg-white border-0 shadow-sm rounded">
                        <div className="card-body text-center p-4">
                            <i className="fa-solid fa-headset text-gold fa-3x mb-3"></i>
                            <h6 className="text-dark font-weight-bold">Hỗ trợ khách hàng</h6>
                            <p className="text-muted small">Cần tư vấn chọn vang? Vui lòng gọi ngay.</p>
                            <h5 className="text-burgundy font-weight-bold">1900 8888</h5>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-md-9">
                    {loading ? (
                        <div className="text-center py-5 my-5">
                            <div className="spinner-border text-gold" style={{width: '3rem', height: '3rem'}} role="status"></div>
                            <p className="mt-3 text-muted font-weight-bold">Đang tải sản phẩm...</p>
                        </div>
                    ) : (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm">
                                <span className="text-muted font-weight-bold">Hiển thị {wines.length} sản phẩm</span>
                                <select className="form-select bg-light text-dark border-0 rounded" style={{width: 'auto'}}>
                                    <option>Sắp xếp: Mặc định</option>
                                    <option>Giá: Tăng dần</option>
                                    <option>Giá: Giảm dần</option>
                                </select>
                            </div>

                            {wines.length === 0 ? (
                                <div className="alert bg-white shadow-sm text-center py-5 rounded border-0">
                                    <i className="fa-solid fa-wine-bottle fa-3x text-muted mb-3"></i>
                                    <h5 className="text-dark">Không tìm thấy sản phẩm nào trong danh mục này.</h5>
                                </div>
                            ) : (
                                <div className="row">
                                    {wines.map(wine => (
                                        <div className="col-md-4 mb-4" key={wine.id}>
                                            <ProductCard product={wine} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
