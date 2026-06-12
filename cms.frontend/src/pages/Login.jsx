import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            if (result.isAdmin) {
                // Tạo một form ẩn để POST sang trang Login của Backend (MVC)
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = 'https://localhost:7250/Account/Login';

                const emailInput = document.createElement('input');
                emailInput.type = 'hidden';
                emailInput.name = 'email';
                emailInput.value = email;

                const passwordInput = document.createElement('input');
                passwordInput.type = 'hidden';
                passwordInput.name = 'password';
                passwordInput.value = password;

                form.appendChild(emailInput);
                form.appendChild(passwordInput);
                document.body.appendChild(form);
                form.submit();
            } else {
                navigate('/');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{ background: 'var(--wine-ivory)', minHeight: '80vh', display: 'flex', alignItems: 'center', padding: '50px 15px' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card border-0" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                            <div className="card-header border-0 text-center" style={{ background: 'linear-gradient(135deg, var(--wine-burgundy-deep), var(--wine-burgundy))', color: '#fff', padding: '30px' }}>
                                <i className="fa-solid fa-wine-glass-empty mb-3" style={{ fontSize: '2rem', color: 'var(--wine-gold)' }}></i>
                                <h3 className="font-serif mb-0">Đăng Nhập</h3>
                            </div>
                            <div className="card-body" style={{ padding: '40px 30px' }}>
                                {error && (
                                    <div className="alert alert-danger" style={{ fontSize: '0.9rem', borderRadius: 'var(--radius-sm)' }}>
                                        <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tài khoản / Email</label>
                                        <input 
                                            type="text" 
                                            className="form-wine w-100" 
                                            placeholder="Nhập tài khoản hoặc email..." 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-4">
                                        <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Mật khẩu</label>
                                        <input 
                                            type="password" 
                                            className="form-wine w-100" 
                                            placeholder="Nhập mật khẩu..." 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="btn btn-burgundy w-100" 
                                        disabled={loading}
                                    >
                                        {loading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
                                    </button>
                                </form>
                                <div className="text-center mt-4" style={{ fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Chưa có tài khoản?</span>{' '}
                                    <Link to="/register" style={{ color: 'var(--wine-burgundy)', fontWeight: 600, textDecoration: 'none' }}>Đăng ký ngay</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
