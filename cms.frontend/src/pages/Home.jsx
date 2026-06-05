import React, { useEffect, useState } from 'react';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const Home = () => {
    const [featuredWines, setFeaturedWines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setFeaturedWines(data.slice(0, 4));
            } catch (error) {
                console.error("Lỗi tải rượu trang chủ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    return (
        <div className="home-page bg-light-wine">
            {/* Hero Banner Light */}
            <div className="position-relative text-dark text-center d-flex align-items-center justify-content-center" style={{ minHeight: '650px', backgroundImage: 'url(https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
                <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.65)' }}></div>
                <div className="position-relative z-index-1 p-5 bg-white shadow-lg rounded" style={{ maxWidth: '800px', backgroundColor: 'rgba(255,255,255,0.9) !important' }}>
                    <h1 className="display-4 font-weight-bold text-burgundy mb-4 font-serif">Tinh Hoa Rượu Vang</h1>
                    <p className="lead mb-5 text-dark" style={{ lineHeight: '1.8' }}>
                        Khám phá bộ sưu tập những chai vang tuyệt hảo từ các nhà làm vang danh tiếng nhất thế giới. Trải nghiệm hương vị đẳng cấp và phong cách sống thanh lịch.
                    </p>
                    <Link to="/shop" className="btn btn-gold btn-lg px-5 py-3 text-uppercase font-weight-bold rounded-pill shadow">Khám Phá Cửa Hàng</Link>
                </div>
            </div>

            {/* Featured Section */}
            <div className="container py-5 my-5">
                <div className="text-center mb-5">
                    <h2 className="text-dark text-uppercase font-weight-bold font-serif">Bộ Sưu Tập Nổi Bật</h2>
                    <div className="mx-auto bg-gold mt-3" style={{ width: '60px', height: '3px', backgroundColor: 'var(--wine-gold)' }}></div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-gold" role="status"></div>
                    </div>
                ) : (
                    <div className="row">
                        {featuredWines.map(wine => (
                            <div className="col-md-3 mb-4" key={wine.id}>
                                <ProductCard product={wine} />
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="text-center mt-5">
                    <Link to="/shop" className="btn btn-outline-gold px-5 py-2 rounded-pill font-weight-bold">Xem Tất Cả Sản Phẩm</Link>
                </div>
            </div>
            
            {/* Story Section */}
            <div className="bg-white py-5 border-top border-bottom">
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-4 mb-md-0">
                            <img src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Vineyard" className="img-fluid rounded shadow-sm" />
                        </div>
                        <div className="col-md-6 pl-md-5">
                            <h3 className="text-burgundy mb-4 font-weight-bold font-serif">Câu Chuyện Của Chúng Tôi</h3>
                            <p className="text-muted" style={{ lineHeight: '1.8' }}>
                                Sự kết hợp hoàn hảo giữa truyền thống lâu đời và nghệ thuật thưởng thức hiện đại. Royal Wine Estate mang đến cho bạn những trải nghiệm vang đích thực nhất, được lựa chọn kỹ lưỡng bởi các chuyên gia (Sommelier) hàng đầu.
                            </p>
                            <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
                                Từ những vườn nho ngập nắng của Bordeaux cho đến những hầm rượu vang danh tiếng tại Tuscany. Mọi tinh hoa đều hội tụ tại đây.
                            </p>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Signature_of_author.svg" alt="Signature" style={{ width: '120px', filter: 'brightness(0.3)' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
