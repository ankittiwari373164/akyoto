'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Package, ShoppingCart, Users, TrendingUp, Plus, Edit, Trash2, X, Image as ImageIcon, Shield, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecking, setAuthChecking] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: 'Alarm System',
    stock: '',
    sku: '',
    image_url: '',
    weight: '1 Unit',
    min_order_qty: '1',
    specifications: {} as Record<string, string>,
  })
  const [specKey, setSpecKey] = useState('')
  const [specValue, setSpecValue] = useState('')

  useEffect(() => {
    checkAdmin()
  }, [])

  // ─── AUTH: Check logged in + is_admin flag ───────────────────────────
  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Check is_admin in user_profiles table
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (error || !profile?.is_admin) {
        setAccessDenied(true)
        setAuthChecking(false)
        return
      }

      setAdminEmail(user.email || '')
      setAuthChecking(false)
      fetchData()
    } catch {
      setAccessDenied(true)
      setAuthChecking(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // ─── DATA ────────────────────────────────────────────────────────────
  const fetchData = async () => {
    try {
      const [productsData, ordersData, quotesData] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('quote_requests').select('*').order('created_at', { ascending: false }),
      ])
      setProducts(productsData.data || [])
      setOrders(ordersData.data || [])
      setQuotes(quotesData.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // ─── IMAGE UPLOAD ────────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image size should be less than 5MB'); return }
    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `products/${fileName}`
      const { error } = await supabase.storage.from('products').upload(filePath, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath)
      setProductForm(prev => ({ ...prev, image_url: publicUrl }))
      setImagePreview(publicUrl)
      toast.success('Image uploaded successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = () => {
    setProductForm(prev => ({ ...prev, image_url: '' }))
    setImagePreview('')
  }

  // ─── SPECIFICATIONS ──────────────────────────────────────────────────
  const addSpecification = () => {
    if (specKey && specValue) {
      setProductForm({ ...productForm, specifications: { ...productForm.specifications, [specKey]: specValue } })
      setSpecKey(''); setSpecValue('')
    }
  }

  const removeSpecification = (key: string) => {
    const newSpecs = { ...productForm.specifications }
    delete newSpecs[key]
    setProductForm({ ...productForm, specifications: newSpecs })
  }

  // ─── PRODUCT CRUD ────────────────────────────────────────────────────
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const productData = {
        name: productForm.name, slug: productForm.slug, description: productForm.description,
        price: parseFloat(productForm.price), category: productForm.category,
        stock: parseInt(productForm.stock), sku: productForm.sku,
        image_url: productForm.image_url, weight: productForm.weight,
        min_order_qty: parseInt(productForm.min_order_qty), specifications: productForm.specifications,
      }
      if (editingProduct) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id)
        if (error) throw error
        toast.success('Product updated successfully!')
      } else {
        const { error } = await supabase.from('products').insert(productData)
        if (error) throw error
        toast.success('Product created successfully!')
      }
      setShowProductForm(false); setEditingProduct(null); setImagePreview(''); resetProductForm(); fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const resetProductForm = () => {
    setProductForm({ name: '', slug: '', description: '', price: '', category: 'Alarm System', stock: '', sku: '', image_url: '', weight: '1 Unit', min_order_qty: '1', specifications: {} })
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      toast.success('Product deleted successfully!'); fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product')
    }
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name, slug: product.slug, description: product.description,
      price: product.price.toString(), category: product.category, stock: product.stock.toString(),
      sku: product.sku, image_url: product.image_url || '', weight: product.weight || '1 Unit',
      min_order_qty: (product.min_order_qty || 1).toString(), specifications: product.specifications || {},
    })
    setImagePreview(product.image_url || ''); setShowProductForm(true)
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
      if (error) throw error
      toast.success('Order status updated!'); fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order')
    }
  }

  const updateQuoteStatus = async (quoteId: string, status: string) => {
    try {
      const { error } = await supabase.from('quote_requests').update({ status }).eq('id', quoteId)
      if (error) throw error
      toast.success('Quote status updated!'); fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update quote')
    }
  }

  const stats = [
    { icon: Package, label: 'Total Products', value: products.length, color: 'text-blue-600' },
    { icon: ShoppingCart, label: 'Total Orders', value: orders.length, color: 'text-green-600' },
    { icon: TrendingUp, label: 'Revenue', value: `₹${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}`, color: 'text-purple-600' },
    { icon: Users, label: 'Quote Requests', value: quotes.length, color: 'text-orange-600' },
  ]

  // ─── LOADING STATE ───────────────────────────────────────────────────
  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm">Verifying access...</p>
        </div>
      </div>
    )
  }

  // ─── ACCESS DENIED STATE ─────────────────────────────────────────────
  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-slate-100"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Shield size={36} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            Access Denied
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            You don't have admin privileges. Contact the super admin to get access.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/')}
              className="btn-outline py-2.5 px-6 text-sm"
            >
              Go Home
            </button>
            <button
              onClick={handleLogout}
              className="btn-primary py-2.5 px-6 text-sm"
            >
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── MAIN DASHBOARD ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Logged in as <span className="font-semibold text-primary-600">{adminEmail}</span></p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 px-4 py-2 rounded-lg transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <stat.icon className={`${stat.color} mb-3`} size={32} />
              <h3 className="text-sm text-gray-600 mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex border-b">
            {['products', 'orders', 'quotes'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 font-semibold capitalize ${activeTab === tab ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600' : 'text-gray-600'}`}
              >
                {tab === 'quotes' ? 'Quote Requests' : tab}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ── PRODUCTS TAB ── */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Products Management</h2>
                  <button onClick={() => { setShowProductForm(!showProductForm); setEditingProduct(null); setImagePreview(''); resetProductForm() }} className="btn-primary flex items-center gap-2">
                    <Plus size={20} /> Add Product
                  </button>
                </div>

                {showProductForm && (
                  <form onSubmit={handleProductSubmit} className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4">{editingProduct ? 'Edit' : 'Add'} Product</h3>

                    {/* Image Upload */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold mb-2">Product Image</label>
                      {imagePreview || productForm.image_url ? (
                        <div className="relative inline-block">
                          <Image src={imagePreview || productForm.image_url} alt="Product preview" width={200} height={200} className="rounded-lg object-cover" />
                          <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"><X size={16} /></button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" disabled={uploadingImage} />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <ImageIcon className="mx-auto text-gray-400 mb-2" size={40} />
                            <p className="text-gray-600 mb-1">{uploadingImage ? 'Uploading...' : 'Click to upload product image'}</p>
                            <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div><label className="block text-sm font-semibold mb-2">Product Name *</label><input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required className="input-field" /></div>
                      <div><label className="block text-sm font-semibold mb-2">Slug *</label><input type="text" value={productForm.slug} onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })} required className="input-field" placeholder="product-slug" /></div>
                      <div><label className="block text-sm font-semibold mb-2">Price *</label><input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required className="input-field" /></div>
                      <div><label className="block text-sm font-semibold mb-2">Stock *</label><input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required className="input-field" /></div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Category *</label>
                        <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="input-field">
                          <option>Alarm System</option>
                          <option>Fire Alarm System</option>
                          <option>Wireless Sensors</option>
                          <option>Guard Monitoring Solution</option>
                          <option>Alarm Siren</option>
                          <option>CCTV</option>
                          <option>Access Control</option>
                          <option>Door Bell</option>
                          <option>Networking</option>
                        </select>
                      </div>
                      <div><label className="block text-sm font-semibold mb-2">SKU *</label><input type="text" value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} required className="input-field" /></div>
                      <div><label className="block text-sm font-semibold mb-2">Weight</label><input type="text" value={productForm.weight} onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })} className="input-field" placeholder="1 Unit, 100g, etc." /></div>
                      <div><label className="block text-sm font-semibold mb-2">Min Order Qty *</label><input type="number" value={productForm.min_order_qty} onChange={(e) => setProductForm({ ...productForm, min_order_qty: e.target.value })} required className="input-field" /></div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2">Description</label>
                      <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={3} className="input-field" />
                    </div>

                    {/* Specifications */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2">Specifications</label>
                      <div className="flex gap-2 mb-2">
                        <input type="text" value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="Key (e.g., GSM)" className="input-field flex-1" />
                        <input type="text" value={specValue} onChange={(e) => setSpecValue(e.target.value)} placeholder="Value (e.g., YES)" className="input-field flex-1" />
                        <button type="button" onClick={addSpecification} className="btn-secondary px-4">Add</button>
                      </div>
                      {Object.entries(productForm.specifications).length > 0 && (
                        <div className="bg-white rounded-lg p-4 space-y-2">
                          {Object.entries(productForm.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center border-b pb-2">
                              <span><strong>{key}:</strong> {value}</span>
                              <button type="button" onClick={() => removeSpecification(key)} className="text-red-500 hover:text-red-700"><X size={16} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <button type="submit" className="btn-primary" disabled={uploadingImage}>{editingProduct ? 'Update' : 'Create'} Product</button>
                      <button type="button" onClick={() => { setShowProductForm(false); setEditingProduct(null); setImagePreview('') }} className="btn-outline">Cancel</button>
                    </div>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left">Image</th>
                        <th className="px-4 py-3 text-left">Product</th>
                        <th className="px-4 py-3 text-left">Category</th>
                        <th className="px-4 py-3 text-left">Price</th>
                        <th className="px-4 py-3 text-left">Stock</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            {product.image_url && <Image src={product.image_url} alt={product.name} width={50} height={50} className="rounded object-cover" />}
                          </td>
                          <td className="px-4 py-3"><div className="font-semibold">{product.name}</div><div className="text-sm text-gray-600">{product.sku}</div></td>
                          <td className="px-4 py-3">{product.category}</td>
                          <td className="px-4 py-3">₹{product.price.toLocaleString()}</td>
                          <td className="px-4 py-3">{product.stock}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── ORDERS TAB ── */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Orders Management</h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-semibold">Order #{order.id.substring(0, 8)}</p>
                          <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString()}</p>
                          <p className="text-sm text-gray-600 mt-2">{order.shipping_address?.fullName} - {order.shipping_address?.phone}</p>
                        </div>
                        <p className="font-bold text-lg">₹{order.total.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Order Status</label>
                        <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="input-field w-full md:w-auto">
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-center text-gray-500 py-8">No orders yet.</p>}
                </div>
              </div>
            )}

            {/* ── QUOTES TAB ── */}
            {activeTab === 'quotes' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Quote Requests</h2>
                <div className="space-y-4">
                  {quotes.map((quote) => (
                    <div key={quote.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-semibold">{quote.name}</p>
                          <p className="text-sm text-gray-600">{quote.email} - {quote.phone}</p>
                          {quote.company_name && <p className="text-sm text-gray-600">{quote.company_name}</p>}
                          <p className="text-sm text-gray-600 mt-2">{new Date(quote.created_at).toLocaleString()}</p>
                        </div>
                        <select value={quote.status} onChange={(e) => updateQuoteStatus(quote.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : quote.status === 'quoted' ? 'bg-blue-100 text-blue-800' : quote.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="quoted">Quoted</option>
                          <option value="accepted">Accepted</option>
                          <option value="declined">Declined</option>
                        </select>
                      </div>
                      {quote.message && <div className="bg-gray-50 rounded p-3 mb-3"><p className="text-sm"><strong>Message:</strong> {quote.message}</p></div>}
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm font-semibold mb-2">Products:</p>
                        <pre className="text-xs overflow-auto">{JSON.stringify(quote.products, null, 2)}</pre>
                      </div>
                    </div>
                  ))}
                  {quotes.length === 0 && <p className="text-center text-gray-500 py-8">No quote requests yet.</p>}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}