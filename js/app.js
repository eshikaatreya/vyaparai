// VyaparAI Main Application Engine & State Store

class VyaparApp {
  constructor() {
    this.storageKey = 'vyaparai_v1_store';
    this.state = this.loadInitialState();
    this.activeTab = 'dashboard';
    this.currentRole = this.state.role || 'owner'; // 'owner' or 'cashier'
    this.charts = {};
  }

  loadInitialState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse state from localStorage', e);
    }

    // Default starting business: Grocery Store, but user can personalize right away
    const defaultNiche = 'grocery';
    const preset = window.NICHE_PRESETS[defaultNiche];

    return {
      isPersonalized: false, // triggers initial onboarding modal if false
      businessId: defaultNiche,
      businessName: 'Radhe Krishna Supermart & Kirana',
      nicheTitle: preset.name,
      ownerName: 'Sunil Sharma',
      role: 'owner',
      currency: '₹',
      products: JSON.parse(JSON.stringify(preset.commonProducts)),
      cart: [],
      draftCarts: [],
      sales: this.generateInitialSales(preset.commonProducts),
      shrinkageLogs: [
        { id: 'sh-1', date: '2026-10-09', itemName: 'Aashirvaad Shudh Chakki Atta 5kg', qty: 2, unitPrice: 210, totalLoss: 420, reason: 'Transit Packaging Tear', vendor: 'Shree Krishna Wholesale', status: 'Credit Note Requested' },
        { id: 'sh-2', date: '2026-10-08', itemName: 'Fortune Sunlite Refined Sunflower Oil 1L', qty: 4, unitPrice: 122, totalLoss: 488, reason: 'Pouch Leakage in Crate', vendor: 'Shree Krishna Wholesale', status: 'Credit Note Approved' }
      ],
      cashDrawer: {
        openingCash: 2500,
        cashSales: 11250,
        cashPayouts: 450,
        expectedCash: 13300,
        physicalCashCounted: null,
        reconciled: false,
        discrepancy: 0,
        lastEodDate: null
      },
      overheads: {
        monthlyRent: 18000,
        electricityBill: 4500,
        staffSalaries: 16000,
        softwareMisc: 1500
      }
    };
  }

  generateInitialSales(products) {
    const today = new Date().toISOString().split('T')[0];
    const pastSales = [];
    
    // Simulate realistic 7-day sales
    const daysAgo = (n) => {
      const d = new Date();
      d.setDate(d.getDate() - n);
      return d.toISOString().split('T')[0];
    };

    const dummyTx = [
      { day: daysAgo(6), revenue: 14200, profit: 3400 },
      { day: daysAgo(5), revenue: 18950, profit: 4620 },
      { day: daysAgo(4), revenue: 16800, profit: 3950 },
      { day: daysAgo(3), revenue: 21400, profit: 5350 },
      { day: daysAgo(2), revenue: 19800, profit: 4790 },
      { day: daysAgo(1), revenue: 24150, profit: 6100 },
      { day: today, revenue: 12840, profit: 3260 }
    ];

    return dummyTx;
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }

  // Switch Business Niche / Re-personalize
  switchNiche(nicheKey, customName = null, initialProducts = null) {
    const preset = window.NICHE_PRESETS[nicheKey] || window.NICHE_PRESETS.grocery;
    this.state.businessId = nicheKey;
    this.state.businessName = customName || (preset.name + ' Pro');
    this.state.nicheTitle = preset.name;
    this.state.currency = preset.currency || '₹';
    this.state.products = initialProducts || JSON.parse(JSON.stringify(preset.commonProducts));
    this.state.cart = [];
    this.state.isPersonalized = true;

    // Reset default sales tailored to new niche
    this.state.sales = this.generateInitialSales(this.state.products);
    this.saveState();

    this.showToast(`✨ Personalized for ${preset.name}!`, 'success');
    
    // Refresh all views
    this.renderAll();
  }

  // Switch Role: Owner vs Cashier
  setRole(newRole) {
    this.currentRole = newRole;
    this.state.role = newRole;
    this.saveState();

    const roleIndicator = document.getElementById('currentRoleLabel');
    const cashierLockBanner = document.getElementById('cashierLockBanner');
    
    if (roleIndicator) {
      roleIndicator.innerText = newRole === 'owner' ? 'Store Owner' : 'Cashier Mode';
      roleIndicator.className = newRole === 'owner' 
        ? 'px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300'
        : 'px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-300';
    }

    if (cashierLockBanner) {
      if (newRole === 'cashier') {
        cashierLockBanner.classList.remove('hidden');
      } else {
        cashierLockBanner.classList.add('hidden');
      }
    }

    // Role-based visibility enforcement
    document.querySelectorAll('[data-owner-only="true"]').forEach(el => {
      if (newRole === 'cashier') {
        el.classList.add('opacity-40', 'pointer-events-none', 'filter', 'blur-[2px]');
      } else {
        el.classList.remove('opacity-40', 'pointer-events-none', 'filter', 'blur-[2px]');
      }
    });

    this.showToast(`Switched to ${newRole === 'owner' ? 'Store Owner (Full Access)' : 'Cashier (Protected Mode)'}`, 'info');

    // If Cashier was on an owner-only tab, redirect to POS
    if (newRole === 'cashier' && ['analytics', 'deadstock', 'ocr'].includes(this.activeTab)) {
      this.switchTab('pos');
    }
  }

  // Tab switching
  switchTab(tabId) {
    if (this.currentRole === 'cashier' && ['analytics', 'deadstock', 'ocr'].includes(tabId)) {
      this.showToast('Restricted: Store Owner access required for financial ledgers & OCR', 'warning');
      return;
    }

    this.activeTab = tabId;

    // Update Nav Buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('bg-emerald-600', 'text-white', 'shadow-md');
        btn.classList.remove('text-slate-400', 'hover:bg-slate-800', 'hover:text-white');
      } else {
        btn.classList.remove('bg-emerald-600', 'text-white', 'shadow-md');
        btn.classList.add('text-slate-400', 'hover:bg-slate-800', 'hover:text-white');
      }
    });

    // Update Tab Content Sections
    document.querySelectorAll('.tab-section').forEach(sec => {
      sec.classList.add('hidden');
    });

    const activeSec = document.getElementById(`tab-${tabId}`);
    if (activeSec) {
      activeSec.classList.remove('hidden');
    }

    // Trigger specific tab renderers
    if (tabId === 'dashboard') {
      window.analyticsModule?.renderDashboard();
    } else if (tabId === 'pos') {
      window.posModule?.renderCatalog();
      window.posModule?.renderCart();
    } else if (tabId === 'analytics') {
      window.analyticsModule?.renderLedger();
    } else if (tabId === 'deadstock') {
      window.analyticsModule?.renderDeadStock();
    } else if (tabId === 'inventory') {
      window.inventoryModule?.renderInventoryTable();
    } else if (tabId === 'ocr') {
      window.ocrModule?.renderOcrScreen();
    } else if (tabId === 'eod') {
      window.eodModule?.renderEodScreen();
    } else if (tabId === 'market') {
      window.marketModule?.renderMarketIntel();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Toast Notifications
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    const id = 'toast-' + Date.now();
    toast.id = id;

    const bgColors = {
      success: 'bg-emerald-950 border-emerald-500 text-emerald-100',
      warning: 'bg-amber-950 border-amber-500 text-amber-100',
      error: 'bg-rose-950 border-rose-500 text-rose-100',
      info: 'bg-slate-900 border-indigo-500 text-slate-100'
    };

    const icons = {
      success: 'fa-circle-check text-emerald-400',
      warning: 'fa-triangle-exclamation text-amber-400',
      error: 'fa-circle-xmark text-rose-400',
      info: 'fa-sparkles text-indigo-400'
    };

    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-2 opacity-0 text-sm font-medium z-50 ${bgColors[type] || bgColors.info}`;
    toast.innerHTML = `
      <i class="fa-solid ${icons[type] || icons.info} text-lg"></i>
      <div class="flex-1">${message}</div>
      <button onclick="document.getElementById('${id}').remove()" class="text-slate-400 hover:text-white ml-2 text-xs">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  }

  renderAll() {
    // Update Header Business Details
    const headerTitle = document.getElementById('headerBusinessTitle');
    const headerNicheBadge = document.getElementById('headerNicheBadge');
    if (headerTitle) headerTitle.innerText = this.state.businessName;
    if (headerNicheBadge) {
      const preset = window.NICHE_PRESETS[this.state.businessId] || window.NICHE_PRESETS.grocery;
      headerNicheBadge.innerHTML = `<i class="fa-solid ${preset.icon} mr-1.5"></i> ${preset.name}`;
    }

    // Refresh active tab
    this.switchTab(this.activeTab);
  }

  init() {
    this.renderAll();
    this.setRole(this.currentRole);

    // If first time visit or not yet personalized, launch Onboarding Wizard
    if (!this.state.isPersonalized) {
      setTimeout(() => {
        window.onboardingWizard?.openWizard();
      }, 300);
    }
  }
}

window.app = new VyaparApp();
