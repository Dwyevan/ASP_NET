import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]); // Ban đầu là danh sách rỗng
  const [loading, setLoading] = useState(true);

  // 1. Hàm gọi API từ Backend
  useEffect(() => {
    // Thay số '7xxx' bằng cổng (Port) mà Backend Duy đang chạy (VD: 7123 hoặc 5001)
    fetch('https://localhost:7xxx/api/categories') 
      .then(response => response.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Lỗi kết nối API:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App" style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
        <h1 style={{ color: '#007bff' }}>HỆ THỐNG CMS - DỮ LIỆU THẬT</h1>
        <p>Sinh viên thực hiện: <b>Hà Nhật Duy</b></p>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#333' }}>Danh mục sản phẩm từ Database</h2>
        
        {loading ? (
          <p>Đang tải dữ liệu từ SQL Server...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Tên Danh Mục</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Mô Tả</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{item.id}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.name}</td>
                    <td style={{ padding: '12px' }}>{item.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ padding: '20px' }}>Chưa có dữ liệu trong Database. Hãy thêm dữ liệu vào bảng CategoryProduct!</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default App;