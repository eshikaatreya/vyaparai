// VyaparAI Smart POS Counter & Cart Engine

class PosModule {
  constructor() {
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.taxRate = 5; // default 5% GST
    this.discountAmount = 0;
    this.discountType = 'fixed'; // 'fixed' or 'percent'
  }

  renderCatalog() {
    const catalogGrid = document.getElementById('posCatalogGrid');
    const categoryTabsContainer = document.getElementById('posCategoryTabs');
    if (!catalogGrid) return;

    const products = window.app.state.products || [];
    const preset = window.NICHE_PRESETS[window.app.state.businessId] || window.NICHE_PRESETS.grocery;

    // Render Categories Tabs
    if (categoryTabsContainer) {
      const categories = ['all', ...preset.categories];
      categoryTabsContainer.innerHTML = categories.map(cat => {
        const isSelected = this.selectedCategory === cat;
        const displayName = cat === 'all' ? 'All Products' : cat;
        return `
          <button 
            onclick="window.posModule.filterCategory('${cat}')" 
            class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isSelected 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }"
          >
            ${displayName}
          </button>
        `;
      }).join('');
    }

    // Filter Products
    const filtered = products.filter(p => {
      const matchesCategory = this.selectedCategory === 'all' || p.category === this.selectedCategory;
      const matchesSearch = !this.searchQuery || 
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        p.barcode?.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      catalogGrid.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-400">
          <i class="fa-solid fa-box-open text-4xl mb-3 text-slate-300"></i>
          <p class="text-sm font-medium">No products found matching your search</p>
          <button onclick="window.posModule.resetSearch()" class="mt-2 text-xs text-emerald-600 font-semibold underline">
            Clear search filter
          </button>
        </div>
      `;
      return;
    }

    catalogGrid.innerHTML = filtered.map(item => {
      const isLowStock = item.stock <= item.reorderLevel;
      const isDeadStock = item.daysIdle >= 40;
      return `
        <div 
          onclick="window.posModule.addToCart('${item.id}', 1)"
          class="group relative bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-3.5 transition-all duration-200 hover:shadow-lg cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <span class="text-[11px] font-semibold text-slate-500 truncate max-w-[120px]">${item.category}</span>
              <div class="flex items-center gap-1">
                ${isLowStock ? '<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 animate-pulse">Low</span>' : ''}
                ${isDeadStock ? '<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">Idle</span>' : ''}
                <span class="text-[11px] font-medium text-slate-400">${item.stock} left</span>
              </div>
            </div>
            
            <h4 class="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 mb-1">
              ${item.name}
            </h4>
            <div class="text-[11px] text-slate-500 mb-3 font-medium">
              Unit: <span class="text-slate-700 font-semibold">${item.unit}</span>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div class="text-base font-extrabold text-slate-900">₹${item.sellingPrice}</div>
              <div class="text-[10px] text-slate-400 line-through">₹${Math.round(item.sellingPrice * 1.15)}</div>
            </div>
            <div class="flex items-center gap-1">
              <button 
                onclick="event.stopPropagation(); window.posModule.promptFractionalQuantity('${item.id}')" 
                class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs transition-colors"
                title="Add fractional quantity (e.g., 1.5 kg)"
              >
                <i class="fa-solid fa-scale-balanced"></i>
              </button>
              <button 
                onclick="event.stopPropagation(); window.posModule.addToCart('${item.id}', 1)" 
                class="w-8 h-8 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white flex items-center justify-center text-sm shadow transition-all hover:scale-105"
                title="Quick Add"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  filterCategory(category) {
    this.selectedCategory = category;
    this.renderCatalog();
  }

  handleSearch(query) {
    this.searchQuery = query;
    this.renderCatalog();
  }

  resetSearch() {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    const input = document.getElementById('posSearchInput');
    if (input) input.value = '';
    this.renderCatalog();
  }

  // Quick Barcode simulation
  simulateBarcodeScan() {
    window.soundEngine.playScanBeep();
    const products = window.app.state.products || [];
    if (products.length === 0) return;
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    this.addToCart(randomProduct.id, 1);
    window.app.showToast(`Scanned Barcode: ${randomProduct.barcode || 'EAN-890'} (${randomProduct.name})`, 'info');
  }

  promptFractionalQuantity(productId) {
    const item = window.app.state.products.find(p => p.id === productId);
    if (!item) return;

    const qtyStr = prompt(`Enter fractional quantity for "${item.name}" (Current unit: ${item.unit}):`, '1.5');
    if (qtyStr === null) return;
    const qty = parseFloat(qtyStr);
    if (isNaN(qty) || qty <= 0) {
      window.app.showToast('Please enter a valid positive quantity', 'error');
      return;
    }

    this.addToCart(productId, qty);
  }

  addToCart(productId, qty = 1) {
    const product = window.app.state.products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = window.app.state.cart.findIndex(c => c.productId === productId);
    if (existingIndex > -1) {
      window.app.state.cart[existingIndex].qty += qty;
    } else {
      window.app.state.cart.push({
        productId: product.id,
        name: product.name,
        unit: product.unit,
        price: product.sellingPrice,
        costPrice: product.costPrice,
        qty: qty,
        category: product.category
      });
    }

    window.soundEngine.playScanBeep();
    window.app.saveState();
    this.renderCart();
  }

  updateCartQty(productId, newQty) {
    newQty = parseFloat(newQty);
    if (isNaN(newQty) || newQty <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const item = window.app.state.cart.find(c => c.productId === productId);
    if (item) {
      item.qty = Math.round(newQty * 100) / 100;
      window.app.saveState();
      this.renderCart();
    }
  }

  changeQtyBy(productId, delta) {
    const item = window.app.state.cart.find(c => c.productId === productId);
    if (!item) return;
    const updated = item.qty + delta;
    if (updated <= 0) {
      this.removeFromCart(productId);
    } else {
      item.qty = Math.round(updated * 100) / 100;
      window.app.saveState();
      this.renderCart();
    }
  }

  removeFromCart(productId) {
    window.app.state.cart = window.app.state.cart.filter(c => c.productId !== productId);
    window.app.saveState();
    this.renderCart();
  }

  clearCart() {
    if (window.app.state.cart.length === 0) return;
    if (confirm('Clear all items from current cart?')) {
      window.app.state.cart = [];
      window.app.saveState();
      this.renderCart();
      window.app.showToast('Cart cleared', 'info');
    }
  }

  holdCart() {
    if (window.app.state.cart.length === 0) {
      window.app.showToast('Cart is empty', 'warning');
      return;
    }
    const draft = {
      id: 'draft-' + Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...window.app.state.cart]
    };
    window.app.state.draftCarts = window.app.state.draftCarts || [];
    window.app.state.draftCarts.push(draft);
    window.app.state.cart = [];
    window.app.saveState();
    this.renderCart();
    window.app.showToast(`Cart parked as Draft #${draft.time}`, 'success');
  }

  calculateTotals() {
    const cart = window.app.state.cart || [];
    let subtotal = 0;
    let totalCost = 0;

    cart.forEach(item => {
      subtotal += item.price * item.qty;
      totalCost += item.costPrice * item.qty;
    });

    let discount = 0;
    if (this.discountType === 'percent') {
      discount = (subtotal * this.discountAmount) / 100;
    } else {
      discount = Math.min(this.discountAmount, subtotal);
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = (taxableAmount * this.taxRate) / 100;
    const grandTotal = Math.round(taxableAmount + tax);
    const estimatedProfit = Math.round(taxableAmount - totalCost);

    return {
      subtotal: Math.round(subtotal),
      discount: Math.round(discount),
      taxableAmount: Math.round(taxableAmount),
      tax: Math.round(tax),
      grandTotal: grandTotal,
      estimatedProfit: estimatedProfit
    };
  }

  renderCart() {
    const cartItemsContainer = document.getElementById('posCartItemsList');
    const cartItemCountBadge = document.getElementById('cartItemCountBadge');
    const subtotalEl = document.getElementById('posSummarySubtotal');
    const taxEl = document.getElementById('posSummaryTax');
    const discountEl = document.getElementById('posSummaryDiscount');
    const grandTotalEl = document.getElementById('posSummaryGrandTotal');
    const profitEl = document.getElementById('posSummaryEstimatedProfit');
    const checkoutBtn = document.getElementById('posCheckoutButton');

    if (!cartItemsContainer) return;

    const cart = window.app.state.cart || [];
    const totals = this.calculateTotals();

    // Update Counts & Badges
    const totalUnits = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartItemCountBadge) cartItemCountBadge.innerText = `${cart.length} items (${totalUnits})`;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="h-64 flex flex-col items-center justify-center text-slate-300">
          <i class="fa-solid fa-cart-shopping text-4xl mb-3"></i>
          <p class="text-sm font-semibold text-slate-400">Your cart is empty</p>
          <p class="text-xs text-slate-400 mt-1">Tap products or speak voice commands</p>
        </div>
      `;
      if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
      if (checkoutBtn) checkoutBtn.disabled = false;
      cartItemsContainer.innerHTML = cart.map(item => {
        const itemLineTotal = Math.round(item.price * item.qty);
        return `
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-all">
            <div class="flex-1 min-w-0 pr-2">
              <h5 class="text-xs font-bold text-slate-900 truncate">${item.name}</h5>
              <div class="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                <span>₹${item.price} / ${item.unit}</span>
                <span class="text-slate-300">•</span>
                <span class="text-emerald-700 font-semibold">₹${itemLineTotal}</span>
              </div>
            </div>

            <!-- Qty controls -->
            <div class="flex items-center gap-1.5">
              <button 
                onclick="window.posModule.changeQtyBy('${item.productId}', -1)"
                class="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs"
              >
                <i class="fa-solid fa-minus"></i>
              </button>
              <input 
                type="number" 
                step="any" 
                value="${item.qty}" 
                onchange="window.posModule.updateCartQty('${item.productId}', this.value)"
                class="w-12 py-0.5 text-center text-xs font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button 
                onclick="window.posModule.changeQtyBy('${item.productId}', 1)"
                class="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
              <button 
                onclick="window.posModule.removeFromCart('${item.productId}')"
                class="text-slate-400 hover:text-rose-600 p-1 ml-1"
                title="Remove item"
              >
                <i class="fa-solid fa-trash-can text-xs"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    // Update Summary Values
    if (subtotalEl) subtotalEl.innerText = `₹${totals.subtotal.toLocaleString()}`;
    if (taxEl) taxEl.innerText = `₹${totals.tax.toLocaleString()}`;
    if (discountEl) discountEl.innerText = `-₹${totals.discount.toLocaleString()}`;
    if (grandTotalEl) grandTotalEl.innerText = `₹${totals.grandTotal.toLocaleString()}`;
    if (profitEl) profitEl.innerText = `₹${totals.estimatedProfit.toLocaleString()}`;
  }

  setTaxRate(rate) {
    this.taxRate = parseFloat(rate);
    this.renderCart();
  }

  applyDiscountPrompt() {
    const discountStr = prompt('Enter Discount (e.g. 50 for ₹50 off, or 10% for 10% off):', '50');
    if (discountStr === null) return;

    if (discountStr.endsWith('%')) {
      this.discountType = 'percent';
      this.discountAmount = parseFloat(discountStr.replace('%', '')) || 0;
    } else {
      this.discountType = 'fixed';
      this.discountAmount = parseFloat(discountStr) || 0;
    }

    this.renderCart();
    window.app.showToast(`Applied ${this.discountType === 'percent' ? this.discountAmount + '%' : '₹' + this.discountAmount} discount`, 'success');
  }
}

window.posModule = new PosModule();
