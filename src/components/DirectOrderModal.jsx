import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle2, Phone } from 'lucide-react';

export default function DirectOrderModal({ isOpen, onClose, product = null }) {
  if (!isOpen || !product) return null;

  return <DirectOrderModalDialog onClose={onClose} product={product} />;
}

function DirectOrderModalDialog({ onClose, product }) {
  const [quantity, setQuantity] = useState(1);
  const [paymentMode, setPaymentMode] = useState('COD'); // 'COD' | 'UPI' | 'NEFT' | 'B2B'
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    orgName: '',
    cityArea: 'Silchar (Main City)',
    address: '',
    gstin: '',
    notes: ''
  });

  const unitPrice = product.price || 0;
  const totalPrice = unitPrice * quantity;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.phone.trim()) {
      alert('Please provide your Full Name and Contact Phone / WhatsApp Number.');
      return;
    }

    const generatedOrderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(generatedOrderId);

    // Format WhatsApp message for instant direct checkout
    const msg = 
      `*🛒 DIRECT HARDWARE PURCHASE ORDER - M/S COMPUTER PLANET*%0A%0A` +
      `📦 *Order Ref:* ${generatedOrderId}%0A` +
      `🖥️ *Product:* ${encodeURIComponent(product.name)}%0A` +
      `🔢 *Quantity:* ${quantity} unit(s)%0A` +
      `💰 *Total Amount:* ₹${totalPrice.toLocaleString('en-IN')}%0A` +
      `💳 *Payment Choice:* ${paymentMode}%0A%0A` +
      `👤 *Customer Name:* ${encodeURIComponent(formData.customerName)}%0A` +
      `📞 *Phone:* ${encodeURIComponent(formData.phone)}%0A` +
      (formData.orgName ? `🏢 *Firm / Office:* ${encodeURIComponent(formData.orgName)}%0A` : '') +
      (formData.gstin ? `🧾 *GSTIN for Tax Invoice:* ${encodeURIComponent(formData.gstin)}%0A` : '') +
      `📍 *Delivery City / Area:* ${encodeURIComponent(formData.cityArea)}%0A` +
      `🏠 *Delivery Address:* ${encodeURIComponent(formData.address || 'Silchar delivery')}%0A` +
      (formData.notes ? `📝 *Notes:* ${encodeURIComponent(formData.notes)}%0A` : '') +
      `%0A_Sent via www.mscomputerplanet.com Direct Store_`;

    // Open WhatsApp order desk
    window.open(`https://wa.me/918638083712?text=${msg}`, '_blank');
    setOrderSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {orderSubmitted ? (
          /* Order Confirmation Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Order Received! #{orderId}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Your direct hardware order for <strong className="text-slate-900 dark:text-white">{product.name}</strong> (Qty: {quantity}) has been forwarded to our Silchar Order Desk.
            </p>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-left space-y-2 max-w-md mx-auto">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Order Reference:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{orderId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Total payable:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Delivery:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">24-48 Hours in Silchar & Cachar</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="tel:+918638083712"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Sales Desk: +91 86380 83712</span>
              </a>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
              >
                Done / Back to Website
              </button>
            </div>
          </div>
        ) : (
          /* Order Form Screen */
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Direct Hardware Checkout</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
              Direct Order & Purchase
            </h2>

            {/* Selected Product Summary Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3.5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{product.name}</h4>
                  <span className="inline-block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {product.stock || 'In Stock'} • {product.warranty || 'OEM Warranty'}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-base font-mono">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.mrp && (
                      <span className="text-xs text-slate-400 line-through font-mono">
                        ₹{product.mrp.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
                <span className="text-xs text-slate-500 font-semibold px-1">Qty:</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center hover:bg-slate-200"
                >
                  -
                </button>
                <span className="w-6 text-center font-mono font-bold text-xs text-slate-900 dark:text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center hover:bg-slate-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Debashis Roy"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp Phone * <span className="text-[10px] text-slate-400 font-normal">(For Order Alerts)</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 94350 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company / Firm Name <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PNB Silchar / Saha Traders"
                    value={formData.orgName}
                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Delivery District / City *
                  </label>
                  <select
                    value={formData.cityArea}
                    onChange={(e) => setFormData({ ...formData, cityArea: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Silchar (Main City)">Silchar (Main City & Outskirts)</option>
                    <option value="Cachar District">Cachar District (Lakhipur / Sonai)</option>
                    <option value="Karimganj District">Karimganj District</option>
                    <option value="Hailakandi District">Hailakandi District</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House No / Shop No, Road Name, Silchar"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Payment Mode Choice */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Preferred Payment Choice *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when delivered' },
                    { id: 'UPI', label: 'UPI / GPay / PhonePe', desc: 'Instant QR code' },
                    { id: 'NEFT', label: 'Bank Transfer / NEFT', desc: 'Company Bank Acc' },
                    { id: 'B2B', label: 'GST Tax Invoice', desc: 'Input Tax Credit' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPaymentMode(mode.id)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        paymentMode === mode.id
                          ? 'bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white ring-1 ring-emerald-500'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{mode.label}</div>
                      <div className="text-[10px] text-slate-400">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMode === 'B2B' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    GSTIN Number (For B2B Tax Invoice)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 18AABCM1234A1Z5"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              )}

              {/* Total Summary Footer */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-lg">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Payable</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Confirm & Place Order</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
