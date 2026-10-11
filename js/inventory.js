// VyaparAI Predictive Low-Stock, Lead-Time Alerts & PO Generator

class InventoryModule {
  constructor() {
    this.filterState = 'all'; // 'all', 'critical', 'healthy'
  }

  renderInventoryTable() {
    const tableBody = document.getElementById('inventoryTableBody');
    const urgentBanner = document.getElementById('inventoryUrgentBanner');
    const urgentItemsList = document.getElementById('inventoryUrgentList');
    if (!tableBody) return;

    const products = window.app.state.products || [];

    // Identify critical items
    const criticalItems = [];
    const enrichedProducts = products.map(p => {
      const velocity = Math.max(0.1, p.dailyVelocity || 1);
      const daysRemaining = Math.floor(p.stock / velocity);
      const leadTime = p.leadTimeDays || 3;
      const isCritical = daysRemaining <= leadTime || p.stock <= p.reorderLevel;

      if (isCritical) {
        criticalItems.push({ ...p, daysRemaining, leadTime });
      }

      return {
        ...p,
        velocity,
        daysRemaining,
        leadTime,
        isCritical
      };
    });

    // Update Urgent Restock Banner
    if (urgentBanner && urgentItemsList) {
      if (criticalItems.length > 0) {
        urgentBanner.classList.remove('hidden');
        urgentItemsList.innerHTML = criticalItems.map(c => `
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 text-xs font-bold border border-rose-200">
            <i class="fa-solid fa-triangle-exclamation text-rose-600"></i>
            ${c.name}: ${c.stock} left (${c.daysRemaining}d runout vs ${c.leadTime}d lead time)
          </span>
        `).join('');
      } else {
        urgentBanner.classList.add('hidden');
      }
    }

    // Filter products
    const filtered = enrichedProducts.filter(p => {
      if (this.filterState === 'critical') return p.isCritical;
      if (this.filterState === 'healthy') return !p.isCritical;
      return true;
    });

    tableBody.innerHTML = filtered.map(item => {
      let badgeHtml = '';
      if (item.daysRemaining <= item.leadTime) {
        badgeHtml = `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
            <i class="fa-solid fa-fire text-rose-600"></i> ${item.daysRemaining} Days Left (Urgent!)
          </span>
        `;
      } else if (item.daysRemaining <= 8) {
        badgeHtml = `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <i class="fa-solid fa-clock text-amber-600"></i> ${item.daysRemaining} Days Left
          </span>
        `;
      } else {
        badgeHtml = `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800">
            <i class="fa-solid fa-circle-check text-emerald-600"></i> Healthy (${item.daysRemaining}d)
          </span>
        `;
      }

      return `
        <tr class="hover:bg-slate-50 transition-colors text-xs">
          <td class="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 text-xs">
              <i class="fa-solid ${item.icon || 'fa-box'}"></i>
            </div>
            <span>${item.name}</span>
          </td>
          <td class="py-3 px-3 text-slate-500">${item.category}</td>
          <td class="py-3 px-3 text-right font-black text-slate-900">${item.stock} ${item.unit}</td>
          <td class="py-3 px-3 text-right font-mono text-slate-600">${item.dailyVelocity.toFixed(1)} / day</td>
          <td class="py-3 px-3 text-right font-mono text-slate-600">${item.leadTime} days</td>
          <td class="py-3 px-3 text-center">${badgeHtml}</td>
          <td class="py-3 px-4 text-center">
            <button 
              onclick="window.inventoryModule.quickRestockProduct('${item.id}', 10)" 
              class="px-3 py-1 rounded-lg bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-semibold text-[11px] transition-colors"
              title="Quick Add 10 Units"
            >
              +10 Restock
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  filterStock(type) {
    this.filterState = type;
    document.querySelectorAll('.stock-filter-btn').forEach(b => {
      const isSelected = b.getAttribute('data-filter') === type;
      if (isSelected) {
        b.classList.add('bg-slate-900', 'text-white');
        b.classList.remove('bg-white', 'text-slate-600');
      } else {
        b.classList.remove('bg-slate-900', 'text-white');
        b.classList.add('bg-white', 'text-slate-600');
      }
    });
    this.renderInventoryTable();
  }

  quickRestockProduct(productId, qty) {
    const item = window.app.state.products.find(p => p.id === productId);
    if (!item) return;
    item.stock += qty;
    window.app.saveState();
    window.soundEngine.playScanBeep();
    window.app.showToast(`Restocked +${qty} units for "${item.name}"`, 'success');
    this.renderInventoryTable();
    window.analyticsModule.renderDashboard();
  }

  // Automated Reorder PO Generator
  generatePurchaseOrder() {
    const products = window.app.state.products || [];
    const reorderItems = [];
    let totalEstimatedPoCost = 0;

    products.forEach(p => {
      const velocity = Math.max(0.1, p.dailyVelocity || 1);
      const daysRemaining = Math.floor(p.stock / velocity);
      const leadTime = p.leadTimeDays || 3;

      // If running out within 10 days
      if (daysRemaining <= 10 || p.stock <= p.reorderLevel) {
        // Target 25 days buffer
        const recommendedQty = Math.ceil(velocity * 25) - p.stock;
        if (recommendedQty > 0) {
          const itemCost = recommendedQty * p.costPrice;
          totalEstimatedPoCost += itemCost;
          reorderItems.push({
            name: p.name,
            currentStock: p.stock,
            unit: p.unit,
            recommendedQty: recommendedQty,
            unitCost: p.costPrice,
            totalCost: itemCost
          });
        }
      }
    });

    if (reorderItems.length === 0) {
      window.app.showToast('All products have healthy inventory buffers! No PO needed.', 'info');
      return;
    }

    const modal = document.getElementById('poModal');
    const content = document.getElementById('poModalContent');
    if (!modal || !content) return;

    modal.classList.remove('hidden');

    const poNumber = 'PO-' + Math.floor(10000 + Math.random() * 90000);
    const dateStr = new Date().toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });

    content.innerHTML = `
      <div class="p-6">
        <div class="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <div>
            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">AI Predictive Reorder</span>
            <h3 class="text-xl font-black text-slate-900">Purchase Order ${poNumber}</h3>
            <p class="text-xs text-slate-500">Generated on ${dateStr} for ${window.app.state.businessName}</p>
          </div>
          <div class="text-right">
            <div class="text-xs text-slate-400">Total Estimated Cost</div>
            <div class="text-2xl font-black text-slate-900">₹${totalEstimatedPoCost.toLocaleString()}</div>
          </div>
        </div>

        <div class="border border-slate-200 rounded-xl overflow-hidden mb-5">
          <table class="w-full text-xs text-slate-600">
            <thead class="bg-slate-50 uppercase text-[11px] font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th class="py-2.5 px-3 text-left">Item Name</th>
                <th class="py-2.5 px-3 text-right">In Stock</th>
                <th class="py-2.5 px-3 text-right font-bold text-emerald-700">Order Qty</th>
                <th class="py-2.5 px-3 text-right">Unit Cost</th>
                <th class="py-2.5 px-3 text-right font-bold">Line Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${reorderItems.map(item => `
                <tr>
                  <td class="py-2.5 px-3 font-medium text-slate-900">${item.name}</td>
                  <td class="py-2.5 px-3 text-right text-slate-500">${item.currentStock} ${item.unit}</td>
                  <td class="py-2.5 px-3 text-right font-black text-emerald-600">${item.recommendedQty}</td>
                  <td class="py-2.5 px-3 text-right">₹${item.unitCost}</td>
                  <td class="py-2.5 px-3 text-right font-bold text-slate-900">₹${item.totalCost.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="bg-indigo-50 border border-indigo-200 p-3.5 rounded-xl text-xs text-indigo-900 mb-5 flex items-start gap-2.5">
          <i class="fa-solid fa-wand-magic-sparkles text-indigo-600 text-sm mt-0.5"></i>
          <div>
            <div class="font-bold">AI Buffer Rationale:</div>
            <div>Order quantities are calculated based on your 7-day sales velocity + 25-day safety cushion, preventing both stockouts and excess dead capital.</div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <button onclick="document.getElementById('poModal').classList.add('hidden')" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900">Close</button>
          <button onclick="window.print()" class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2">
            <i class="fa-solid fa-print"></i>
            <span>Print / Export PO</span>
          </button>
        </div>
      </div>
    `;
  }
}

window.inventoryModule = new InventoryModule();
