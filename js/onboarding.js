// VyaparAI Business Personalization & Onboarding Wizard

class OnboardingWizard {
  constructor() {
    this.selectedNiche = 'grocery';
    this.customProducts = [];
    this.step = 1;
  }

  openWizard() {
    this.step = 1;
    this.selectedNiche = window.app.state.businessId || 'grocery';
    this.customProducts = [];
    
    const modal = document.getElementById('onboardingModal');
    if (modal) {
      modal.classList.remove('hidden');
      this.renderStep1();
    }
  }

  closeWizard() {
    const modal = document.getElementById('onboardingModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  selectNicheCard(nicheKey) {
    this.selectedNiche = nicheKey;
    document.querySelectorAll('.niche-card-btn').forEach(card => {
      const isSelected = card.getAttribute('data-niche') === nicheKey;
      if (isSelected) {
        card.classList.add('border-emerald-500', 'bg-emerald-50/50', 'ring-2', 'ring-emerald-400');
        card.classList.remove('border-slate-200', 'hover:border-slate-300', 'bg-white');
      } else {
        card.classList.remove('border-emerald-500', 'bg-emerald-50/50', 'ring-2', 'ring-emerald-400');
        card.classList.add('border-slate-200', 'hover:border-slate-300', 'bg-white');
      }
    });

    const storeNameInput = document.getElementById('onboardingStoreName');
    if (storeNameInput) {
      const preset = window.NICHE_PRESETS[nicheKey];
      if (nicheKey === 'grocery') storeNameInput.value = 'Radhe Krishna Supermart & Kirana';
      else if (nicheKey === 'crochet') storeNameInput.value = 'Aura Handcrafted Crochet & Yarns';
      else if (nicheKey === 'cosmetic') storeNameInput.value = 'Velvet Bloom Skincare & Beauty';
      else if (nicheKey === 'graphic_tshirt') storeNameInput.value = 'Neon Street Apparel & Graphic Tees';
      else if (nicheKey === 'cafe') storeNameInput.value = 'Bean & Crust Artisan Bakery';
      else if (nicheKey === 'decor') storeNameInput.value = 'TerraCraft Modern Living Boutique';
    }
  }

  renderStep1() {
    const container = document.getElementById('onboardingStepContent');
    if (!container) return;

    const niches = Object.values(window.NICHE_PRESETS);

    container.innerHTML = `
      <div class="text-center max-w-xl mx-auto mb-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
          Step 1 of 2: Business Personalization
        </div>
        <h3 class="text-2xl font-bold text-slate-900">What type of business are you running?</h3>
        <p class="text-sm text-slate-500 mt-1">VyaparAI customizes catalog presets, voice parsing, profit metrics, and dead stock models specifically for your profession.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        ${niches.map(niche => {
          const isSelected = niche.id === this.selectedNiche;
          return `
            <div 
              data-niche="${niche.id}"
              onclick="window.onboardingWizard.selectNicheCard('${niche.id}')"
              class="niche-card-btn cursor-pointer p-4 rounded-2xl border transition-all duration-200 text-left flex flex-col justify-between ${
                isSelected 
                  ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-400 shadow-sm' 
                  : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'
              }"
            >
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 text-lg">
                    <i class="fa-solid ${niche.icon}"></i>
                  </div>
                  <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    ${niche.badge}
                  </span>
                </div>
                <h4 class="font-bold text-slate-900 text-base">${niche.name}</h4>
                <p class="text-xs text-slate-500 mt-1 line-clamp-2">${niche.tagline}</p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>${niche.commonProducts.length} Pre-configured Items</span>
                <i class="fa-solid fa-arrow-right text-emerald-600"></i>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="w-full sm:w-1/2">
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Store / Business Name</label>
          <input 
            type="text" 
            id="onboardingStoreName" 
            value="${window.app.state.businessName || 'My Vyapar Store'}"
            class="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            placeholder="Enter store name"
          />
        </div>
        <div class="w-full sm:w-1/2">
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Currency Symbol</label>
          <select id="onboardingCurrency" class="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
            <option value="₹">₹ (Indian Rupee - INR)</option>
            <option value="$">$ (US Dollar - USD)</option>
            <option value="€">€ (Euro - EUR)</option>
            <option value="£">£ (British Pound - GBP)</option>
            <option value="AED">AED (UAE Dirham)</option>
          </select>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <button 
          onclick="window.onboardingWizard.closeWizard()" 
          class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
        >
          Skip Setup
        </button>
        <button 
          onclick="window.onboardingWizard.goToStep2()" 
          class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <span>Configure Products</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    `;
  }

  goToStep2() {
    const storeNameInput = document.getElementById('onboardingStoreName');
    if (storeNameInput && storeNameInput.value.trim()) {
      this.customStoreName = storeNameInput.value.trim();
    }
    const currencySelect = document.getElementById('onboardingCurrency');
    if (currencySelect) {
      this.customCurrency = currencySelect.value;
    }

    this.step = 2;
    this.renderStep2();
  }

  renderStep2() {
    const container = document.getElementById('onboardingStepContent');
    if (!container) return;

    const preset = window.NICHE_PRESETS[this.selectedNiche] || window.NICHE_PRESETS.grocery;
    const isGrocery = this.selectedNiche === 'grocery';

    // If starting step 2 fresh, copy preset products
    if (this.customProducts.length === 0) {
      this.customProducts = JSON.parse(JSON.stringify(preset.commonProducts));
    }

    container.innerHTML = `
      <div class="text-center max-w-xl mx-auto mb-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
          Step 2 of 2: Product Catalog Setup
        </div>
        <h3 class="text-2xl font-bold text-slate-900">
          ${isGrocery ? 'Common Daily Essentials Loaded' : `Tailored ${preset.name} Catalog`}
        </h3>
        <p class="text-sm text-slate-500 mt-1">
          ${isGrocery 
            ? 'We loaded popular kirana staples (atta, dal, oil, butter, milk, spices). Use the "+" bar below to add your custom stock.'
            : 'Pre-loaded trending items for your niche. You can adjust prices, remove items, or add your signature handcrafted products.'}
        </p>
      </div>

      <!-- Add Product Quick Input Bar -->
      <div class="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 mb-5 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-circle-plus text-emerald-600"></i> + Add Custom Product to Inventory
          </span>
          <span class="text-xs text-emerald-700">Fill details and click "+ Add to List"</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
          <input 
            type="text" 
            id="newProdName" 
            placeholder="Product Name" 
            class="px-3 py-2 text-xs rounded-lg border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium col-span-2"
          />
          <input 
            type="text" 
            id="newProdCategory" 
            placeholder="Category" 
            list="categoryDatalist"
            class="px-3 py-2 text-xs rounded-lg border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
          <datalist id="categoryDatalist">
            ${preset.categories.map(c => `<option value="${c}">`).join('')}
          </datalist>
          <input 
            type="text" 
            id="newProdUnit" 
            placeholder="Unit (e.g. 1 kg, pc)" 
            class="px-3 py-2 text-xs rounded-lg border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
          <input 
            type="number" 
            id="newProdCost" 
            placeholder="Cost (₹)" 
            class="px-3 py-2 text-xs rounded-lg border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
          <input 
            type="number" 
            id="newProdSelling" 
            placeholder="Sell Price (₹)" 
            class="px-3 py-2 text-xs rounded-lg border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>
        <div class="mt-3 flex justify-end">
          <button 
            type="button"
            onclick="window.onboardingWizard.addQuickProduct()" 
            class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow flex items-center gap-1.5"
          >
            <i class="fa-solid fa-plus"></i>
            <span>+ Add to Product List</span>
          </button>
        </div>
      </div>

      <!-- Current Catalog Table -->
      <div class="border border-slate-200 rounded-2xl overflow-hidden mb-6 bg-white shadow-sm max-h-[320px] overflow-y-auto">
        <table class="w-full text-left text-xs text-slate-600">
          <thead class="bg-slate-50 uppercase text-[11px] font-semibold text-slate-500 sticky top-0 border-b border-slate-200">
            <tr>
              <th class="py-3 px-4">Item Name</th>
              <th class="py-3 px-3">Category</th>
              <th class="py-3 px-2">Unit</th>
              <th class="py-3 px-3 text-right">Cost Price</th>
              <th class="py-3 px-3 text-right">Selling Price</th>
              <th class="py-3 px-3 text-right">Starting Stock</th>
              <th class="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody id="onboardingProductTableBody" class="divide-y divide-slate-100">
            ${this.renderProductRows()}
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-slate-200">
        <button 
          onclick="window.onboardingWizard.renderStep1()" 
          class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 flex items-center gap-2"
        >
          <i class="fa-solid fa-arrow-left"></i>
          <span>Change Profession</span>
        </button>
        <button 
          onclick="window.onboardingWizard.finishAndLaunch()" 
          class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <i class="fa-solid fa-rocket"></i>
          <span>Launch ${preset.name} Dashboard</span>
        </button>
      </div>
    `;
  }

  renderProductRows() {
    return this.customProducts.map((p, index) => {
      const margin = Math.round(((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100);
      return `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-2.5 px-4 font-medium text-slate-900 flex items-center gap-2">
            <div class="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 text-xs">
              <i class="fa-solid ${p.icon || 'fa-box'}"></i>
            </div>
            <span>${p.name}</span>
          </td>
          <td class="py-2.5 px-3 text-slate-500">${p.category}</td>
          <td class="py-2.5 px-2 text-slate-500">${p.unit}</td>
          <td class="py-2.5 px-3 text-right font-medium text-slate-700">₹${p.costPrice}</td>
          <td class="py-2.5 px-3 text-right font-bold text-emerald-600">₹${p.sellingPrice}</td>
          <td class="py-2.5 px-3 text-right font-medium text-slate-900">${p.stock}</td>
          <td class="py-2.5 px-3 text-center">
            <button 
              type="button" 
              onclick="window.onboardingWizard.removeProduct(${index})" 
              class="text-slate-400 hover:text-rose-600 transition-colors p-1"
              title="Remove item"
            >
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  addQuickProduct() {
    const name = document.getElementById('newProdName')?.value.trim();
    const category = document.getElementById('newProdCategory')?.value.trim() || 'General';
    const unit = document.getElementById('newProdUnit')?.value.trim() || '1 pc';
    const cost = parseFloat(document.getElementById('newProdCost')?.value) || 50;
    const selling = parseFloat(document.getElementById('newProdSelling')?.value) || Math.round(cost * 1.35);

    if (!name) {
      window.app.showToast('Please enter a product name', 'warning');
      return;
    }

    const newProd = {
      id: 'custom-' + Date.now(),
      name: name,
      category: category,
      unit: unit,
      costPrice: cost,
      sellingPrice: selling,
      stock: 20,
      reorderLevel: 5,
      leadTimeDays: 3,
      dailyVelocity: 1.5,
      daysIdle: 0,
      barcode: 'SKU-' + Math.floor(100000 + Math.random() * 900000),
      icon: 'fa-box'
    };

    this.customProducts.unshift(newProd);
    
    // Clear inputs
    document.getElementById('newProdName').value = '';
    document.getElementById('newProdCategory').value = '';
    document.getElementById('newProdUnit').value = '';
    document.getElementById('newProdCost').value = '';
    document.getElementById('newProdSelling').value = '';

    const tbody = document.getElementById('onboardingProductTableBody');
    if (tbody) {
      tbody.innerHTML = this.renderProductRows();
    }

    window.soundEngine.playScanBeep();
    window.app.showToast(`Added "${name}" to product list`, 'success');
  }

  removeProduct(index) {
    this.customProducts.splice(index, 1);
    const tbody = document.getElementById('onboardingProductTableBody');
    if (tbody) {
      tbody.innerHTML = this.renderProductRows();
    }
  }

  finishAndLaunch() {
    const storeName = this.customStoreName || (window.NICHE_PRESETS[this.selectedNiche].name + ' Pro');
    window.app.switchNiche(this.selectedNiche, storeName, this.customProducts);
    this.closeWizard();

    // Trigger celebratory sound & confetti
    window.soundEngine.playCashDing();
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }
}

window.onboardingWizard = new OnboardingWizard();
