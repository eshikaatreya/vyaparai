// VyaparAI Staff Permissions & EOD Cash Drawer Reconciliation

class EodModule {
  constructor() {
    this.denominations = {
      d2000: 0,
      d500: 0,
      d200: 0,
      d100: 0,
      d50: 0,
      d20: 0,
      d10: 0,
      coins: 0
    };
  }

  renderEodScreen() {
    const drawer = window.app.state.cashDrawer;
    
    // Set Drawer Stats
    document.getElementById('eodOpeningFloat').innerText = `₹${drawer.openingCash.toLocaleString()}`;
    document.getElementById('eodCashSales').innerText = `+₹${drawer.cashSales.toLocaleString()}`;
    document.getElementById('eodCashPayouts').innerText = `-₹${drawer.cashPayouts.toLocaleString()}`;
    document.getElementById('eodExpectedTotal').innerText = `₹${drawer.expectedCash.toLocaleString()}`;

    this.calculateDenominationTotal();
  }

  updateDenomination(denomKey, count) {
    count = Math.max(0, parseInt(count) || 0);
    this.denominations[denomKey] = count;
    this.calculateDenominationTotal();
  }

  calculateDenominationTotal() {
    const d = this.denominations;
    const totalPhysical = 
      (d.d2000 * 2000) +
      (d.d500 * 500) +
      (d.d200 * 200) +
      (d.d100 * 100) +
      (d.d50 * 50) +
      (d.d20 * 20) +
      (d.d10 * 10) +
      (d.coins * 1);

    const drawer = window.app.state.cashDrawer;
    const discrepancy = totalPhysical - drawer.expectedCash;

    const physicalEl = document.getElementById('eodPhysicalTotal');
    const discrepancyBox = document.getElementById('eodDiscrepancyBox');

    if (physicalEl) physicalEl.innerText = `₹${totalPhysical.toLocaleString()}`;

    if (discrepancyBox) {
      if (totalPhysical === 0) {
        discrepancyBox.innerHTML = `
          <div class="p-4 rounded-xl bg-slate-100 text-slate-500 text-xs text-center font-medium">
            Enter denomination counts above to verify cash reconciliation.
          </div>
        `;
      } else if (discrepancy === 0) {
        discrepancyBox.innerHTML = `
          <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-900">
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-circle-check text-2xl text-emerald-600"></i>
              <div>
                <div class="text-sm font-bold">100% Balanced Drawer! Exact Match</div>
                <div class="text-xs text-emerald-700">Physical cash matches system sales records perfectly.</div>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-black bg-emerald-200 text-emerald-900">₹0 Discrepancy</span>
          </div>
        `;
      } else if (discrepancy < 0) {
        discrepancyBox.innerHTML = `
          <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-900">
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-triangle-exclamation text-2xl text-rose-600"></i>
              <div>
                <div class="text-sm font-bold">Cash Shortage Detected!</div>
                <div class="text-xs text-rose-700">Physical cash is less than registered cash sales.</div>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-black bg-rose-200 text-rose-900">-₹${Math.abs(discrepancy).toLocaleString()} Shortage</span>
          </div>
        `;
      } else {
        discrepancyBox.innerHTML = `
          <div class="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-indigo-900">
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-circle-plus text-2xl text-indigo-600"></i>
              <div>
                <div class="text-sm font-bold">Cash Overage (Surplus)</div>
                <div class="text-xs text-indigo-700">Physical drawer has more cash than system records.</div>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-black bg-indigo-200 text-indigo-900">+₹${discrepancy.toLocaleString()} Excess</span>
          </div>
        `;
      }
    }

    return { totalPhysical, discrepancy };
  }

  submitReconciliation() {
    const { totalPhysical, discrepancy } = this.calculateDenominationTotal();
    
    if (totalPhysical === 0) {
      window.app.showToast('Please enter physical cash counts before submitting EOD', 'warning');
      return;
    }

    const drawer = window.app.state.cashDrawer;
    drawer.physicalCashCounted = totalPhysical;
    drawer.reconciled = true;
    drawer.discrepancy = discrepancy;
    drawer.lastEodDate = new Date().toISOString();

    window.app.saveState();
    window.soundEngine.playCashDing();

    window.app.showToast(`EOD Cash Drawer Reconciled! Status: ${discrepancy === 0 ? 'Exact Match' : discrepancy < 0 ? '₹' + Math.abs(discrepancy) + ' Shortage' : '₹' + discrepancy + ' Excess'}`, 'success');
  }

  // Preload realistic counts for 1-click testing
  autoFillExactCounts() {
    const drawer = window.app.state.cashDrawer;
    // Distribute expected cash e.g. 13300 across denominations
    this.denominations = {
      d2000: 2, // 4000
      d500: 14, // 7000
      d200: 8,  // 1600
      d100: 6,  // 600
      d50: 2,   // 100
      d20: 0,
      d10: 0,
      coins: 0
    };

    // Update DOM inputs
    for (const [key, val] of Object.entries(this.denominations)) {
      const input = document.getElementById(`denom_${key}`);
      if (input) input.value = val;
    }

    this.calculateDenominationTotal();
    window.app.showToast('Sample physical denomination counts auto-filled!', 'info');
  }
}

window.eodModule = new EodModule();
