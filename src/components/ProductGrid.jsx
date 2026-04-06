import { Heart, Plus } from 'lucide-react';

export default function ProductGrid({ title, products, isAdmin }) {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddProduct = async () => {
    const name = prompt("Name:"); if (!name) return;
    const price = prompt("Price (UGX):", "0");
    const url = await pickAndUploadImage(); if (!url) return;
    await supabase.from('products').insert([{ name, price: Number(price), image: url }]);
    window.location.reload();
  };

  const handleQuickSwap = async (e, item) => {
    e.stopPropagation();
    const url = await pickAndUploadImage();
    if (url) {
       await supabase.from('products').update({ image: url }).eq('id', item.id);
       window.location.reload(); 
    }
 };

  return (
    <section className="products-section">
      <div className="section-header">
        <h3 className="section-title">{title}</h3>
        {isAdmin && <button className="in-app-add-btn" onClick={handleAddProduct}><Plus size={16}/> New Product</button>}
      </div>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)} style={{ cursor: 'pointer' }}>
            <div className="product-image-container">
              <img src={product.image} alt={product.name} className="product-image" />
              {isAdmin && <button className="quick-edit-img-btn" onClick={(e) => handleQuickSwap(e, product)}>📸 Change</button>}
              {product.badge && <span className="product-discount">{product.badge}</span>}
              <div className="product-wishlist" onClick={(e) => e.stopPropagation()}>
                <Heart size={16} />
              </div>
            </div>
            <div className="product-info">
              <h4 className="product-name">{product.name}</h4>
              <div className="product-price-row">
                <span className="product-price">Ugshs {Number(product.price).toLocaleString()}</span>
              </div>
              <div className="product-actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn-add-cart" onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}>
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
}
