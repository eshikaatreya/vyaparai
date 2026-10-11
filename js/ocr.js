// VyaparAI Automated Supplier Invoice OCR & Damage Restock Workflow

class OcrModule {
  constructor() {
    this.isScanning = false;
    this.extractedInvoice = null;
  }

  renderOcrScreen() {
    this.renderShrinkageTable();
  }

  loadSampleInvoice() {
    const preset = window.NICHE_PRESETS[window.app.state.businessId] || window.NICHE_PRESETS.grocery;
    this.triggerOcrScan(preset.sampleInvoice);
  }

  simulateUpload() {
    const preset = window.NICHE_PRESETS[window.app.state.businessId] || window.NICHE_PRESETS.grocery;
    this.triggerOcrScan(preset.sampleInvoice);
  }

  triggerOcrScan(sampleData) {
    this.isScanning = true;
    const scannerOverlay = document.getElementById('ocrScannerOverlay');
    const statusText = document.getElementById('ocrStatusText');
    const resultContainer = document.getElementById('ocrResultsContainer');

    if (scannerOverlay) scannerOverlay.classList.remove('hidden');
    if (resultContainer) resultContainer.classList.add('hidden');
    if (statusText) statusText.innerText = 'Scanning supplier invoice with VyaparAI Computer Vision OCR...';

    window.soundEngine.playScanBeep();

    // Simulate 1.6s OCR processing
    setTimeout(() => {
      this.isScanning = false;
      this.extractedInvoice = JSON.parse(JSON.stringify(sampleData));

      if (scannerOverlay) scannerOverlay.classList.add('hidden');
      if (resultContainer) resultContainer.classList.remove('hidden');
      if (statusText) statusText.innerText = 'OCR Extraction Successful! Verify line items and damaged stock.';

      this.renderExtractedData();
      window.soundEngine.playCashDing();
      window.app.showToast('Invoice OCR completed: 3 line items parsed with discrepancy detection.', 'success');
    }, 1600);
  }

