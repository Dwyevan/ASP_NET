import React from 'react';

const WhyChooseUs = ({ features }) => {
    return (
        <section style={{ padding: '80px 0', background: 'var(--wine-dark)', color: '#fff' }}>
            <div className="container">
                <div className="row">
                    {features.map((f, idx) => (
                        <div className="col-lg-3 col-md-6 mb-4 mb-lg-0 text-center" key={idx}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wine-gold)', fontSize: '1.5rem', margin: '0 auto 20px' }}>
                                <i className={`fa-solid ${f.icon}`}></i>
                            </div>
                            <h5 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '10px' }}>{f.title}</h5>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: 0, opacity: 0.8 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
