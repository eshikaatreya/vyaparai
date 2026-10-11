// VyaparAI Checkout Flow, Soundbox Simulation & ESC/POS Thermal Receipt Engine

class CheckoutModule {
  constructor() {
    this.currentPaymentMethod = 'cash';
    this.cashTendered = 0;
    this.activeOrder = null;
  }

  openCheckoutModal() {
    const cart = window.app.state.cart || [];
    if (cart.length === 0) {
      window.app.showToast('Cart is empty. Add items first!', 'warning');
      return;
    }

    const modal = document.getElementById('checkoutModal');
    if (!modal) return;

    const totals = window.posModule.calculateTotals();
    this.activeTotals = totals;
    this.cashTendered = totals.grandTotal;

    modal.classList.remove('hidden');
    this.renderPaymentMethod('cash');
  }

  closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.add('hidden');
  }

  renderPaymentMethod(method) {
    this.currentPaymentMethod = method;

    // Toggle Payment Tabs
    document.querySelectorAll('.payment-tab-btn').forEach(btn => {
      const isSelected = btn.getAttribute('data-method') === method;
      if (isSelected) {
        btn.classList.add('bg-slate-900', 'text-white', 'shadow-sm');
        btn.classList.remove('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
      } else {
        btn.classList.remove('bg-slate-900', 'text-white', 'shadow-sm');
        btn.classList.add('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
      }
    });

    const body = document.getElementById('checkoutModalBody');
    if (!body) return;

    const totals = this.activeTotals;

    if (method === 'cash') {
      body.innerHTML = `
        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Bill Payable</span>
              <div class="text-2xl font-black text-slate-900">₹${totals.grandTotal.toLocaleString()}</div>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-500 uppercase font-bold tracking-wider">Estimated Profit</span>
              <div class="text-lg font-bold text-emerald-600">+₹${totals.estimatedProfit.toLocaleString()}</div>
            </div>
          </div>

          <!-- Cash Tendered Input -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Cash Tendered by Customer (₹)</label>
            <div class="relative">
              <span class="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
              <input 
                type="number" 
                id="cashTenderedInput" 
                value="${this.cashTendered}" 
                oninput="window.checkoutModule.handleCashInput(this.value)"
                class="w-full pl-8 pr-4 py-2.5 text-lg font-black text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <!-- Quick Denomination Chips -->
            <div class="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
              <button onclick="window.checkoutModule.setCashTendered(${totals.grandTotal})" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300">Exact</button>
              <button onclick="window.checkoutModule.setCashTendered(100)" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">₹100</button>
              <button onclick="window.checkoutModule.setCashTendered(200)" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">₹200</button>
              <button onclick="window.checkoutModule.setCashTendered(500)" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">₹500</button>
              <button onclick="window.checkoutModule.setCashTendered(1000)" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">₹1,000</button>
              <button onclick="window.checkoutModule.setCashTendered(2000)" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">₹2,000</button>
            </div>
          </div>

          <!-- Change Return Display Box -->
          <div id="cashReturnResultBox" class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            ${this.renderChangeCalculation(this.cashTendered, totals.grandTotal)}
          </div>

          <button 
            onclick="window.checkoutModule.completeOrder('Cash')"
            class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <i class="fa-solid fa-money-bill-wave"></i>
            <span>Confirm Cash Received & Print Receipt</span>
          </button>
        </div>
      `;
    } else if (method === 'upi') {
      body.innerHTML = `
        <div class="space-y-4 text-center">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div class="text-left">
              <span class="text-xs text-slate-500 uppercase font-bold tracking-wider">UPI Amount</span>
              <div class="text-2xl font-black text-slate-900">₹${totals.grandTotal.toLocaleString()}</div>
            </div>
            <div class="flex items-center gap-2 text-xs font-bold text-slate-600">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" class="h-4" alt="UPI" />
              <span>Instant QR</span>
            </div>
          </div>

          <!-- Soundbox Device Simulation Container -->
          <div id="soundboxContainer" class="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden transition-all duration-300">
            <!-- Simulated Soundbox Speaker Grill & Indicator -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span class="text-xs font-bold tracking-widest text-emerald-400 uppercase">Vyapar Smart Soundbox</span>
              </div>
              <span class="text-[11px] font-mono text-slate-400">4G LIVE</span>
            </div>

            <div class="bg-white p-4 rounded-2xl inline-block shadow-inner mx-auto mb-3">
              <!-- Inline High-Res SVG Dynamic QR -->
              <div class="w-40 h-40 flex items-center justify-center bg-white">
                <svg viewBox="0 0 100 100" class="w-full h-full">
                  <path d="M0,0 h30 v30 h-30 z M70,0 h30 v30 h-30 z M0,70 h30 v30 h-30 z" fill="#0f172a"/>
                  <path d="M10,10 h10 v10 h-10 z M80,10 h10 v10 h-10 z M10,80 h10 v10 h-10 z" fill="#10b981"/>
                  <path d="M40,10 h10 v20 h10 v-10 h10 v10 h-10 v20 h-20 z M10,40 h20 v10 h-10 v10 h10 v10 h-20 z" fill="#0f172a"/>
                  <path d="M40,40 h20 v20 h-20 z M70,40 h10 v20 h-10 z M40,70 h30 v10 h-20 v10 h-10 z M80,80 h10 v10 h-10 z" fill="#0f172a"/>
                </svg>
              </div>
            </div>

            <div class="text-xs text-slate-300 font-mono">
              Scan with GPay, PhonePe, Paytm, or BHIM
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button 
              onclick="window.checkoutModule.simulateSoundboxWebhook()"
              class="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <i class="fa-solid fa-volume-high"></i>
              <span>Simulate Customer Scan & Voice Alert</span>
            </button>
          </div>
        </div>
      `;
    } else if (method === 'gateway') {
      body.innerHTML = `
        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
            <div>
              <span class="text-xs text-indigo-700 uppercase font-bold tracking-wider">Razorpay Gateway Simulation</span>
              <div class="text-2xl font-black text-indigo-950">₹${totals.grandTotal.toLocaleString()}</div>
            </div>
            <div class="text-right">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-200 text-indigo-800">Sandbox Mode</span>
            </div>
          </div>

          <div class="p-4 rounded-xl border border-slate-200 bg-white space-y-3 text-xs">
            <div class="flex items-center justify-between font-semibold text-slate-700">
              <span>Card / Netbanking / Wallets</span>
              <i class="fa-solid fa-shield-halved text-emerald-600"></i>
            </div>
            <input type="text" placeholder="Card Number (4111 2222 3333 4444)" value="4111 •••• •••• 1234" disabled class="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-mono" />
            <div class="grid grid-cols-2 gap-2">
              <input type="text" placeholder="MM/YY" value="12/28" disabled class="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-mono" />
              <input type="text" placeholder="CVV" value="•••" disabled class="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-mono" />
            </div>
          </div>

          <button 
            id="gatewayPayButton"
            onclick="window.checkoutModule.simulateGatewayPayment()"
            class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <i class="fa-solid fa-bolt"></i>
            <span>Pay ₹${totals.grandTotal.toLocaleString()} via Razorpay</span>
          </button>
        </div>
      `;
    }
  }

  handleCashInput(val) {
    this.cashTendered = parseFloat(val) || 0;
    const resultBox = document.getElementById('cashReturnResultBox');
    if (resultBox) {
      resultBox.innerHTML = this.renderChangeCalculation(this.cashTendered, this.activeTotals.grandTotal);
    }
  }

  setCashTendered(amount) {
    this.cashTendered = amount;
    const input = document.getElementById('cashTenderedInput');
    if (input) input.value = amount;
    const resultBox = document.getElementById('cashReturnResultBox');
    if (resultBox) {
      resultBox.innerHTML = this.renderChangeCalculation(this.cashTendered, this.activeTotals.grandTotal);
    }
  }

  renderChangeCalculation(tendered, total) {
    const diff = tendered - total;
    if (diff > 0) {
      return `
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs font-bold text-emerald-900 uppercase">Return Change to Customer</div>
            <div class="text-xs text-emerald-700">Tendered ₹${tendered} - Bill ₹${total}</div>
          </div>
          <div class="text-2xl font-black text-emerald-700">₹${diff.toLocaleString()}</div>
        </div>
      `;
    } else if (diff === 0) {
      return `
        <div class="flex items-center justify-between text-emerald-900">
          <div>
            <div class="text-xs font-bold uppercase">Exact Payment Tendered</div>
            <div class="text-xs text-emerald-700">No change required</div>
          </div>
          <i class="fa-solid fa-circle-check text-xl text-emerald-600"></i>
        </div>
      `;
    } else {
      return `
        <div class="flex items-center justify-between text-rose-900">
          <div>
            <div class="text-xs font-bold uppercase">Short Cash Amount</div>
            <div class="text-xs text-rose-600">Customer needs to pay ₹${Math.abs(diff)} more</div>
          </div>
          <div class="text-xl font-black text-rose-600">-₹${Math.abs(diff).toLocaleString()}</div>
        </div>
      `;
    }
  }

  simulateSoundboxWebhook() {
    const totals = this.activeTotals;
    const soundboxEl = document.getElementById('soundboxContainer');
    if (soundboxEl) {
      soundboxEl.classList.add('animate-soundbox-glow', 'ring-4', 'ring-emerald-400');
    }

    // Play Voice & Chime
    window.soundEngine.playUpiChime(totals.grandTotal);

    setTimeout(() => {
      if (soundboxEl) {
        soundboxEl.classList.remove('animate-soundbox-glow', 'ring-4', 'ring-emerald-400');
      }
      this.completeOrder('UPI Soundbox');
    }, 1400);
  }

  simulateGatewayPayment() {
    const btn = document.getElementById('gatewayPayButton');
    if (btn) {
      btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Processing Razorpay Webhook...`;
      btn.disabled = true;
    }

    setTimeout(() => {
      window.soundEngine.playCashDing();
      this.completeOrder('Razorpay');
    }, 1200);
  }

  completeOrder(paymentMethod) {
    const totals = this.activeTotals;
    const orderId = 'VYP-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();

    const order = {
      orderId: orderId,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      items: JSON.parse(JSON.stringify(window.app.state.cart)),
      totals: totals,
      paymentMethod: paymentMethod,
      cashier: window.app.currentRole === 'owner' ? window.app.state.ownerName : 'Cashier Shift 1'
    };

    // Deduct stock from products
    order.items.forEach(cItem => {
      const p = window.app.state.products.find(prod => prod.id === cItem.productId);
      if (p) {
        p.stock = Math.max(0, Math.round((p.stock - cItem.qty) * 100) / 100);
        p.daysIdle = 0; // reset idle
      }
    });

    // Update Cash Drawer if paid in Cash
    if (paymentMethod === 'Cash') {
      window.app.state.cashDrawer.cashSales += totals.grandTotal;
      window.app.state.cashDrawer.expectedCash += totals.grandTotal;
    }

    // Record in sales history
    const todayStr = order.date;
    const existingDaySales = window.app.state.sales.find(s => s.day === todayStr);
    if (existingDaySales) {
      existingDaySales.revenue += totals.grandTotal;
      existingDaySales.profit += totals.estimatedProfit;
    } else {
      window.app.state.sales.push({
        day: todayStr,
        revenue: totals.grandTotal,
        profit: totals.estimatedProfit
      });
    }

    // Save state & clear cart
    this.activeOrder = order;
    window.app.state.cart = [];
    window.app.saveState();
    window.posModule.renderCart();

    // Trigger celebration confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    this.closeCheckoutModal();
    this.openReceiptModal(order);
    window.app.showToast(`Order #${orderId} completed successfully via ${paymentMethod}!`, 'success');
  }

  openReceiptModal(order) {
    const modal = document.getElementById('receiptModal');
    const content = document.getElementById('thermalReceiptContent');
    if (!modal || !content) return;

    modal.classList.remove('hidden');

    content.innerHTML = `
      <div class="text-center mb-3">
        <h3 class="text-base font-black uppercase tracking-wider">${window.app.state.businessName}</h3>
        <p class="text-[11px] text-slate-600">${window.app.state.nicheTitle}</p>
        <p class="text-[10px] text-slate-500">GSTIN: 27AABCV1234F1Z8 | FSSAI: 1152100</p>
        <div class="border-b border-dashed border-slate-300 my-2"></div>
        <div class="flex justify-between text-[11px]">
          <span>Rcpt: #${order.orderId}</span>
          <span>${order.date} ${order.time}</span>
        </div>
        <div class="flex justify-between text-[11px] text-slate-500">
          <span>Staff: ${order.cashier}</span>
          <span>Pay: ${order.paymentMethod}</span>
        </div>
        <div class="border-b border-dashed border-slate-300 my-2"></div>
      </div>

      <!-- Itemized lines -->
      <table class="w-full text-[11px] mb-2">
        <thead>
          <tr class="border-b border-dashed border-slate-300 pb-1 text-left font-bold">
            <th class="py-1">ITEM</th>
            <th class="text-center py-1">QTY</th>
            <th class="text-right py-1">PRICE</th>
            <th class="text-right py-1">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(it => `
            <tr>
              <td class="py-1 pr-1 truncate max-w-[120px] font-medium">${it.name}</td>
              <td class="py-1 text-center">${it.qty}</td>
              <td class="py-1 text-right">₹${it.price}</td>
              <td class="py-1 text-right font-bold">₹${Math.round(it.price * it.qty)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="border-b border-dashed border-slate-300 my-2"></div>

      <!-- Totals -->
      <div class="space-y-1 text-[11px]">
        <div class="flex justify-between">
          <span>Subtotal:</span>
          <span>₹${order.totals.subtotal.toLocaleString()}</span>
        </div>
        ${order.totals.discount > 0 ? `
          <div class="flex justify-between text-emerald-700">
            <span>Discount:</span>
            <span>-₹${order.totals.discount.toLocaleString()}</span>
          </div>
        ` : ''}
        <div class="flex justify-between text-slate-600">
          <span>Tax (GST):</span>
          <span>₹${order.totals.tax.toLocaleString()}</span>
        </div>
        <div class="border-b border-dashed border-slate-300 my-1"></div>
        <div class="flex justify-between text-sm font-black pt-1">
          <span>GRAND TOTAL:</span>
          <span>₹${order.totals.grandTotal.toLocaleString()}</span>
        </div>
      </div>

      <div class="border-b border-dashed border-slate-300 my-3"></div>

      <div class="text-center text-[10px] text-slate-500 space-y-1">
        <p>*** THANK YOU FOR SHOPPING! ***</p>
        <p>Save this receipt for returns within 7 days.</p>
        <p class="font-mono pt-1 text-[9px]">Powered by VyaparAI Smart POS</p>
      </div>
    `;
  }

  closeReceiptModal() {
    const modal = document.getElementById('receiptModal');
    if (modal) modal.classList.add('hidden');
  }

  printReceipt() {
    window.print();
  }
}

window.checkoutModule = new CheckoutModule();