  renderExtractedData() {
    const inv = this.extractedInvoice;
    if (!inv) return;

    const vendorEl = document.getElementById('ocrVendorName');
    const invNoEl = document.getElementById('ocrInvoiceNumber');
    const dateEl = document.getElementById('ocrInvoiceDate');
    const totalEl = document.getElementById('ocrInvoiceTotal');
    const tbody = document.getElementById('ocrLineItemsBody');

    if (vendorEl) vendorEl.value = inv.vendor;
    if (invNoEl) invNoEl.value = inv.invoiceNumber;
    if (dateEl) dateEl.value = inv.date;
    if (totalEl) totalEl.value = `₹${inv.totalAmount.toLocaleString()}`;

    if (tbody) {
      tbody.innerHTML = inv.items.map((it, idx) => {
        const netAccepted = it.invoicedQty - (it.damagedQty || 0);
        return `
          <tr class="hover:bg-slate-50 transition-colors text-xs">
            <td class="py-3 px-4 font-bold text-slate-900">${it.name}</td>
            <td class="py-3 px-3 text-right font-medium text-slate-700">${it.invoicedQty}</td>
            <td class="py-3 px-3 text-right font-mono text-slate-700">₹${it.unitPrice}</td>
            <td class="py-3 px-3 text-right font-semibold text-slate-600">${it.taxPct}%</td>
            
            <!-- Damaged / Defective Input -->
            <td class="py-3 px-3 text-center">
              <input 
                type="number" 
                min="0" 
                max="${it.invoicedQty}"
                value="${it.damagedQty || 0}" 
                onchange="window.ocrModule.updateDamagedQty(${idx}, this.value)"
                class="w-16 py-1 px-2 text-center text-xs font-bold rounded-lg border ${
                  it.damagedQty > 0 ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-slate-300 bg-white text-slate-700'
                }"
              />
            </td>

            <!-- Defect Note -->
            <td class="py-3 px-3">
              <input 
                type="text" 
                value="${it.note || ''}" 
                onchange="window.ocrModule.updateItemNote(${idx}, this.value)"
                placeholder="Reason (e.g. transit leakage)"
                class="w-full py-1 px-2 text-[11px] rounded-lg border border-slate-200 bg-white"
              />
            </td>

            <!-- Net Valid Restock -->
            <td class="py-3 px-4 text-right font-black text-emerald-600">
              ${netAccepted} Units
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  updateDamagedQty(idx, val) {
    if (!this.extractedInvoice || !this.extractedInvoice.items[idx]) return;
    const damaged = Math.max(0, parseInt(val) || 0);
    this.extractedInvoice.items[idx].damagedQty = damaged;
    this.renderExtractedData();
  }

  updateItemNote(idx, note) {
    if (!this.extractedInvoice || !this.extractedInvoice.items[idx]) return;
    this.extractedInvoice.items[idx].note = note;
  }

  // Accept Restock Workflow
  commitRestock() {
    const inv = this.extractedInvoice;
    if (!inv) return;

    let totalRestocked = 0;
    let totalShrinkageLoss = 0;
    const newShrinkageRecords = [];

    inv.items.forEach(it => {
      const validQty = it.invoicedQty - (it.damagedQty || 0);
      const damagedQty = it.damagedQty || 0;

      // Find matching product in catalog or create new
      let product = window.app.state.products.find(p => p.name.toLowerCase() === it.name.toLowerCase() || it.name.toLowerCase().includes(p.name.toLowerCase()));
      if (product) {
        product.stock += validQty;
        product.costPrice = it.unitPrice; // update latest cost price
        totalRestocked += validQty;
      }

      // Log Shrinkage / Damaged items
      if (damagedQty > 0) {
        const lossAmount = damagedQty * it.unitPrice;
        totalShrinkageLoss += lossAmount;
        newShrinkageRecords.push({
          id: 'sh-' + Date.now() + '-' + Math.floor(Math.random() * 100),
          date: inv.date,
          itemName: it.name,
          qty: damagedQty,
          unitPrice: it.unitPrice,
          totalLoss: lossAmount,
          reason: it.note || 'Damaged in transit',
          vendor: inv.vendor,
          status: 'Credit Note Claim Filed'
        });
      }
    });

    // Append to app state shrinkage logs
    window.app.state.shrinkageLogs = [...newShrinkageRecords, ...(window.app.state.shrinkageLogs || [])];
    window.app.saveState();

    // Clear OCR preview
    document.getElementById('ocrResultsContainer')?.classList.add('hidden');
    this.extractedInvoice = null;

    window.soundEngine.playCashDing();
    window.app.showToast(`Restock confirmed: ${totalRestocked} units added to live inventory. ₹${totalShrinkageLoss.toLocaleString()} routed to Supplier Credit Note log!`, 'success');

    this.renderShrinkageTable();
    window.analyticsModule.renderDashboard();
  }

  renderShrinkageTable() {
    const tbody = document.getElementById('shrinkageTableBody');
    if (!tbody) return;

    const logs = window.app.state.shrinkageLogs || [];

    if (logs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="py-8 text-center text-slate-400 text-xs">
            No damaged goods or shrinkage recorded.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = logs.map(sh => `
      <tr class="hover:bg-slate-50 transition-colors text-xs">
        <td class="py-3 px-4 font-mono text-slate-500">${sh.date}</td>
        <td class="py-3 px-3 font-bold text-slate-900">${sh.itemName}</td>
        <td class="py-3 px-3 text-slate-600">${sh.vendor}</td>
        <td class="py-3 px-3 font-semibold text-rose-600">${sh.qty} Defective</td>
        <td class="py-3 px-3 text-slate-500 text-[11px]">${sh.reason}</td>
        <td class="py-3 px-3 font-black text-rose-600">₹${sh.totalLoss.toLocaleString()}</td>
        <td class="py-3 px-4 text-center">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            ${sh.status}
          </span>
        </td>
      </tr>
    `).join('');
  }
}

window.ocrModule = new OcrModule();
