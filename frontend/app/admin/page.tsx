"use client";
import { useState } from "react";

export default function AdminPage() {
  const [formData, setFormData] = useState({
    brand: "",
    name: "",
    category: "Foundation",
    product_type: "Liquid",
    buy_link: "",
    shade_name: "",
    shade_hex: "#F5F5DC", // Beige default
    undertone: "warm",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Adding product...");

    const payload = {
      brand: formData.brand,
      name: formData.name,
      category: formData.category,
      product_type: formData.product_type,
      buy_link: formData.buy_link,
      shades: [
        {
          shade_name: formData.shade_name,
          shade_hex: formData.shade_hex,
          lab_l: 0,
          lab_a: 0,
          lab_b: 0,
          undertone: formData.undertone,
        },
      ],
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage("✅ Product added to Railway database!");
      } else {
        setMessage("❌ Error adding product. Check backend console.");
      }
    } catch (error) {
      setMessage("❌ Could not connect to backend.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-pink-300">
        
        {/* Heading text is now Dark Pink */}
        <h1 className="text-2xl font-bold mb-4 text-pink-700">Admin: Add Product</h1>
        
        {message && <p className="mb-4 text-center font-semibold text-pink-600">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Brand" required 
            className="w-full p-2 border border-pink-300 rounded text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400" 
            onChange={(e) => setFormData({...formData, brand: e.target.value})} />
          
          <input type="text" placeholder="Product Name" required 
            className="w-full p-2 border border-pink-300 rounded text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} />

          <select className="w-full p-2 border border-pink-300 rounded text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400" 
            onChange={(e) => setFormData({...formData, category: e.target.value})}>
            <option value="Foundation">Foundation</option>
            <option value="Concealer">Concealer</option>
            <option value="Lipstick">Lipstick</option>
            <option value="Blush">Blush</option>
          </select>

          <input type="text" placeholder="Shade Name (e.g. 220 Natural Beige)" required 
            className="w-full p-2 border border-pink-300 rounded text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400" 
            onChange={(e) => setFormData({...formData, shade_name: e.target.value})} />

          <div className="flex items-center gap-2">
            <label className="text-pink-700 font-medium">Shade Color:</label>
            <input type="color" value={formData.shade_hex} 
              className="cursor-pointer rounded border border-pink-300"
              onChange={(e) => setFormData({...formData, shade_hex: e.target.value})} />
            <span className="text-pink-700 font-medium">{formData.shade_hex}</span>
          </div>

          <input type="text" placeholder="Buy Link (https://...)" 
            className="w-full p-2 border border-pink-300 rounded text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400" 
            onChange={(e) => setFormData({...formData, buy_link: e.target.value})} />

          <button type="submit" 
            className="w-full bg-[#FFD1DC] text-pink-800 p-2 rounded hover:bg-[#FFB6C1] transition-colors font-semibold shadow-sm">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}