import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundColor: '#f1f3f6' }}>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/:category/:slug" element={<ProductDetailPage />} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
              <h1 className="text-6xl font-black text-gray-200 mb-4">404</h1>
              <p className="text-gray-500 text-lg mb-6">Page not found</p>
              <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors">
                Go Home
              </a>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
