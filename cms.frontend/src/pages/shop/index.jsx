import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import productService from '../../services/productService';
import categoryProductService from '../../services/categoryProductService';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';

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

                // Dynamically update max price range
                if (winesData.length > 0) {
                    const maxP = Math.max(...winesData.map(w => w.price || 0));
                    setPriceRange([0, maxP]);
                }

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
                    <ShopSidebar 
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        categories={categories}
                        selectedCat={selectedCat}
                        handleFilterCategory={handleFilterCategory}
                        allWines={allWines}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        maxPrice={maxPrice}
                    />

                    {/* ========= MAIN CONTENT ========= */}
                    <div className="col-lg-9">
                        {/* Toolbar */}
                        <ShopHeader 
                            filteredWinesLength={filteredWines.length}
                            selectedCat={selectedCat}
                            categories={categories}
                            setSelectedCat={setSelectedCat}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                        />

                        {/* Products Grid */}
                        <ProductList 
                            loading={loading}
                            filteredWines={filteredWines}
                            setSelectedCat={setSelectedCat}
                            setSearchTerm={setSearchTerm}
                            setPriceRange={setPriceRange}
                            maxPrice={maxPrice}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
