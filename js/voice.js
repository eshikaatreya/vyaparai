// VyaparAI Voice Command Simulator & Natural Language Parsing Engine

class VoiceModule {
  constructor() {
    this.isListening = false;
    this.recognition = null;
    this.setupSpeechRecognition();
  }

  setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-IN'; // Indian English / Hinglish friendly

        this.recognition.onstart = () => {
          this.setListeningState(true);
        };

        this.recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          this.processVoiceCommand(transcript);
        };

        this.recognition.onerror = (event) => {
          console.warn('Speech recognition error:', event.error);
          this.setListeningState(false);
          window.app.showToast(`Voice input: ${event.error}. You can use quick simulation chips.`, 'warning');
        };

        this.recognition.onend = () => {
          this.setListeningState(false);
        };
      } catch (e) {
        console.warn('Speech recognition init failed', e);
      }
    }
  }

  toggleListening() {
    if (this.isListening) {
      if (this.recognition) this.recognition.stop();
      this.setListeningState(false);
    } else {
      if (this.recognition) {
        try {
          this.recognition.start();
        } catch (e) {
          // If already started or browser blocked, toggle simulation state
          this.setListeningState(true);
        }
      } else {
        // Fallback simulation toggle
        this.setListeningState(true);
        window.app.showToast('Microphone simulation active. Click any quick voice chip below!', 'info');
      }
    }
  }

  setListeningState(listening) {
    this.isListening = listening;
    const micButton = document.getElementById('voiceMicButton');
    const visualizer = document.getElementById('voiceVisualizer');
    const statusText = document.getElementById('voiceStatusText');

    if (micButton) {
      if (listening) {
        micButton.classList.add('bg-rose-600', 'ring-4', 'ring-rose-300', 'animate-pulse');
        micButton.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
      } else {
        micButton.classList.remove('bg-rose-600', 'ring-4', 'ring-rose-300', 'animate-pulse');
        micButton.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
      }
    }

    if (visualizer) {
      if (listening) visualizer.classList.remove('hidden');
      else visualizer.classList.add('hidden');
    }

    if (statusText) {
      statusText.innerText = listening ? 'Listening... Speak items and quantities now' : 'Click mic to speak, or tap quick simulator chips';
    }
  }

  // Pre-loaded chips tailored to active niche
  renderQuickVoiceChips() {
    const container = document.getElementById('voiceChipsContainer');
    if (!container) return;

    const niche = window.app.state.businessId;
    let chips = [];

    if (niche === 'grocery') {
      chips = [
        "Add 2 Aashirvaad Atta and 1 Toor Dal",
        "1.5 kg Basmati Rice and 2 Sunflower Oil",
        "Add 3 Maggi Packets and 2 Lay's Chips",
        "Add 1 Amul Butter and 2 Amul Milk"
      ];
    } else if (niche === 'crochet') {
      chips = [
        "Add 2 Daisy Amigurumi Bunny and 1 Bow Tote Bag",
        "3 Velvet Chenille Soft Yarn and 1 Crochet Kit",
        "Add 1 Granny Square Cardigan",
        "Add 2 Strawberry Bucket Hats"
      ];
    } else if (niche === 'cosmetic') {
      chips = [
        "Add 1 Niacinamide Serum and 2 Matte Lipsticks",
        "Add 2 Dewy Sunscreen Gel SPF 50",
        "Add 1 Vanilla Bourbon Perfume and 1 Clay Mask"
      ];
    } else if (niche === 'graphic_tshirt') {
      chips = [
        "Add 2 Cyber Samurai Tees and 1 Anime Hoodie",
        "Add 2 Tokyo Drifter Heavyweight Tees",
        "Add 1 Vintage Acid Wash Rock Tee"
      ];
    } else if (niche === 'cafe') {
      chips = [
        "Add 2 Samosas and 1 Cutting Chai",
        "Add 2 Cappuccino and 1 Truffle Croissant",
        "Add 2 Hazelnut Cold Coffee and 1 Brownie"
      ];
    } else {
      chips = [
        "Add 1 Fluted Ceramic Vase and 2 Scented Candles",
        "Add 2 Terracotta Indoor Planters",
        "Add 1 Boho Macrame Wall Hanging"
      ];
    }

    container.innerHTML = chips.map(chip => `
      <button 
        onclick="window.voiceModule.simulateVoicePhrase('${chip.replace(/'/g, "\\'")}')" 
        class="text-left px-3 py-1.5 rounded-xl bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-900 text-xs font-medium transition-all hover:scale-[1.02] flex items-center gap-1.5"
      >
        <i class="fa-solid fa-volume-high text-indigo-500 text-[10px]"></i>
        <span>"${chip}"</span>
      </button>
    `).join('');
  }

  simulateVoicePhrase(phrase) {
    const input = document.getElementById('voiceCustomInput');
    if (input) input.value = phrase;
    this.processVoiceCommand(phrase);
  }

  submitCustomVoiceInput() {
    const input = document.getElementById('voiceCustomInput');
    if (!input || !input.value.trim()) return;
    this.processVoiceCommand(input.value.trim());
    input.value = '';
  }

  // Natural Language & Fuzzy Keyword Extractor
  processVoiceCommand(text) {
    if (!text) return;
    this.setListeningState(false);

    const logBox = document.getElementById('voiceTranscriptBox');
    if (logBox) {
      logBox.innerText = `🎙️ "${text}"`;
      logBox.classList.remove('hidden');
    }

    const products = window.app.state.products || [];
    const normalized = text.toLowerCase();

    // Word to number mapping
    const wordNums = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      'half': 0.5, 'quarter': 0.25, 'a': 1, 'an': 1
    };

    // Split speech by conjunctions like "and", "plus", comma
    const phrases = normalized.split(/,|\band\b|\bplus\b|\balso\b/i);
    let matchedAny = false;
    const addedSummaries = [];

    phrases.forEach(phrase => {
      phrase = phrase.trim();
      if (!phrase) return;

      // Extract quantity: e.g. "1.5 kg", "2", "3", "half"
      let qty = 1;
      const qtyMatch = phrase.match(/(\d+(\.\d+)?)\s*(kg|gm|l|litre|pack|pcs|cup|plates|size)?/i);
      if (qtyMatch) {
        qty = parseFloat(qtyMatch[1]) || 1;
      } else {
        // check word numbers
        for (const [w, val] of Object.entries(wordNums)) {
          const reg = new RegExp(`\\b${w}\\b`, 'i');
          if (reg.test(phrase)) {
            qty = val;
            break;
          }
        }
      }

      // Keyword match against products
      let bestProduct = null;
      let highestMatchScore = 0;

      products.forEach(p => {
        const pTokens = p.name.toLowerCase().split(/\s+/).filter(t => t.length > 2);
        let score = 0;
        pTokens.forEach(t => {
          if (phrase.includes(t)) score += 2;
        });

        // Also match category
        if (phrase.includes(p.category.toLowerCase())) score += 1;

        if (score > highestMatchScore) {
          highestMatchScore = score;
          bestProduct = p;
        }
      });

      if (bestProduct && highestMatchScore >= 2) {
        window.posModule.addToCart(bestProduct.id, qty);
        addedSummaries.push(`${qty}x ${bestProduct.name}`);
        matchedAny = true;
      }
    });

    if (matchedAny) {
      window.soundEngine.playScanBeep();
      window.app.showToast(`Voice Assistant added: ${addedSummaries.join(', ')}`, 'success');
    } else {
      window.soundEngine.playWarning();
      window.app.showToast(`Could not recognize items in: "${text}". Try clicking quick chips!`, 'warning');
    }
  }
}

window.voiceModule = new VoiceModule();
