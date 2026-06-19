import React, { useEffect, useState } from 'react';
import productService from '../../services/productService';
import categoryProductService from '../../services/categoryProductService';
import blogService from '../../services/blogService';

import HeroBanner from './HeroBanner';
import CategoryMenu from './CategoryMenu';
import ProductGrid from './ProductGrid';
import SeasonalBanner from './SeasonalBanner';
import TasteSelection from './TasteSelection';
import WhyChooseUs from './WhyChooseUs';
import LatestBlog from './LatestBlog';

const Home = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [hotTrends, setHotTrends] = useState([]);
    const [summerWines, setSummerWines] = useState([]);
    const [sweetWines, setSweetWines] = useState([]);
    const [boldWines, setBoldWines] = useState([]);

    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoading(true);
                const [productsData, catData, postsData] = await Promise.allSettled([
                    productService.getAllProducts(),
                    categoryProductService.getAllCategoryProducts(),
                    blogService.getAllPosts()
                ]);

                if (productsData.status === 'fulfilled') {
                    const allProducts = productsData.value;
                    
                    setBestSellers(allProducts.slice(0, 4));
                    setHotTrends(allProducts.slice(4, 8).length > 0 ? allProducts.slice(4, 8) : allProducts.slice(0, 4));

                    const summer = allProducts.filter(p => {
                        const cat = (p.categoryProduct?.name || '').toLowerCase();
                        return cat.includes('trắng') || cat.includes('sủi') || cat.includes('champagne');
                    });
                    setSummerWines(summer.length > 0 ? summer.slice(0, 4) : allProducts.slice(0, 4));

                    const sweet = allProducts.filter(p => {
                        const cat = (p.categoryProduct?.name || '').toLowerCase();
                        return cat.includes('ngọt');
                    });
                    setSweetWines(sweet.length > 0 ? sweet.slice(0, 4) : allProducts.slice(0, 4));

                    const bold = allProducts.filter(p => {
                        const cat = (p.categoryProduct?.name || '').toLowerCase();
                        return cat.includes('đỏ');
                    });
                    setBoldWines(bold.length > 0 ? bold.slice(0, 4) : allProducts.slice(0, 4));
                }

                if (catData.status === 'fulfilled') setCategories(catData.value);
                if (postsData.status === 'fulfilled') setPosts(postsData.value.slice(0, 3));
            } catch (error) {
                console.error("Lỗi tải dữ liệu trang chủ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    const features = [
        { icon: 'fa-certificate', title: 'Chính Hãng 100%', desc: 'Cam kết rượu nhập khẩu chính hãng có giấy tờ đầy đủ' },
        { icon: 'fa-truck-fast', title: 'Giao Hàng Nhanh', desc: 'Giao hàng hỏa tốc 2h trong nội thành TP.HCM' },
        { icon: 'fa-tags', title: 'Giá Tốt Nhất', desc: 'Giá cạnh tranh nhất thị trường, cam kết hoàn tiền chênh lệch' },
        { icon: 'fa-headset', title: 'Tư Vấn 24/7', desc: 'Đội ngũ Sommelier chuyên nghiệp sẵn sàng hỗ trợ bạn' },
    ];

    return (
        <div className="home-page">
            <HeroBanner />
            <CategoryMenu categories={categories} />
            <ProductGrid 
                id="best-seller"
                title="Best Sellers"
                badge={<><i className="fa-solid fa-crown mr-2"></i> Khách Hàng Yêu Thích</>}
                products={bestSellers}
                loading={loading}
                showTopBadge={true}
            />
            <SeasonalBanner products={summerWines} loading={loading} />
            <TasteSelection sweetWines={sweetWines} boldWines={boldWines} />
            <ProductGrid 
                id="hot-trends"
                title="Xu Hướng Hiện Nay (Hot Trends)"
                subtitle="Những dòng vang đang làm mưa làm gió trong cộng đồng yêu rượu"
                products={hotTrends}
                loading={loading}
            />
            <WhyChooseUs features={features} />
            <LatestBlog posts={posts} />
        </div>
    );
};

export default Home;
