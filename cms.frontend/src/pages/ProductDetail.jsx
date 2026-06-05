import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../services/productService';
import { formatCurrency } from '../utils/formatters';
import { useCart } from '../components/CartProvider';

const ProductDetail = () => {
    const { id } = useParams();
    const [wine, setWine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchWine = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                setWine(data);
            } catch (error) {
                console.error("Lỗi tải chi tiết rượu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWine();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(wine, quantity);
        alert(`Đã thêm ${quantity} chai ${wine.name} vào giỏ hàng!`);
    };

    if (loading) return (
        <div className="text-center py-5 my-5">
            <div className="spinner-border text-gold" style={{width: '3rem', height: '3rem'}}></div>
        </div>
    );

    if (!wine) return (
        <div className="container py-5 text-center">
            <h3 className="text-danger">Không tìm thấy thông tin sản phẩm.</h3>
            <Link to="/shop" className="btn btn-outline-gold mt-3 rounded-pill">Quay lại cửa hàng</Link>
        </div>
    );

    return (
        <div className="container py-5 bg-light-wine">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent px-0 border-bottom pb-3">
                    <li className="breadcrumb-item"><Link to="/" className="text-muted text-decoration-none">Trang chủ</Link></li>
                    <li className="breadcrumb-item"><Link to="/shop" className="text-muted text-decoration-none">Cửa hàng</Link></li>
                    <li className="breadcrumb-item active text-dark font-weight-bold" aria-current="page">{wine.name}</li>
                </ol>
            </nav>

            <div className="row mt-4">
                <div className="col-md-5 mb-4 text-center bg-white rounded shadow-sm p-4 d-flex align-items-center justify-content-center" style={{minHeight: '500px'}}>
                    <img 
                        src={wine.imageUrl || 'https://placehold.co/300x500?text=Premium+Wine'} 
                        alt={wine.name} 
                        className="img-fluid"
                        style={{maxHeight: '450px', objectFit: 'contain'}}
                        onError={(e) => { e.target.src = 'https://placehold.co/300x500?text=Premium+Wine'; }}
                    />
                </div>
                
                <div className="col-md-7 pl-md-5">
                    <span className="badge bg-gold text-white px-3 py-1 mb-3 rounded-pill">HÀNG MỚI VỀ</span>
                    <h2 className="text-dark font-weight-bold mb-3 font-serif">{wine.name}</h2>
                    <h3 className="text-burgundy font-weight-bold mb-4 border-bottom pb-3">
                        {formatCurrency(wine.price)}
                    </h3>

                    <p className="text-muted mb-4" style={{lineHeight: '1.8'}}>{wine.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}</p>

                    <div className="row mb-4 text-dark small bg-white p-3 rounded shadow-sm">
                        <div className="col-6 mb-3"><i className="fa-solid fa-wine-glass text-gold mr-2"></i> <strong className="text-muted">Danh mục:</strong> <br/> {wine.categoryProduct ? wine.categoryProduct.name : 'Vang'}</div>
                        <div className="col-6 mb-3"><i className="fa-solid fa-layer-group text-gold mr-2"></i> <strong className="text-muted">Tồn kho:</strong> <br/> {wine.stockQuantity} chai</div>
                        <div className="col-6 mb-3"><i className="fa-solid fa-earth-americas text-gold mr-2"></i> <strong className="text-muted">Xuất xứ:</strong> <br/> Pháp</div>
                        <div className="col-6 mb-3"><i className="fa-solid fa-droplet text-gold mr-2"></i> <strong className="text-muted">Dung tích:</strong> <br/> 750ml</div>
                    </div>

                    {wine.stockQuantity > 0 ? (
                        <div className="bg-white p-4 rounded mt-4 shadow-sm">
                            <div className="d-flex align-items-center mb-3">
                                <label className="text-dark mr-3 mb-0 font-weight-bold">Số lượng:</label>
                                <input 
                                    type="number" 
                                    className="form-control bg-light text-dark text-center rounded-pill" 
                                    value={quantity} 
                                    onChange={(e) => setQuantity(Math.max(1, Math.min(wine.stockQuantity, parseInt(e.target.value) || 1)))}
                                    style={{width: '100px'}}
                                    min="1"
                                    max={wine.stockQuantity}
                                />
                            </div>
                            <button className="btn btn-gold btn-lg w-100 text-uppercase font-weight-bold rounded-pill shadow-sm mt-2" onClick={handleAddToCart}>
                                <i className="fa-solid fa-cart-arrow-down mr-2"></i> Thêm Vào Giỏ Hàng
                            </button>
                        </div>
                    ) : (
                        <div className="alert alert-danger mt-4 font-weight-bold text-center rounded">
                            SẢN PHẨM HIỆN ĐANG HẾT HÀNG
                        </div>
                    )}

                    <div className="mt-4 pt-3 border-top text-muted small d-flex justify-content-between">
                        <span><i className="fa-solid fa-truck text-gold mr-2"></i> Giao hàng hỏa tốc 2h</span>
                        <span><i className="fa-solid fa-shield-halved text-gold mr-2"></i> Cam kết chính hãng 100%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
