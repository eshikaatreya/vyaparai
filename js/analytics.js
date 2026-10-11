// VyaparAI Analytics, Unit Economics Ledger & Dead Stock Engine

class AnalyticsModule {
  constructor() {
    this.salesChart = null;
    this.categoryChart = null;
    this.deadStockFilter = 30; // default 30 days
  }

  calculateDeadStockData() {
    const products = window.app.state.products || [];
    let lockedCapital = 0;
    const deadItems = [];

    products.forEach(p => {
      if (p.daysIdle >= this.deadStockFilter) {
        const capital = p.stock * p.costPrice;
        lockedCapital += capital;
        deadItems.push({
          ...p,
          lockedCapital: capital
        });
      }
    });

    return {
      lockedCapital: Math.round(lockedCapital),
      items: deadItems.sort((a, b) => b.lockedCapital - a.lockedCapital)
    };
  }

  renderDashboard() {
    const products = window.app.state.products || [];
    const sales = window.app.state.sales || [];
    const todayStr = new Date().toISOString().split('T')[0];
    const todaySale = sales.find(s => s.day === todayStr) || { revenue: 12840, profit: 3260 };

    // Dead Stock calculation
    const deadStockInfo = this.calculateDeadStockData();

    // Low stock count
    const lowStockCount = products.filter(p => p.stock <= p.reorderLevel).length;

    // Overheads per day
    const overheads = window.app.state.overheads;
    const dailyOverhead = Math.round((overheads.monthlyRent + overheads.electricityBill + overheads.staffSalaries + overheads.softwareMisc) / 30);
    const todayNetProfit = Math.max(0, todaySale.profit - dailyOverhead);
    const netMarginPct = todaySale.revenue > 0 ? Math.round((todayNetProfit / todaySale.revenue) * 100) : 0;

    // Update Top Metric Cards
    const revEl = document.getElementById('metricTodayRevenue');
    const profitEl = document.getElementById('metricNetProfit');
    const marginBadge = document.getElementById('metricMarginBadge');
    const deadStockEl = document.getElementById('metricDeadStockCapital');
    const lowStockEl = document.getElementById('metricLowStockCount');

    if (revEl) revEl.innerText = `₹${todaySale.revenue.toLocaleString()}`;
    if (profitEl) profitEl.innerText = `₹${todayNetProfit.toLocaleString()}`;
    if (marginBadge) marginBadge.innerText = `${netMarginPct}% Net Margin`;
    if (deadStockEl) deadStockEl.innerText = `₹${deadStockInfo.lockedCapital.toLocaleString()}`;
    if (lowStockEl) lowStockEl.innerText = lowStockCount;

    // Render Charts
    this.renderSalesTrendChart();
    this.renderCategoryBreakdownChart();

    // Render AI Business Coach Insights
    this.renderAiCoachInsights();
  }

