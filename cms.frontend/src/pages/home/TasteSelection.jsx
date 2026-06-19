import React from 'react';
import ProductCard from '../../components/ProductCard';

const TasteSelection = ({ sweetWines, boldWines }) => {
    return (
        <section style={{ padding: '80px 0', background: 'var(--wine-cream)' }}>
            <div className="container">
                <div className="section-header">
                    <h2>Lựa Chọn Theo Khẩu Vị</h2>
                    <div className="section-divider"></div>
                    <p className="subtitle">Mỗi người một gu thưởng thức. Hãy để chúng tôi tìm ra chai vang dành riêng cho bạn.</p>
                </div>

                <div className="row mb-5">
                    <div className="col-lg-6 mb-4">
                        <div className="taste-card" style={{ background: '#fff', padding: '40px', borderRadius: 'var(--radius-lg)', height: '100%', border: '1px solid var(--border-light)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '10rem', color: 'var(--wine-cream)', zIndex: 0 }}>
                                <i className="fa-solid fa-heart"></i>
                            </div>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h3 className="font-serif text-burgundy mb-3">Ngọt ngào, dễ uống</h3>
                                <p className="text-secondary mb-4">Lựa chọn lý tưởng cho phái nữ hoặc những người mới bắt đầu làm quen với rượu vang. Vị ngọt dịu, hương trái cây đậm đà không gắt cồn.</p>
                                <div className="row">
                                    {sweetWines.slice(0, 2).map(wine => (
                                        <div className="col-6" key={wine.id}>
                                            <ProductCard product={wine} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                        <div className="taste-card" style={{ background: '#fff', padding: '40px', borderRadius: 'var(--radius-lg)', height: '100%', border: '1px solid var(--border-light)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '10rem', color: 'var(--wine-cream)', zIndex: 0 }}>
                                <i className="fa-solid fa-wine-bottle"></i>
                            </div>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h3 className="font-serif text-burgundy mb-3">Đậm đà, cấu trúc chắc</h3>
                                <p className="text-secondary mb-4">Dành cho những quý ông sành sỏi. Hương gỗ sồi xen lẫn vị chát (tannin) mạnh mẽ, mang lại hậu vị kéo dài đầy ấn tượng.</p>
                                <div className="row">
                                    {boldWines.slice(0, 2).map(wine => (
                                        <div className="col-6" key={wine.id}>
                                            <ProductCard product={wine} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TasteSelection;
