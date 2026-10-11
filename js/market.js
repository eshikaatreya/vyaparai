// VyaparAI Market Intelligence & Niche Analytics Feed Engine

class MarketModule {
  constructor() {
    this.selectedMarketNiche = null;
  }

  renderMarketIntel() {
    this.selectedMarketNiche = this.selectedMarketNiche || window.app.state.businessId || 'grocery';

    const nicheSelector = document.getElementById('marketNicheSelector');
    if (nicheSelector) {
      nicheSelector.value = this.selectedMarketNiche;
    }

    const preset = window.NICHE_PRESETS[this.selectedMarketNiche] || window.NICHE_PRESETS.grocery;
    const trends = preset.marketTrends;

    // Set Title & Benchmark
    const titleEl = document.getElementById('marketTitleNiche');
    const badgeEl = document.getElementById('marketBenchmarkMargin');
    const shiftEl = document.getElementById('marketConsumerShift');
    const keywordsEl = document.getElementById('marketKeywordsContainer');
    const hotspotsEl = document.getElementById('marketHotspotsContainer');

    if (titleEl) titleEl.innerText = `${preset.name} Market Trends`;
    if (badgeEl) badgeEl.innerText = trends.benchmarkMargin;
    if (shiftEl) shiftEl.innerText = trends.consumerShift;

    // Render Trending Keywords Chips
    if (keywordsEl) {
      keywordsEl.innerHTML = trends.trendingKeywords.map(kw => `
        <div class="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span class="font-bold text-slate-800 text-xs">${kw}</span>
          </div>
          <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Trending Up</span>
        </div>
      `).join('');
    }

    // Render Regional Hotspots
    if (hotspotsEl) {
      hotspotsEl.innerHTML = trends.regionalHotspots.map(spot => `
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <div class="font-bold text-slate-900">${spot.region}</div>
            <div class="text-[11px] text-slate-500 mt-0.5">Top Velocity Item: <span class="font-semibold text-slate-700">${spot.topItem}</span></div>
          </div>
          <div class="text-right">
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Demand Score</div>
            <div class="text-base font-black text-emerald-600">${spot.demandScore}/100</div>
          </div>
        </div>
      `).join('');
    }
  }

  changeMarketNiche(nicheKey) {
    this.selectedMarketNiche = nicheKey;
    this.renderMarketIntel();
    window.app.showToast(`Switched market feed to ${window.NICHE_PRESETS[nicheKey]?.name}`, 'info');
  }
}

window.marketModule = new MarketModule();
