"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Upload,
  ChevronDown,
  Menu,
  X,
  ArrowLeft,
  Settings as SettingsIcon,
  LogOut,
  ShoppingBag
} from 'lucide-react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { getAllProducts, Product } from '@/lib/products';
import { AdminLayout } from '@/components/admin/admin-layout';
import { useAuth } from '@/contexts/auth-context';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const itemsPerPage = 10;

  const { user, signOut } = useAuth();
  const currentPath = '/admin/products';

  const menuItems = [
    { href: '/admin/products', label: 'Products', icon: ShoppingBag },
    { href: '/admin/settings', label: 'Settings', icon: SettingsIcon },
  ];

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        setProducts(Array.isArray(allProducts) ? allProducts : []);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  // Scroll to top smoothly on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // lock scroll when confirmation modal open
  useEffect(() => {
    if (productToDelete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [productToDelete]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Handle product editing
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  // Handle product saving
  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    alert('Product updated successfully!');
  };

  // Handle product deletion request (opens confirmation modal)
  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      alert('Product deleted successfully!');
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setProductToDelete(null);
  };

  // Handle adding new product
  const handleAddProduct = (newProduct: Product) => {
    const maxId = Math.max(...products.map(p => p.id), 0);
    const productWithId = { ...newProduct, id: maxId + 1 };
    setProducts([...products, productWithId]);
    setShowAddModal(false);
    alert('Product added successfully!');
  };

  return (
    <AdminLayout currentPath="/admin/products">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Menu size={20} className="text-gray-300" />
          </button>

          {/* Logo */}
          <button onClick={() => window.location.reload()} className="flex items-center space-x-2">
            <Image src="/wig.png" alt="Logo" width={32} height={32} className="h-8 w-auto object-contain" />
            <span className="text-white font-semibold text-lg">Wigga</span>
          </button>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">

            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <img src="/avatar_default.png" alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                <ChevronDown size={16} className="text-gray-300" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-gray-600 font-medium truncate">{user?.email || 'No email'}</p>
                  </div>
                  <Link
                    href="/admin/settings"
                    className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <SettingsIcon size={16} className="mr-3" />
                    <span>Account Settings</span>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      signOut();
                      setProfileDropdownOpen(false);
                    }}
                  >
                    <LogOut size={16} className="mr-3" />
                    <span>Log out</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Side Menu */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${
        menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        ></div>
        <div className="absolute left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <Link href="/admin/products" className="flex items-center space-x-2">
              <Image src="/wig.png" alt="Logo" width={32} height={32} className="h-8 w-auto object-contain" />
              <span className="text-white font-semibold text-lg">Wigga</span>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X size={20} className="text-gray-300" />
            </button>
          </div>

          <nav className="p-4">
            {/* Back to Store Button */}
            <Link
              href="/"
              className="flex items-center p-3 mb-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors group"
              onClick={() => setMenuOpen(false)}
            >
              <ArrowLeft size={20} className="min-w-[20px]" />
              <span className="ml-3 font-medium">Back to Store</span>
            </Link>
            
            {menuItems.map((item, index) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center p-3 mb-2 rounded-lg transition-colors group ${
                    isActive
                      ? 'bg-slate-600 text-white'
                      : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <item.icon size={20} className={`min-w-[20px] ${isActive ? 'text-white' : ''}`} />
                  <span className="ml-3 font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-2 p-0 pb-20">
        {/* Page Header */}
        <div className="mb-8 pt-4">
          <h1 className="text-3xl font-semibold text-white mb-2 pt-8">Products Management</h1>
          <p className="text-gray-400">Manage your product catalog - add, edit, and remove products</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mb-7"
          >
            <Plus size={16} className="mr-2" />
            Add Product
          </button>

          {/* Top Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 flex-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
              >
                Prev
              </button>

              {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={`top-${pageNumber}`}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
                {product.badge && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    {product.badge}
                  </span>
                )}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product)}
                    className="p-2 bg-red-500/50 hover:bg-red-500/70 text-white rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-400 font-bold">{product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products found matching your search.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
              >
                Prev
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onSave={handleAddProduct}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!productToDelete}
        title="Delete Product"
        message={
          <>
            <p>Are you sure you want to delete this product?</p>
            <p className="mt-2 text-red-400">
              This product will be lost forever, you know? Yes or no, you understand?
            </p>
          </>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </AdminLayout>
  );
};



// Edit Product Modal Component
const EditProductModal = ({
  product,
  onSave,
  onClose
}: {
  product: Product;
  onSave: (product: Product) => void;
  onClose: () => void;
}) => {
  // initialise state from product
  const [editedProduct, setEditedProduct] = useState<Product>({ ...product });
  const [mainImage, setMainImage] = useState<string>(product.image || '');
  const [thumbnailImages, setThumbnailImages] = useState<string[]>([
    ...(product.images || []).slice(0, 4),
    '',
    '',
    '',
    ''
  ].slice(0, 4));

  // same configuration arrays as add modal
  const colors = [
    '#8B4513', // brown
    '#000000', // black
    '#FFFFFF', // white
    '#FFC0CB', // pink
    '#0000FF', // blue
    '#FFFF00', // yellow
    '#4B0082', // indigo
    '#00FFFF'  // cyan
  ];
  const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);

  const colorRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  // make sure first thumbnail mirrors main image on mount
  useEffect(() => {
    if (mainImage) {
      const newThumbs = [...thumbnailImages];
      newThumbs[0] = mainImage;
      setThumbnailImages(newThumbs);
      setEditedProduct(prev => ({
        ...prev,
        images: [mainImage, ...(prev.images || []).slice(1)]
      }));
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isColorDropdownOpen &&
        colorRef.current &&
        !colorRef.current.contains(event.target as Node)
      ) {
        setIsColorDropdownOpen(false);
      }
      if (
        isSizeDropdownOpen &&
        sizeRef.current &&
        !sizeRef.current.contains(event.target as Node)
      ) {
        setIsSizeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isColorDropdownOpen, isSizeDropdownOpen]);

  // image handlers copy from add modal but update editedProduct
  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setMainImage(imageUrl);
      setEditedProduct({ ...editedProduct, image: imageUrl });

      // always keep the first thumbnail in sync with whatever the main image is
      const newThumbs = [...thumbnailImages];
      newThumbs[0] = imageUrl;
      setThumbnailImages(newThumbs);

      const newImages = [...(editedProduct.images || [])];
      newImages[0] = imageUrl;
      setEditedProduct({ ...editedProduct, images: newImages });
    }
  };

  const handleThumbnailUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newThumbnails = [...thumbnailImages];
      newThumbnails[index] = imageUrl;
      setThumbnailImages(newThumbnails);

      const newImages = [...(editedProduct.images || [])];
      newImages[index] = imageUrl;
      setEditedProduct({ ...editedProduct, images: newImages });
    }
  };

  const handleSave = () => {
    if (!editedProduct.name || !editedProduct.price) {
      alert('Please fill in at least the product name and price.');
      return;
    }
    onSave(editedProduct);
  };

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${
      isColorDropdownOpen || isSizeDropdownOpen ? 'z-[60]' : 'z-50'
    } flex items-center justify-center p-4`} onClick={onClose}>
      <div
        className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Edit Product</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Image Upload Section */}
          <div className={isColorDropdownOpen || isSizeDropdownOpen ? 'filter blur-sm' : ''}>
            <label className="block text-gray-300 text-sm font-medium mb-4">
              Product Images
            </label>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-400 text-xs mb-2">Main Image</label>
                <div className="relative">
                  <div className="w-full h-64 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt="Main product"
                        className="w-full h-full object-cover rounded-lg"
                        onError={() => setMainImage('')}
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto text-gray-400" size={24} />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="w-20 flex flex-col gap-2">
                <label className="block text-gray-400 text-xs mb-2">
                  Thumbnails (4)
                </label>
                <div className="flex-1 space-y-2">
                  {thumbnailImages.map((thumbnail, index) => (
                    <div key={index} className="relative flex-1">
                      <div className="w-full h-15 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                            onError={() => {
                              const newThumbs = [...thumbnailImages];
                              newThumbs[index] = '';
                              setThumbnailImages(newThumbs);
                            }}
                          />
                        ) : (
                          <div className="text-center">
                            <Upload className="mx-auto text-gray-400" size={12} />
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleThumbnailUpload(index, event)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  Upload up to 4 additional images
                </p>
              </div>
            </div>
          </div>

          {/* Product fields (name, price, etc.) */}
          <div className={isColorDropdownOpen || isSizeDropdownOpen ? 'filter blur-sm' : ''}>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={editedProduct.name}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter product name"
            />
          </div>

          <div className={isColorDropdownOpen || isSizeDropdownOpen ? 'filter blur-sm' : ''}>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Price (₦) *
            </label>
            <input
              type="text"
              value={editedProduct.price.replace('₦', '').replace(/,/g, '')}
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  price: `₦${parseInt(e.target.value || '0').toLocaleString()}`
                })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter price"
            />
          </div>

          <div className={isColorDropdownOpen || isSizeDropdownOpen ? 'filter blur-sm' : ''}>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={editedProduct.description}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter product description"
            />
          </div>

          {/* color and size blocks same as add modal */}
          {!isSizeDropdownOpen && (
            <div ref={colorRef}>
              <label className="block text-gray-300 text-sm font-medium mb-2">Color</label>
              <div className={`relative ${isColorDropdownOpen ? 'mb-20' : ''}`}>
              <button
                type="button"
                onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 flex items-center justify-between"
              >
                {(editedProduct.colors && editedProduct.colors.length > 0) ? (
                  <div className="flex gap-1 flex-wrap">
                    {editedProduct.colors.map((color, index) => (
                      <div key={index} className="w-4 h-4 rounded-full border border-gray-400" style={{backgroundColor: color}}></div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">Select Color</span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isColorDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isColorDropdownOpen && (
                <div className="absolute top-full mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg p-2 z-50">
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          (editedProduct.colors || []).includes(color)
                            ? 'border-cyan-400 shadow-lg shadow-cyan-400/50'
                            : 'border-gray-500 hover:border-white'
                        }`}
                        style={{backgroundColor: color}}
                        onClick={() => {
                          const currentColors = editedProduct.colors || [];
                          let newColors;
                          if (currentColors.includes(color)) {
                            newColors = currentColors.filter(c => c !== color);
                          } else {
                            newColors = [...currentColors, color];
                          }
                          setEditedProduct({ ...editedProduct, colors: newColors });
                        }}
                      ></button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-transparent border border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white rounded-lg transition-colors"
                      onClick={() => setEditedProduct({ ...editedProduct, colors: [] })}
                    >
                      Reset Colors
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      onClick={() => setIsColorDropdownOpen(false)}
                    >
                      Save Colors
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}

          <div ref={sizeRef} className={`${isColorDropdownOpen ? 'mt-10 filter blur-sm' : ''} ${isSizeDropdownOpen ? 'mb-20' : ''}`}>
            <label className="block text-gray-300 text-sm font-medium mb-2">Sizes</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 flex items-center justify-between"
              >
                {(editedProduct.sizes && editedProduct.sizes.length > 0) ? (
                  <span>{editedProduct.sizes.join(', ')}</span>
                ) : (
                  <span className="text-gray-400">Select Sizes</span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isSizeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSizeDropdownOpen && (
                <div className="absolute top-full mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg p-2 z-50">
                  <div className="grid grid-cols-4 gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          (editedProduct.sizes || []).includes(size)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-600 hover:bg-gray-500 text-white'
                        }`}
                        onClick={() => {
                          const currentSizes = editedProduct.sizes || [];
                          let newSizes;
                          if (currentSizes.includes(size)) {
                            newSizes = currentSizes.filter(s => s !== size);
                          } else {
                            newSizes = [...currentSizes, size];
                          }
                          setEditedProduct({ ...editedProduct, sizes: newSizes });
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-transparent border border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white rounded-lg transition-colors"
                      onClick={() => setEditedProduct({ ...editedProduct, sizes: [] })}
                    >
                      Reset Sizes
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      onClick={() => setIsSizeDropdownOpen(false)}
                    >
                      Save Sizes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={`${isColorDropdownOpen || isSizeDropdownOpen ? 'filter blur-sm' : ''} ${isSizeDropdownOpen ? 'mb-20' : ''}`}>
            <label className="block text-gray-300 text-sm font-medium mb-2">Badge (Optional)</label>
            <input
              type="text"
              value={editedProduct.badge}
              onChange={(e) => setEditedProduct({ ...editedProduct, badge: e.target.value })}
              placeholder="e.g., New Arrival, Special Offer"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {!isColorDropdownOpen && !isSizeDropdownOpen && (
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add Product Modal Component
const AddProductModal = ({
  onSave,
  onClose
}: {
  onSave: (product: Product) => void;
  onClose: () => void;
}) => {
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: '₦0',
    originalPrice: '₦0',
    rating: 4.5,
    reviews: 0,
    image: '/wig21.jpeg',
    images: ['/wig21.jpeg'],
    description: '',
    features: [],
    colors: [], // start empty so placeholder appears
    sizes: [],
    inStock: true,
    badge: '',
    category: ''
  });

  const [mainImage, setMainImage] = useState<string>('');
  const [thumbnailImages, setThumbnailImages] = useState<string[]>(['', '', '', '']);

  // Color options for the dropdown
  const colors = [
    '#8B4513', // brown
    '#000000', // black
    '#FFFFFF', // white
    '#FFC0CB', // pink
    '#0000FF', // blue
    '#FFFF00', // yellow
    '#4B0082', // indigo
    '#00FFFF'  // cyan
  ];

  // Size options for the dropdown
  const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);

  const colorRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  // if the main image has already been set, push it into the first thumbnail slot
  useEffect(() => {
    if (mainImage) {
      const newThumbs = [...thumbnailImages];
      newThumbs[0] = mainImage;
      setThumbnailImages(newThumbs);
      setNewProduct(prev => ({
        ...prev,
        images: [mainImage, ...(prev.images || []).slice(1)]
      }));
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isColorDropdownOpen &&
        colorRef.current &&
        !colorRef.current.contains(event.target as Node)
      ) {
        setIsColorDropdownOpen(false);
      }
      if (
        isSizeDropdownOpen &&
        sizeRef.current &&
        !sizeRef.current.contains(event.target as Node)
      ) {
        setIsSizeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isColorDropdownOpen, isSizeDropdownOpen]);

  // Handle main image upload
  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setMainImage(imageUrl);
      setNewProduct({ ...newProduct, image: imageUrl });

      // sync the first thumbnail with the main image as well
      const newThumbs = [...thumbnailImages];
      newThumbs[0] = imageUrl;
      setThumbnailImages(newThumbs);

      const newImages = [...(newProduct.images || [])];
      newImages[0] = imageUrl;
      setNewProduct({ ...newProduct, images: newImages });
    }
  };

  // Handle thumbnail image upload
  const handleThumbnailUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newThumbnails = [...thumbnailImages];
      newThumbnails[index] = imageUrl;
      setThumbnailImages(newThumbnails);

      // Update the product images array
      const newImages = [...(newProduct.images || [])];
      newImages[index] = imageUrl;
      setNewProduct({ ...newProduct, images: newImages });
    }
  };

  const handleSave = () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Please fill in at least the product name and price.');
      return;
    }

    onSave(newProduct as Product);
  };

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${isColorDropdownOpen || isSizeDropdownOpen ? 'z-[60]' : 'z-50'} flex items-center justify-center p-4`} onClick={onClose}>
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Add New Product</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Image Upload Section */}
          <div className={isColorDropdownOpen || isSizeDropdownOpen ? "filter blur-sm" : ""}>
            <label className="block text-gray-300 text-sm font-medium mb-4">Product Images</label>

            {/* Mobile: Main image with thumbnails stacked vertically on the right */}
            <div className="flex gap-4">
              {/* Main Image */}
              <div className="flex-1">
                <label className="block text-gray-400 text-xs mb-2">Main Image</label>
                <div className="relative">
                  <div className="w-full h-64 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt="Main product"
                        className="w-full h-full object-cover rounded-lg"
                        onError={() => setMainImage('')}
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto text-gray-400" size={24} />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Thumbnail Images - Full height on the right */}
              <div className="w-20 flex flex-col gap-2">
                <label className="block text-gray-400 text-xs mb-2">Thumbnails (4)</label>
                <div className="flex-1 space-y-2">
                  {thumbnailImages.map((thumbnail, index) => (
                    <div key={index} className="relative flex-1">
                      <div className="w-full h-15 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                            onError={() => {
                              const newThumbs = [...thumbnailImages];
                              newThumbs[index] = '';
                              setThumbnailImages(newThumbs);
                            }}
                          />
                        ) : (
                          <div className="text-center">
                            <Upload className="mx-auto text-gray-400" size={12} />
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleThumbnailUpload(index, event)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-1">Upload up to 4 additional images</p>
              </div>
            </div>
          </div>

          <div className={isColorDropdownOpen || isSizeDropdownOpen ? "filter blur-sm" : ""}>
            <label className="block text-gray-300 text-sm font-medium mb-2">Product Name *</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter product name"
            />
          </div>

          <div className={isColorDropdownOpen || isSizeDropdownOpen ? "filter blur-sm" : ""}>
            <label className="block text-gray-300 text-sm font-medium mb-2">Price (₦) *</label>
            <input
              type="text"
              value={newProduct.price?.replace('₦', '').replace(/,/g, '') || ''}
              onChange={(e) => setNewProduct({
                ...newProduct,
                price: `₦${parseInt(e.target.value || '0').toLocaleString()}`
              })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter price"
            />
          </div>

          <div className={isColorDropdownOpen || isSizeDropdownOpen ? "filter blur-sm" : ""}>
            <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter product description"
            />
          </div>

          {!isSizeDropdownOpen && (
            <div ref={colorRef}>
              <label className="block text-gray-300 text-sm font-medium mb-2">Color</label>
              <div className={`relative ${isColorDropdownOpen ? 'mb-20' : ''}`}>
                <button
                  type="button"
                  onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 flex items-center justify-between"
              >
                {(newProduct.colors && newProduct.colors.length > 0) ? (
                  <div className="flex gap-1 flex-wrap">
                    {newProduct.colors.map((color, index) => (
                      <div key={index} className="w-4 h-4 rounded-full border border-gray-400" style={{backgroundColor: color}}></div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">Select Color</span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isColorDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isColorDropdownOpen && (
                <div className="absolute top-full mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg p-2 z-50">
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          (newProduct.colors || []).includes(color)
                            ? 'border-cyan-400 shadow-lg shadow-cyan-400/50'
                            : 'border-gray-500 hover:border-white'
                        }`}
                        style={{backgroundColor: color}}
                        onClick={() => {
                          const currentColors = newProduct.colors || [];
                          let newColors;
                          if (currentColors.includes(color)) {
                            newColors = currentColors.filter(c => c !== color);
                          } else {
                            newColors = [...currentColors, color];
                          }
                          setNewProduct({ ...newProduct, colors: newColors });
                        }}
                      ></button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-transparent border border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white rounded-lg transition-colors"
                      onClick={() => setNewProduct({ ...newProduct, colors: [] })}
                    >
                      Reset Colors
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      onClick={() => setIsColorDropdownOpen(false)}
                    >
                      Save Colors
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}

          <div ref={sizeRef} className={(isColorDropdownOpen ? 'mt-10 filter blur-sm ' : '') + (isSizeDropdownOpen ? 'mb-20' : '')}>
            <label className="block text-gray-300 text-sm font-medium mb-2">Sizes</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 flex items-center justify-between"
              >
                {(newProduct.sizes && newProduct.sizes.length > 0) ? (
                  <span>{newProduct.sizes.join(', ')}</span>
                ) : (
                  <span className="text-gray-400">Select Sizes</span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isSizeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSizeDropdownOpen && (
                <div className="absolute top-full mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg p-2 z-50">
                  <div className="grid grid-cols-4 gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          (newProduct.sizes || []).includes(size)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-600 hover:bg-gray-500 text-white'
                        }`}
                        onClick={() => {
                          const currentSizes = newProduct.sizes || [];
                          let newSizes;
                          if (currentSizes.includes(size)) {
                            newSizes = currentSizes.filter(s => s !== size);
                          } else {
                            newSizes = [...currentSizes, size];
                          }
                          setNewProduct({ ...newProduct, sizes: newSizes });
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-transparent border border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white rounded-lg transition-colors"
                      onClick={() => setNewProduct({ ...newProduct, sizes: [] })}
                    >
                      Reset Sizes
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      onClick={() => setIsSizeDropdownOpen(false)}
                    >
                      Save Sizes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={`${isColorDropdownOpen || isSizeDropdownOpen ? "filter blur-sm" : ""} ${isSizeDropdownOpen ? "mb-20" : ""}`}>
            <label className="block text-gray-300 text-sm font-medium mb-2">Badge (Optional)</label>
            <input
              type="text"
              value={newProduct.badge}
              onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
              placeholder="e.g., New Arrival, Special Offer"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {!isColorDropdownOpen && !isSizeDropdownOpen && (
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