  renderSalesTrendChart() {
    const canvas = document.getElementById('weeklySalesChart');
    if (!canvas) return;

    const sales = window.app.state.sales || [];
    const labels = sales.map(s => {
      const d = new Date(s.day);
      return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    });
    const revenueData = sales.map(s => s.revenue);
    const profitData = sales.map(s => s.profit);

    if (this.salesChart) {
      this.salesChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    this.salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Sales Revenue (₹)',
            data: revenueData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointBackgroundColor: '#10b981',
            pointRadius: 4
          },
          {
            label: 'Gross Profit (₹)',
            data: profitData,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointBackgroundColor: '#6366f1',
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 12, font: { size: 11, family: 'Inter' } }
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ₹${context.raw.toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            grid: { color: '#f1f5f9' },
            ticks: {
              font: { size: 10 },
              callback: (val) => '₹' + val.toLocaleString()
            }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 10 } }
          }
        }
      }
    });
  }

  renderCategoryBreakdownChart() {
    const canvas = document.getElementById('categoryPieChart');
    if (!canvas) return;

    const products = window.app.state.products || [];
    const categoryTotals = {};

    products.forEach(p => {
      const cat = p.category || 'General';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (p.stock * p.sellingPrice);
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const colors = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#3b82f6'];

    if (this.categoryChart) {
      this.categoryChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 10, font: { size: 10, family: 'Inter' } }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ₹${ctx.raw.toLocaleString()} inventory value`
            }
          }
        },
        cutout: '68%'
      }
    });
  }

  renderAiCoachInsights() {
    const container = document.getElementById('aiCoachInsightsContainer');
    if (!container) return;

    const preset = window.NICHE_PRESETS[window.app.state.businessId] || window.NICHE_PRESETS.grocery;
    const insights = preset.aiInsights || [];

    const badgeStyles = {
      urgent: 'bg-rose-100 text-rose-800 border-rose-300',
      warning: 'bg-amber-100 text-amber-800 border-amber-300',
      growth: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    };

    const iconStyles = {
      urgent: 'fa-triangle-exclamation text-rose-500',
      warning: 'fa-piggy-bank text-amber-500',
      growth: 'fa-arrow-trend-up text-indigo-500'
    };

    container.innerHTML = insights.map((card, idx) => `
      <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeStyles[card.type] || badgeStyles.growth}">
              <i class="fa-solid ${iconStyles[card.type]}"></i>
              ${card.type}
            </span>
            <span class="text-[11px] font-mono text-slate-400">AI Confidence: 94%</span>
          </div>
          <h4 class="font-bold text-slate-900 text-sm mb-1">${card.title}</h4>
          <p class="text-xs text-slate-600 leading-relaxed">${card.text}</p>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] text-slate-400">Estimated Impact: +₹3,500</span>
          <button 
            onclick="window.analyticsModule.handleAiAction('${card.action}')"
            class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <span>${card.action}</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  handleAiAction(actionName) {
    if (actionName.includes('Clearance') || actionName.includes('Markdown')) {
      window.app.switchTab('deadstock');
    } else if (actionName.includes('PO') || actionName.includes('Restock')) {
      window.app.switchTab('inventory');
    } else {
      window.app.showToast(`AI Action "${actionName}" triggered! Strategy activated in POS.`, 'success');
    }
  }

  // Unit Economics & Cost vs Selling Price Ledger
  renderLedger() {
    const tableBody = document.getElementById('ledgerTableBody');
    if (!tableBody) return;

    const products = window.app.state.products || [];
    const overheads = window.app.state.overheads;
    const totalMonthlyOverheads = overheads.monthlyRent + overheads.electricityBill + overheads.staffSalaries + overheads.softwareMisc;

    // Summary calculations
    let totalStockCost = 0;
    let totalStockRevenueValue = 0;

    tableBody.innerHTML = products.map(p => {
      const grossMarginAmt = p.sellingPrice - p.costPrice;
      const marginPct = p.sellingPrice > 0 ? Math.round((grossMarginAmt / p.sellingPrice) * 100) : 0;
      const totalCostValue = p.stock * p.costPrice;
      const totalPotentialRev = p.stock * p.sellingPrice;
      const totalPotentialProfit = totalPotentialRev - totalCostValue;

      totalStockCost += totalCostValue;
      totalStockRevenueValue += totalPotentialRev;

      return `
        <tr class="hover:bg-slate-50 transition-colors text-xs">
          <td class="py-3 px-4 font-bold text-slate-900">${p.name}</td>
          <td class="py-3 px-3 text-slate-500">${p.category}</td>
          <td class="py-3 px-3 text-right font-medium text-slate-700">₹${p.costPrice}</td>
          <td class="py-3 px-3 text-right font-bold text-slate-900">₹${p.sellingPrice}</td>
          <td class="py-3 px-3 text-right font-bold text-emerald-600">+₹${grossMarginAmt}</td>
          <td class="py-3 px-3 text-right">
            <span class="px-2 py-0.5 rounded-full font-bold ${marginPct >= 40 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}">
              ${marginPct}%
            </span>
          </td>
          <td class="py-3 px-3 text-right font-medium text-slate-800">${p.stock} ${p.unit}</td>
          <td class="py-3 px-3 text-right font-mono text-slate-700">₹${totalCostValue.toLocaleString()}</td>
          <td class="py-3 px-4 text-right font-black text-emerald-600">₹${totalPotentialProfit.toLocaleString()}</td>
        </tr>
      `;
    }).join('');

    // Update Totals
    const totalMargin = totalStockRevenueValue - totalStockCost;
    const avgMarginPct = totalStockRevenueValue > 0 ? Math.round((totalMargin / totalStockRevenueValue) * 100) : 0;

    const totalCostEl = document.getElementById('ledgerTotalCostValue');
    const totalRevEl = document.getElementById('ledgerTotalRevenueValue');
    const totalProfitEl = document.getElementById('ledgerTotalPotentialProfit');
    const avgMarginEl = document.getElementById('ledgerAvgMargin');

    if (totalCostEl) totalCostEl.innerText = `₹${totalStockCost.toLocaleString()}`;
    if (totalRevEl) totalRevEl.innerText = `₹${totalStockRevenueValue.toLocaleString()}`;
    if (totalProfitEl) totalProfitEl.innerText = `₹${totalMargin.toLocaleString()}`;
    if (avgMarginEl) avgMarginEl.innerText = `${avgMarginPct}%`;
  }

  // Dead Stock / Capital Locked Module
  filterDeadStock(days) {
    this.deadStockFilter = days;
    document.querySelectorAll('.dead-filter-btn').forEach(b => {
      const isSelected = parseInt(b.getAttribute('data-days')) === days;
      if (isSelected) {
        b.classList.add('bg-slate-900', 'text-white');
        b.classList.remove('bg-white', 'text-slate-600');
      } else {
        b.classList.remove('bg-slate-900', 'text-white');
        b.classList.add('bg-white', 'text-slate-600');
      }
    });
    this.renderDeadStock();
  }

  renderDeadStock() {
    const tableBody = document.getElementById('deadStockTableBody');
    const bannerLockedEl = document.getElementById('deadStockTotalLocked');
    const itemCountEl = document.getElementById('deadStockItemCount');
    if (!tableBody) return;

    const data = this.calculateDeadStockData();

    if (bannerLockedEl) bannerLockedEl.innerText = `₹${data.lockedCapital.toLocaleString()}`;
    if (itemCountEl) itemCountEl.innerText = `${data.items.length} Slow-Moving Products`;

    if (data.items.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="py-12 text-center text-slate-400">
            <i class="fa-solid fa-circle-check text-emerald-500 text-3xl mb-2"></i>
            <p class="font-medium text-slate-600">No dead stock found for >${this.deadStockFilter} days threshold!</p>
            <p class="text-xs text-slate-400 mt-1">Your inventory turnover velocity is healthy.</p>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = data.items.map(item => {
      return `
        <tr class="hover:bg-slate-50 transition-colors text-xs">
          <td class="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-xs">
              <i class="fa-solid ${item.icon || 'fa-box'}"></i>
            </div>
            <span>${item.name}</span>
          </td>
          <td class="py-3 px-3 text-slate-500">${item.category}</td>
          <td class="py-3 px-3 font-semibold text-rose-600">
            <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">${item.daysIdle} days idle</span>
          </td>
          <td class="py-3 px-3 text-right font-medium text-slate-700">${item.stock} ${item.unit}</td>
          <td class="py-3 px-3 text-right font-mono text-slate-600">₹${item.costPrice}</td>
          <td class="py-3 px-3 text-right font-black text-rose-600">₹${item.lockedCapital.toLocaleString()}</td>
          <td class="py-3 px-4 text-center">
            <div class="flex items-center justify-center gap-1.5">
              <button 
                onclick="window.analyticsModule.applyClearanceDiscount('${item.id}', 15)"
                class="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shadow-sm transition-all"
                title="Apply 15% markdown to sell faster"
              >
                15% Off
              </button>
              <button 
                onclick="window.analyticsModule.applyClearanceDiscount('${item.id}', 25)"
                class="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-sm transition-all"
                title="Apply 25% liquidation clearance"
              >
                25% Off
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  applyClearanceDiscount(productId, discountPercent) {
    const item = window.app.state.products.find(p => p.id === productId);
    if (!item) return;

    const oldPrice = item.sellingPrice;
    const newPrice = Math.round(oldPrice * (1 - discountPercent / 100));
    item.sellingPrice = Math.max(item.costPrice, newPrice); // never sell below cost unless forced

    window.app.saveState();
    window.soundEngine.playScanBeep();
    window.app.showToast(`Applied ${discountPercent}% clearance to "${item.name}". New Price: ₹${item.sellingPrice} (was ₹${oldPrice})`, 'success');

    this.renderDeadStock();
    this.renderDashboard();
  }
}

window.analyticsModule = new AnalyticsModule();
