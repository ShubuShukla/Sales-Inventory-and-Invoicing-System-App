import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    stock: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white shadow-lg rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-blue-700 text-center mb-4">
          ➕ Add Product
        </h2>

        <form className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600">Product Name</label>
            <Input
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Stock Quantity</label>
            <Input
              name="stock"
              value={product.stock}
              onChange={handleChange}
              placeholder="e.g. 100"
              type="number"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Price (₹)</label>
            <Input
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="e.g. 50"
              type="number"
              className="mt-1"
            />
          </div>

          <div className="flex justify-between mt-6">
            <Button
              type="button"
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
