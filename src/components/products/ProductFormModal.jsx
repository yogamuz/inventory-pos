// src/components/products/ProductFormModal.jsx
import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProductFormModal({ isOpen, onClose, onSubmit, product, loading }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || "",
        isActive: product.isActive !== false,
      });
      setImagePreview(product.imageUrl || null);
    } else {
      setFormData({
        name: "",
        price: "",
        stock: "",
        isActive: true,
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (product) {
      // Mode Edit: tidak kirim stock
      const { stock, ...updateData } = formData;
      onSubmit(updateData, imageFile);
    } else {
      onSubmit(formData, imageFile);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop Blur Overlay */}
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal Container */}
        <div className="relative inline-block w-full max-w-lg">
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl transform transition-all text-left overflow-hidden">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product ? "Edit Produk" : "Tambah Produk"}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="bg-white px-6 py-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Produk
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-20 w-20 rounded-lg object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <div className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Upload Gambar
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Produk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Masukkan nama produk"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Masukkan harga"
                  />
                </div>

                {/* Stock - REVISI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stok
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    disabled={!!product} // Disable ketika edit mode
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Masukkan jumlah stok"
                  />
                  {product && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate("/stocks");
                      }}
                      className="mt-1 text-sm text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      Ingin ubah stock?
                    </button>
                  )}
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Produk Aktif
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Menyimpan..." : product ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFormModal;
