import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle2, Phone, SlidersHorizontal, Wrench } from 'lucide-react';

export default function DirectOrderModal({ isOpen, onClose, product = null }) {
  if (!isOpen || !product) return null;

  return <DirectOrderModalDialog onClose={onClose} product={product} />;
}

function DirectOrderModalDialog({ onClose, product }) {
  const [quantity, setQuantity] = useState(1);
  const [paymentMode, setPaymentMode] = useState('COD'); // 'COD' | 'UPI' | 'NEFT' | 'B2B'
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Customer Product Modification States
  const [ramUpgrade, setRamUpgrade] = useState('0');
  const [storageUpgrade, setStorageUpgrade] = useState('0');
  const [warrantyExt, setWarrantyExt] = useState('0');
  const [softwareOpt, setSoftwareOpt] = useState('0');
  const [customNotes, setCustomNotes] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    orgName: '',
    cityArea: 'Silchar (Main City)',
    address: '',
    gstin: ''
  });

  const RAM_PRICES = { '0': 0, '8gb': 2500, '16gb': 4800 };
  const STORAGE_PRICES = { '0': 0, '512ssd': 2900, '1tb-ssd': 4900 };
  const WARRANTY_PRICES = { '0': 0, '1yr': 1200, '2yr': 2500 };
  const SOFTWARE_PRICES = { '0': 0, 'win11pro': 1500, 'office': 3500, 'tally': 1800 };

  const modCost = (RAM_PRICES[ramUpgrade] || 0) + 
                  (STORAGE_PRICES[storageUpgrade] || 0) + 
                  (WARRANTY_PRICES[warrantyExt] || 0) + 
                  (SOFTWARE_PRICES[softwareOpt] || 0);

  const unitPrice = (product.price || 0) + modCost;
  const totalPrice = unitPrice * quantity;

  // Build formatted list of customer modifications
  const getSelectedModifications = () => {
    const list = [];
    if (ramUpgrade === '8gb') list.push('RAM: +8GB RAM (+₹2,500)');
    if (ramUpgrade === '16gb') list.push('RAM: +16GB RAM (+₹4,800)');
    if (storageUpgrade === '512ssd') list.push('Storage: +512GB NVMe SSD (+₹2,900)');
    if (storageUpgrade === '1tb-ssd') list.push('Storage: +1TB NVMe SSD (+₹4,900)');
    if (warrantyExt === '1yr') list.push('Warranty: +1 Year On-Site Cover (+₹1,200)');
    if (warrantyExt === '2yr') list.push('Warranty: +2 Years Full AMC Cover (+₹2,500)');
    if (softwareOpt === 'win11pro') list.push('Software: Win 11 Pro Genuine (+₹1,500)');
    if (softwareOpt === 'office') list.push('Software: MS Office 2024 License (+₹3,500)');
    if (softwareOpt === 'tally') list.push('Software: Tally Prime Setup (+₹1,800)');
    if (customNotes.trim()) list.push(`Custom Note: ${customNotes.trim()}`);
    return list;
  };

  const selectedModsList = getSelectedModifications();

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.phone.trim()) {
      alert('Please provide your Full Name and Contact Phone / WhatsApp Number.');
      return;
    }

    const generatedOrderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(generatedOrderId);

    // Format WhatsApp message for instant direct checkout
    let msg = 
      `*🛒 DIRECT HARDWARE PURCHASE ORDER - M/S COMPUTER PLANET*%0A%0A` +
      `📦 *Order Ref:* ${generatedOrderId}%0A` +
      `🖥️ *Product:* ${encodeURIComponent(product.name)}%0A` +
      `🔢 *Quantity:* ${quantity} unit(s)%0A` +
      `💵 *Unit Price (Base + Mods):* ₹${unitPrice.toLocaleString('en-IN')}%0A` +
      `💰 *Total Amount:* ₹${totalPrice.toLocaleString('en-IN')}%0A` +
      `💳 *Payment Choice:* ${paymentMode}%0A%0A`;

    if (selectedModsList.length > 0) {
      msg += `🛠️ *CUSTOM MODIFICATIONS & UPGRADES:*%0A` + 
             selectedModsList.map(m => `  • ${encodeURIComponent(m)}`).join('%0A') + `%0A%0A`;
    }

    msg += 
      `👤 *Customer Name:* ${encodeURIComponent(formData.customerName)}%0A` +
      `📞 *Phone:* ${encodeURIComponent(formData.phone)}%0A` +
      (formData.orgName ? `🏢 *Firm / Office:* ${encodeURIComponent(formData.orgName)}%0A` : '') +
      (formData.gstin ? `🧾 *GSTIN for Tax Invoice:* ${encodeURIComponent(formData.gstin)}%0A` : '') +
      `📍 *Delivery City / Area:* ${encodeURIComponent(formData.cityArea)}%0A` +
      `🏠 *Delivery Address:* ${encodeURIComponent(formData.address || 'Silchar delivery')}%0A` +
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
              Your customized order for <strong className="text-slate-900 dark:text-white">{product.name}</strong> (Qty: {quantity}) has been forwarded to our Silchar Order Desk.
            </p>

            {/* Modifications Summary in Receipt */}
            {selectedModsList.length > 0 && (
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-xs text-left max-w-md mx-auto space-y-1">
                <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Customer Modifications Applied:</span>
                </div>
                <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-0.5 text-[11px]">
                  {selectedModsList.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

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
              <span>Direct Hardware & Custom Buy</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
              Customize & Place Order
            </h2>

            {/* Selected Product Summary Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
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
                      ₹{unitPrice.toLocaleString('en-IN')}
                    </span>
                    {modCost > 0 && (
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md font-semibold">
                        (+₹{modCost.toLocaleString('en-IN')} mods)
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

            {/* Customer Product Modification Options */}
            <div className="mb-5 p-4 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Customer Product Modifications & Upgrades</span>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Optional
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* RAM Modification */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    RAM Upgrade
                  </label>
                  <select
                    value={ramUpgrade}
                    onChange={(e) => setRamUpgrade(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="0">Standard Memory</option>
                    <option value="8gb">+8 GB RAM (+₹2,500)</option>
                    <option value="16gb">+16 GB RAM (+₹4,800)</option>
                  </select>
                </div>

                {/* Storage Modification */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Storage SSD Upgrade
                  </label>
                  <select
                    value={storageUpgrade}
                    onChange={(e) => setStorageUpgrade(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="0">Standard Storage</option>
                    <option value="512ssd">+512 GB NVMe SSD (+₹2,900)</option>
                    <option value="1tb-ssd">+1 TB High-Speed SSD (+₹4,900)</option>
                  </select>
                </div>

                {/* Warranty Extension */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Warranty & AMC Cover
                  </label>
                  <select
                    value={warrantyExt}
                    onChange={(e) => setWarrantyExt(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="0">Standard OEM Warranty</option>
                    <option value="1yr">+1 Year Extra Onsite Cover (+₹1,200)</option>
                    <option value="2yr">+2 Years Full AMC Cover (+₹2,500)</option>
                  </select>
                </div>

                {/* Software Option */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pre-installed Software / OS
                  </label>
                  <select
                    value={softwareOpt}
                    onChange={(e) => setSoftwareOpt(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="0">Standard OS Included</option>
                    <option value="win11pro">Windows 11 Pro Genuine (+₹1,500)</option>
                    <option value="office">MS Office 2024 License (+₹3,500)</option>
                    <option value="tally">Tally Prime Setup (+₹1,800)</option>
                  </select>
                </div>
              </div>

              {/* Custom Modification Instructions */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custom Modification Notes & Requirements
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Partition C: drive to 200GB, pre-install Google Chrome, or request custom cabling / bracket."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
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
