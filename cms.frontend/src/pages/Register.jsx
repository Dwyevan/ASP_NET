import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setLoading(true);

        const result = await register({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address
        });
        
        setLoading(false);

        if (result.success) {
            setSuccess('Đăng ký thành công! Đang chuyển hướng đến trang Đăng nhập...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{ background: 'var(--wine-ivory)', minHeight: '80vh', display: 'flex', alignItems: 'center', padding: '50px 15px' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-7">
                        <div className="card border-0" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                            <div className="card-header border-0 text-center" style={{ background: 'linear-gradient(135deg, var(--wine-burgundy-deep), var(--wine-burgundy))', color: '#fff', padding: '30px' }}>
                                <i className="fa-solid fa-user-plus mb-3" style={{ fontSize: '2rem', color: 'var(--wine-gold)' }}></i>
                                <h3 className="font-serif mb-0">Đăng Ký Tài Khoản</h3>
                            </div>
                            <div className="card-body" style={{ padding: '40px 30px' }}>
                                {error && (
                                    <div className="alert alert-danger" style={{ fontSize: '0.9rem', borderRadius: 'var(--radius-sm)' }}>
                                        <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="alert alert-success" style={{ fontSize: '0.9rem', borderRadius: 'var(--radius-sm)' }}>
                                        <i className="fa-solid fa-check-circle mr-2"></i> {success}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 form-group mb-3">
                                            <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Họ và tên *</label>
                                            <input 
                                                type="text" 
                                                name="fullName"
                                                className="form-wine w-100" 
                                                placeholder="Nguyễn Văn A" 
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 form-group mb-3">
                                            <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Số điện thoại</label>
                                            <input 
                                                type="text" 
                                                name="phone"
                                                className="form-wine w-100" 
                                                placeholder="09..." 
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group mb-3">
                                        <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tài khoản / Email *</label>
                                        <input 
                                            type="text" 
                                            name="email"
                                            className="form-wine w-100" 
                                            placeholder="Nhập tài khoản hoặc email..." 
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Địa chỉ</label>
                                        <input 
                                            type="text" 
                                            name="address"
                                            className="form-wine w-100" 
                                            placeholder="Địa chỉ giao hàng mặc định" 
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 form-group mb-4">
                                            <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Mật khẩu *</label>
                                            <input 
                                                type="password" 
                                                name="password"
                                                className="form-wine w-100" 
                                                placeholder="••••••••" 
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Xác nhận mật khẩu *</label>
                                            <input 
                                                type="password" 
                                                name="confirmPassword"
                                                className="form-wine w-100" 
                                                placeholder="••••••••" 
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-burgundy w-100" 
                                        disabled={loading || success}
                                    >
                                        {loading ? 'Đang xử lý...' : 'ĐĂNG KÝ'}
                                    </button>
                                </form>
                                <div className="text-center mt-4" style={{ fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Đã có tài khoản?</span>{' '}
                                    <Link to="/login" style={{ color: 'var(--wine-burgundy)', fontWeight: 600, textDecoration: 'none' }}>Đăng nhập ngay</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
