(function () {
  /* ── FIND SCRIPT TAG & EXTRACT PARAMS ── */
  const scripts = document.querySelectorAll('script[src*="widget.js"]');
  const tag = scripts[scripts.length - 1];
  if (!tag) return;
  const src = tag.src;
  const p = new URLSearchParams(src.split('?')[1] || '');
  const CLIENT_ID = p.get('id');
  const BIZ_RAW = p.get('biz') ? decodeURIComponent(p.get('biz')) : 'AI Assistant';
  const BOT_NAME = p.get('bot') ? decodeURIComponent(p.get('bot')) : 'AI Assistant';
  const GREETING = p.get('greet') ? decodeURIComponent(p.get('greet')) : '';
  const INDUSTRY = p.get('ind') ? decodeURIComponent(p.get('ind')) : 'other';
  const STYLE = p.get('style') || 'classic';
  const SC = {
    classic: { btn:'50%',    panel:'20px', header:'20px 20px 0 0', avatar:'50%' },
    modern:  { btn:'14px',   panel:'12px', header:'12px 12px 0 0', avatar:'8px' },
    pill:    { btn:'999px',  panel:'24px', header:'24px 24px 0 0', avatar:'50%' },
    bold:    { btn:'4px',    panel:'4px',  header:'4px 4px 0 0',   avatar:'4px' },
  }[STYLE] || { btn:'50%', panel:'20px', header:'20px 20px 0 0', avatar:'50%' };

  // ─── LANGUAGE SYSTEM ───────────────────────────────────
  const LANGS = {
    en: { cc: 'gb', name: 'English',    aiName: 'English' },
    es: { cc: 'es', name: 'Español',    aiName: 'Spanish' },
    fr: { cc: 'fr', name: 'Français',   aiName: 'French' },
    de: { cc: 'de', name: 'Deutsch',    aiName: 'German' },
    it: { cc: 'it', name: 'Italiano',   aiName: 'Italian' },
    pt: { cc: 'pt', name: 'Português',  aiName: 'Portuguese' },
    nl: { cc: 'nl', name: 'Nederlands', aiName: 'Dutch' },
    da: { cc: 'dk', name: 'Dansk',      aiName: 'Danish' },
    sv: { cc: 'se', name: 'Svenska',    aiName: 'Swedish' },
    no: { cc: 'no', name: 'Norsk',      aiName: 'Norwegian' },
    fi: { cc: 'fi', name: 'Suomi',      aiName: 'Finnish' },
    pl: { cc: 'pl', name: 'Polski',     aiName: 'Polish' },
  };
  function widgetFlag(cc) {
    return '<img src="https://flagcdn.com/w40/' + cc + '.png" alt="" style="width:20px;height:15px;border-radius:2px;object-fit:cover;display:block"/>';
  }

  const STRINGS = {
    en: { online:'Online', placeholder:'Ask a question...', send:'Send', tagline:'Replies are instant', leadName:'Your name', leadEmail:'Your email address', leadStart:'Start Chatting →', leadSkip:'Skip for now', leadErr:'Please enter a valid name and email.', consent:'By chatting, you agree to your messages being processed to answer your questions.', privacy:'privacy notice' },
    es: { online:'En línea', placeholder:'Haz una pregunta...', send:'Enviar', tagline:'Respuestas instantáneas', leadName:'Tu nombre', leadEmail:'Tu correo electrónico', leadStart:'Iniciar chat →', leadSkip:'Saltar por ahora', leadErr:'Por favor introduce un nombre y correo válidos.', consent:'Al chatear, aceptas que tus mensajes se procesen para responder tus preguntas.', privacy:'aviso de privacidad' },
    fr: { online:'En ligne', placeholder:'Posez une question...', send:'Envoyer', tagline:'Réponses instantanées', leadName:'Votre nom', leadEmail:'Votre adresse e-mail', leadStart:'Commencer →', leadSkip:'Passer', leadErr:'Veuillez saisir un nom et un e-mail valides.', consent:'En discutant, vous acceptez que vos messages soient traités pour répondre à vos questions.', privacy:'avis de confidentialité' },
    de: { online:'Online', placeholder:'Stelle eine Frage...', send:'Senden', tagline:'Sofortige Antworten', leadName:'Dein Name', leadEmail:'Deine E-Mail-Adresse', leadStart:'Chat starten →', leadSkip:'Überspringen', leadErr:'Bitte gültigen Namen und E-Mail eingeben.', consent:'Durch den Chat stimmst du der Verarbeitung deiner Nachrichten zu.', privacy:'Datenschutzhinweis' },
    it: { online:'Online', placeholder:'Fai una domanda...', send:'Invia', tagline:'Risposte immediate', leadName:'Il tuo nome', leadEmail:'La tua email', leadStart:'Inizia chat →', leadSkip:'Salta per ora', leadErr:'Inserisci un nome e un\'email validi.', consent:'Chattando, accetti che i tuoi messaggi vengano elaborati per rispondere alle tue domande.', privacy:'informativa sulla privacy' },
    pt: { online:'Online', placeholder:'Faça uma pergunta...', send:'Enviar', tagline:'Respostas instantâneas', leadName:'Seu nome', leadEmail:'Seu e-mail', leadStart:'Iniciar chat →', leadSkip:'Pular por agora', leadErr:'Por favor insira nome e e-mail válidos.', consent:'Ao conversar, você concorda que suas mensagens sejam processadas para responder às suas perguntas.', privacy:'aviso de privacidade' },
    nl: { online:'Online', placeholder:'Stel een vraag...', send:'Verstuur', tagline:'Directe antwoorden', leadName:'Je naam', leadEmail:'Je e-mailadres', leadStart:'Start chat →', leadSkip:'Overslaan', leadErr:'Voer een geldige naam en e-mail in.', consent:'Door te chatten ga je akkoord dat je berichten verwerkt worden om je vragen te beantwoorden.', privacy:'privacyverklaring' },
    da: { online:'Online', placeholder:'Stil et spørgsmål...', send:'Send', tagline:'Øjeblikkelige svar', leadName:'Dit navn', leadEmail:'Din e-mailadresse', leadStart:'Start chat →', leadSkip:'Spring over', leadErr:'Indtast venligst et gyldigt navn og e-mail.', consent:'Ved at chatte accepterer du, at dine beskeder behandles for at besvare dine spørgsmål.', privacy:'privatlivspolitik' },
    sv: { online:'Online', placeholder:'Ställ en fråga...', send:'Skicka', tagline:'Omedelbara svar', leadName:'Ditt namn', leadEmail:'Din e-postadress', leadStart:'Starta chatt →', leadSkip:'Hoppa över', leadErr:'Ange ett giltigt namn och e-postadress.', consent:'Genom att chatta godkänner du att dina meddelanden behandlas för att besvara dina frågor.', privacy:'integritetspolicy' },
    no: { online:'Online', placeholder:'Still et spørsmål...', send:'Send', tagline:'Umiddelbare svar', leadName:'Ditt navn', leadEmail:'Din e-postadresse', leadStart:'Start chat →', leadSkip:'Hopp over', leadErr:'Vennligst skriv inn gyldig navn og e-post.', consent:'Ved å chatte godtar du at meldingene dine behandles for å svare på spørsmål.', privacy:'personvernerklæring' },
    fi: { online:'Verkossa', placeholder:'Esitä kysymys...', send:'Lähetä', tagline:'Välittömät vastaukset', leadName:'Nimesi', leadEmail:'Sähköpostiosoitteesi', leadStart:'Aloita chat →', leadSkip:'Ohita', leadErr:'Anna kelvollinen nimi ja sähköposti.', consent:'Keskustelemalla hyväksyt, että viestisi käsitellään kysymyksiisi vastaamiseksi.', privacy:'tietosuojailmoitus' },
    pl: { online:'Online', placeholder:'Zadaj pytanie...', send:'Wyślij', tagline:'Natychmiastowe odpowiedzi', leadName:'Twoje imię', leadEmail:'Twój adres e-mail', leadStart:'Rozpocznij czat →', leadSkip:'Pomiń', leadErr:'Wprowadź prawidłowe imię i e-mail.', consent:'Czatując, zgadzasz się, aby Twoje wiadomości były przetwarzane w celu odpowiedzi na pytania.', privacy:'polityka prywatności' },
  };

  // Detect language: localStorage > browser > English
  function detectLang() {
    const saved = localStorage.getItem('pluxbot_lang');
    if (saved && LANGS[saved]) return saved;
    const browser = (navigator.language || 'en').slice(0, 2);
    return LANGS[browser] ? browser : 'en';
  }

  let curLang = detectLang();
  function t(key) { return (STRINGS[curLang] && STRINGS[curLang][key]) || STRINGS.en[key] || key; }
  if (!CLIENT_ID) { console.warn('[Pluxbot] No id param found.'); return; }

  const API = 'https://pluxbot.com/api/chat';
  const SUPABASE_URL = 'https://hovegfnppibfqfrfwkwg.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdmVnZm5wcGliZnFmcmZ3a3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NzIyMDUsImV4cCI6MjA5NDI0ODIwNX0.JohvRjKPXoa00IpUprxY1xZHycrcFeFOGegxJNtBlYo';

  /* ── INDUSTRY CHIPS ── */
  const INDUSTRY_CHIPS = {
    restaurant: ['Do you take reservations?','What are your hours?','Do you have vegetarian options?','What\'s your most popular dish?'],
    salon:      ['How do I book an appointment?','What services do you offer?','How much does a haircut cost?','Do you do colour treatments?'],
    gym:        ['What are your membership prices?','Do you offer a free trial?','What classes do you have?','What are your opening hours?'],
    clinic:     ['How do I book an appointment?','Do you accept walk-ins?','What are your opening hours?','Where are you located?'],
    retail:     ['What are your opening hours?','Do you offer delivery?','What\'s your return policy?','Do you have gift cards?'],
    legal:      ['Do you offer free consultations?','What areas of law do you cover?','What are your fees?','How do I get started?'],
    realestate: ['Do you have properties available?','How do I book a viewing?','What areas do you cover?','What are your fees?'],
    other:      ['What are your hours?','What services do you offer?','How much does it cost?','Where are you located?'],
  };
  function getChips() { return INDUSTRY_CHIPS[INDUSTRY] || INDUSTRY_CHIPS['other']; }

  /* ── INJECT STYLES ── */
  const S = document.createElement('style');
  S.textContent = `
  #_ox*{box-sizing:border-box;margin:0;padding:0}
  #_ox-wrap{position:fixed;bottom:24px;right:24px;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif}
  #_ox-btn{width:60px;height:60px;border-radius:50%;cursor:pointer;background:rgba(255,255,255,0.22);backdrop-filter:blur(24px) saturate(2);-webkit-backdrop-filter:blur(24px) saturate(2);border:1.5px solid rgba(255,255,255,0.55);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;box-shadow:0 1px 0 rgba(255,255,255,0.7) inset,0 10px 40px rgba(0,0,0,0.22),0 2px 8px rgba(0,0,0,0.12);transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .3s}
  #_ox-btn::before{content:'';position:absolute;top:0;left:0;right:0;height:52%;background:linear-gradient(to bottom,rgba(255,255,255,0.42),transparent);border-radius:50% 50% 0 0;pointer-events:none}
  #_ox-btn:hover{transform:scale(1.1) translateY(-3px)}
  #_ox-btn:active{transform:scale(0.95)}
  #_ox-icon{font-size:24px;position:relative;z-index:1}
  #_ox-dot{position:absolute;bottom:4px;right:4px;width:13px;height:13px;border-radius:50%;background:#22c55e;border:2.5px solid rgba(255,255,255,0.9);box-shadow:0 0 8px rgba(34,197,94,0.7);animation:_ox-pulse 2.2s ease infinite}
  @keyframes _ox-pulse{0%,100%{box-shadow:0 0 8px rgba(34,197,94,0.7)}50%{box-shadow:0 0 16px rgba(34,197,94,0.9)}}
  #_ox-panel{position:absolute;bottom:76px;right:0;width:370px;height:540px;display:flex;flex-direction:column;border-radius:26px;overflow:hidden;background:rgba(248,250,255,0.78);backdrop-filter:blur(48px) saturate(2.2);-webkit-backdrop-filter:blur(48px) saturate(2.2);border:1px solid rgba(255,255,255,0.75);border-top-color:rgba(255,255,255,0.95);box-shadow:0 1px 0 rgba(255,255,255,0.9) inset,0 0 0 0.5px rgba(0,0,0,0.06),0 40px 100px rgba(0,0,0,0.2),0 10px 28px rgba(0,0,0,0.1);transform-origin:bottom right;transition:opacity .32s cubic-bezier(.16,1,.3,1),transform .32s cubic-bezier(.16,1,.3,1);opacity:0;transform:scale(.88) translateY(14px);pointer-events:none}
  #_ox-panel._ox-open{opacity:1;transform:scale(1) translateY(0);pointer-events:all}
  #_ox-hd{padding:14px 16px;background:rgba(255,255,255,0.55);border-bottom:1px solid rgba(0,0,0,0.055);display:flex;align-items:center;gap:11px;flex-shrink:0}
  #_ox-av{width:40px;height:40px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:rgba(255,255,255,0.95);position:relative;background:linear-gradient(155deg,rgba(80,130,220,0.85),rgba(30,60,160,0.9));border:1.5px solid rgba(255,255,255,0.55)}
  #_ox-av-dot{position:absolute;bottom:1px;right:1px;width:11px;height:11px;border-radius:50%;background:#22c55e;border:2px solid white}
  #_ox-hd-text{flex:1;min-width:0}
  #_ox-biz{font-size:14.5px;font-weight:700;letter-spacing:-0.025em;color:rgba(8,12,28,0.92);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #_ox-status{display:flex;align-items:center;gap:4px;margin-top:1px;font-size:11px;color:rgba(8,12,28,0.42)}
  #_ox-status-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:_ox-pulse 2.2s ease infinite}
  #_ox-brand{font-size:8.5px;font-weight:700;letter-spacing:.11em;text-transform:uppercase;color:rgba(8,12,28,0.25);text-align:right;line-height:1.4;flex-shrink:0}
  #_ox-close{width:28px;height:28px;border-radius:50%;flex-shrink:0;background:rgba(0,0,0,0.055);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;color:rgba(8,12,28,0.45);transition:background .18s}
  #_ox-close:hover{background:rgba(0,0,0,0.1);color:rgba(8,12,28,0.85)}
  #_ox-lead{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px 24px;gap:12px}
  #_ox-lead-icon{width:52px;height:52px;border-radius:50%;background:linear-gradient(155deg,rgba(80,130,220,0.15),rgba(30,60,160,0.2));border:1.5px solid rgba(80,130,220,0.25);display:flex;align-items:center;justify-content:center;font-size:22px}
  #_ox-lead h3{font-size:15px;font-weight:700;color:rgba(8,12,28,0.88);text-align:center;line-height:1.3}
  #_ox-lead p{font-size:12.5px;color:rgba(8,12,28,0.45);text-align:center;line-height:1.6}
  ._ox-lead-input{width:100%;padding:10px 14px;background:rgba(255,255,255,0.85);border:1px solid rgba(0,0,0,0.1);border-radius:14px;font-size:13.5px;color:rgba(8,12,28,0.85);font-family:inherit;outline:none;transition:border-color .2s}
  ._ox-lead-input::placeholder{color:rgba(8,12,28,0.32)}
  ._ox-lead-input:focus{border-color:rgba(80,130,220,0.45);box-shadow:0 0 0 3px rgba(80,130,220,0.1)}
  #_ox-lead-err{font-size:11.5px;color:rgba(200,50,50,0.8);text-align:center;display:none}
  #_ox-lead-btn{width:100%;padding:11px;border-radius:14px;background:rgba(8,12,28,0.88);border:none;cursor:pointer;font-size:13.5px;font-weight:600;color:rgba(255,255,255,0.92);font-family:inherit;transition:transform .2s,background .2s}
  #_ox-lead-btn:hover{background:rgba(8,12,28,1);transform:translateY(-1px)}
  #_ox-lead-skip{font-size:11px;color:rgba(8,12,28,0.3);cursor:pointer;background:none;border:none;font-family:inherit}
  #_ox-lead-skip:hover{color:rgba(8,12,28,0.55)}
  #_ox-msgs{flex:1;overflow-y:auto;padding:14px 14px 6px;display:flex;flex-direction:column;gap:9px;scroll-behavior:smooth}
  #_ox-msgs::-webkit-scrollbar{width:3px}
  #_ox-msgs::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.1);border-radius:3px}
  ._ox-row{display:flex;gap:7px;align-items:flex-end;animation:_ox-in .28s cubic-bezier(.16,1,.3,1)}
  @keyframes _ox-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  ._ox-row._ox-u{flex-direction:row-reverse}
  ._ox-mini-av{width:24px;height:24px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700}
  ._ox-mini-av._ox-bot-av{background:linear-gradient(155deg,rgba(80,130,220,0.2),rgba(30,60,160,0.3));border:1px solid rgba(80,130,220,0.25);color:rgba(30,60,160,0.7)}
  ._ox-mini-av._ox-u-av{background:rgba(8,12,28,0.08);border:1px solid rgba(8,12,28,0.1);color:rgba(8,12,28,0.4)}
  ._ox-bubble{max-width:76%;padding:9px 13px;font-size:13.5px;line-height:1.58}
  ._ox-bot ._ox-bubble{background:rgba(255,255,255,0.82);border:1px solid rgba(255,255,255,0.95);border-radius:18px 18px 18px 5px;color:rgba(8,12,28,0.85);box-shadow:0 2px 10px rgba(0,0,0,0.07)}
  ._ox-u ._ox-bubble{background:rgba(8,12,28,0.82);border-radius:18px 18px 5px 18px;color:rgba(255,255,255,0.92)}
  ._ox-typing{display:flex;gap:4px;align-items:center;padding:10px 13px}
  ._ox-typing i{width:6px;height:6px;border-radius:50%;background:rgba(8,12,28,0.28);display:block;animation:_ox-bounce 1.1s ease infinite}
  ._ox-typing i:nth-child(2){animation-delay:.14s}
  ._ox-typing i:nth-child(3){animation-delay:.28s}
  @keyframes _ox-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
  #_ox-chips{padding:4px 14px 10px;display:flex;flex-wrap:wrap;gap:5px;flex-shrink:0}
  ._ox-chip{padding:5px 11px;border-radius:18px;background:rgba(255,255,255,0.65);border:1px solid rgba(0,0,0,0.075);font-size:11.5px;color:rgba(8,12,28,0.65);cursor:pointer;font-weight:400;white-space:nowrap;transition:all .18s;font-family:inherit}
  ._ox-chip:hover{background:rgba(255,255,255,0.9);color:rgba(8,12,28,0.88);transform:translateY(-1px)}
  #_ox-foot{padding:10px 12px;flex-shrink:0;border-top:1px solid rgba(0,0,0,0.055);background:rgba(255,255,255,0.45);display:flex;align-items:center;gap:8px}
  #_ox-in{flex:1;background:rgba(255,255,255,0.75);border:1px solid rgba(0,0,0,0.085);border-radius:20px;padding:8px 14px;font-size:13.5px;color:rgba(8,12,28,0.85);outline:none;font-family:inherit;transition:border-color .2s}
  #_ox-in::placeholder{color:rgba(8,12,28,0.32)}
  #_ox-in:focus{background:rgba(255,255,255,0.95);border-color:rgba(80,130,220,0.45);box-shadow:0 0 0 3px rgba(80,130,220,0.1)}
  #_ox-send{width:36px;height:36px;border-radius:50%;flex-shrink:0;background:rgba(8,12,28,0.85);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s}
  #_ox-send:hover{background:rgba(8,12,28,1);transform:scale(1.07)}
  #_ox-send svg{width:14px;height:14px;fill:none;stroke:rgba(255,255,255,0.9);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  #_ox-tag{padding:5px;text-align:center;flex-shrink:0;font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(8,12,28,0.2);background:rgba(255,255,255,0.3);border-top:1px solid rgba(0,0,0,0.035)}
  @media(max-width:440px){#_ox-wrap{bottom:16px;right:12px;left:12px}#_ox-panel{width:100%;right:0;left:0;bottom:72px;border-radius:20px}}
  `;
  document.head.appendChild(S);
  // Dynamic shape style
  const dynSt = document.createElement('style');
  dynSt.textContent = [
    '#_ox-btn{border-radius:'+SC.btn+'!important;'+(STYLE==='pill'?'width:120px!important;height:44px!important;':'')+'} ',
    '#_ox-panel{border-radius:'+SC.panel+'!important;} ',
    '#_ox-header{border-radius:'+SC.header+'!important;} ',
    '#_ox-av,._ox-mini-av{border-radius:'+SC.avatar+'!important;} ',
  ].join('');
  document.head.appendChild(dynSt);

  // Language picker: build the grid and handle clicks
  function buildLangMenu() {
    const grid = document.getElementById('_ox-lang-grid');
    if (!grid) return;
    grid.innerHTML = Object.entries(LANGS).map(([code, l]) => 
      `<button data-lang="${code}" title="${l.name}" style="background:${code===curLang?'rgba(91,142,232,0.25)':'transparent'};border:none;cursor:pointer;padding:8px;border-radius:8px;display:flex;align-items:center;justify-content:center;transition:background 0.15s">${widgetFlag(l.cc)}</button>`
    ).join('');
    grid.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        const newLang = b.dataset.lang;
        if (newLang === curLang) return;
        curLang = newLang;
        localStorage.setItem('pluxbot_lang', newLang);
        document.getElementById('_ox-lang').innerHTML = widgetFlag(LANGS[curLang].cc);
        document.getElementById('_ox-lang-menu').style.display = 'none';
        // Re-render UI strings
        applyTranslations();
        buildLangMenu();
      });
    });
  }

  function applyTranslations() {
    const stat = document.getElementById('_ox-status');
    if (stat) stat.innerHTML = '<div id="_ox-status-dot"></div>' + t('online') + ' · ' + BOT_NAME;
    const nameInput = document.getElementById('_ox-lead-name');
    if (nameInput) nameInput.placeholder = t('leadName');
    const emailInput = document.getElementById('_ox-lead-email');
    if (emailInput) emailInput.placeholder = t('leadEmail');
    const leadBtn = document.getElementById('_ox-lead-btn');
    if (leadBtn) leadBtn.textContent = t('leadStart');
    const leadSkip = document.getElementById('_ox-lead-skip');
    if (leadSkip) leadSkip.textContent = t('leadSkip');
    const leadErr = document.getElementById('_ox-lead-err');
    if (leadErr) leadErr.textContent = t('leadErr');
    const inp = document.getElementById('_ox-in');
    if (inp) inp.placeholder = t('placeholder');
    const tag = document.getElementById('_ox-tag');
    if (tag) tag.innerHTML = 'Pluxbot · ' + t('tagline');
    const consent = document.getElementById('_ox-consent');
    if (consent) consent.innerHTML = t('consent') + ' <a href="https://pluxbot.com/privacy" target="_blank" style="color:rgba(80,130,220,0.7);text-decoration:underline">' + t('privacy') + '</a>.';
  }

  // Open/close dropdown
  setTimeout(() => {
    const langBtn = document.getElementById('_ox-lang');
    const langMenu = document.getElementById('_ox-lang-menu');
    if (langBtn && langMenu) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langMenu.style.display = langMenu.style.display === 'none' ? 'block' : 'none';
        if (langMenu.style.display === 'block') buildLangMenu();
      });
      document.addEventListener('click', (e) => {
        if (!langMenu.contains(e.target) && e.target !== langBtn) {
          langMenu.style.display = 'none';
        }
      });
    }
    buildLangMenu();
  }, 200);

  /* ── BUILD HTML ── */
  const wrap = document.createElement('div');
  wrap.id = '_ox-wrap';
  const initLetter = BIZ_RAW.charAt(0).toUpperCase();

  wrap.innerHTML = `
    <div id="_ox-panel">
      <div id="_ox-hd">
        <div id="_ox-av"><span>${initLetter}</span><div id="_ox-av-dot"></div></div>
        <div id="_ox-hd-text">
          <div id="_ox-biz">${BIZ_RAW}</div>
          <div id="_ox-status"><div id="_ox-status-dot"></div>${t('online')} · ${BOT_NAME}</div>
        </div>
        <div id="_ox-brand">Powered by<br/>Pluxbot</div>
        <button id="_ox-lang" aria-label="Change language" style="background:none;border:none;cursor:pointer;font-size:18px;padding:4px 6px;margin-right:2px;line-height:1;opacity:0.85">${widgetFlag(LANGS[curLang].cc)}</button><button id="_ox-close">✕</button>
      </div>
      <div id="_ox-lead">
        <div id="_ox-lead-icon">👋</div>
        <h3>Before we chat…</h3>
        <p>Drop your name and email so ${BIZ_RAW} can follow up with you if needed.</p>
        <input class="_ox-lead-input" id="_ox-lead-name" type="text" placeholder="${t('leadName')}" autocomplete="name"/>
        <input class="_ox-lead-input" id="_ox-lead-email" type="email" placeholder="${t('leadEmail')}" autocomplete="email"/>
        <div id="_ox-lead-err">${t('leadErr')}</div>
        <button id="_ox-lead-btn">${t('leadStart')}</button>
        <button id="_ox-lead-skip">${t('leadSkip')}</button>
        <div id="_ox-consent" style="font-size:10px;color:rgba(8,12,28,0.4);text-align:center;line-height:1.5;margin-top:8px;max-width:280px">${t('consent')} <a href="https://pluxbot.com/privacy" target="_blank" style="color:rgba(80,130,220,0.7);text-decoration:underline">${t('privacy')}</a>.</div>
      </div>
      <div id="_ox-msgs" style="display:none"></div>
      <div id="_ox-chips" style="display:none"></div>
      <div id="_ox-foot" style="display:none">
        <input id="_ox-in" type="text" placeholder="${t('placeholder')}" autocomplete="off"/>
        <button id="_ox-send"><svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
      </div>
      <div id="_ox-tag">Pluxbot · ${t('tagline')}</div>
      <div id="_ox-lang-menu" style="display:none;position:absolute;top:54px;right:12px;background:rgba(20,24,38,0.98);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:8px;box-shadow:0 12px 32px rgba(0,0,0,0.4);z-index:10;max-width:200px">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px" id="_ox-lang-grid"></div>
      </div>
    </div>
    <div id="_ox-btn"><span id="_ox-icon">💬</span><div id="_ox-dot"></div></div>
  `;
  document.body.appendChild(wrap);

  /* ── ELEMENTS ── */
  const btn       = document.getElementById('_ox-btn');
  const panel     = document.getElementById('_ox-panel');
  const closeB    = document.getElementById('_ox-close');
  const msgs      = document.getElementById('_ox-msgs');
  const chips     = document.getElementById('_ox-chips');
  const input     = document.getElementById('_ox-in');
  const sendB     = document.getElementById('_ox-send');
  const foot      = document.getElementById('_ox-foot');
  const leadDiv   = document.getElementById('_ox-lead');
  const leadName  = document.getElementById('_ox-lead-name');
  const leadEmail = document.getElementById('_ox-lead-email');
  const leadBtn   = document.getElementById('_ox-lead-btn');
  const leadSkip  = document.getElementById('_ox-lead-skip');
  const leadErr   = document.getElementById('_ox-lead-err');

  let open=false,waiting=false,greeted=false,history=[],leadDone=false;
  let conversationId=null,visitorName='',visitorEmail='';

  /* ── OPEN / CLOSE ── */
  function openPanel(){open=true;panel.classList.add('_ox-open');document.getElementById('_ox-icon').textContent='✕';if(!leadDone){leadName.focus();}else{input.focus();if(!greeted){greet();greeted=true;}}}
  function closePanel(){open=false;panel.classList.remove('_ox-open');document.getElementById('_ox-icon').textContent='💬';}
  btn.addEventListener('click',()=>open?closePanel():openPanel());
  closeB.addEventListener('click',closePanel);

  /* ── CONVERSATION TRANSCRIPT ── */
  async function createConversation(name,email){
    try{
      const res=await fetch(`${SUPABASE_URL}/rest/v1/conversations`,{
        method:'POST',
        headers:{'apikey':SUPABASE_ANON_KEY,'Authorization':`Bearer ${SUPABASE_ANON_KEY}`,'Content-Type':'application/json','Prefer':'return=representation'},
        body:JSON.stringify({client_id:CLIENT_ID,visitor_name:name||null,visitor_email:email||null,messages:[]})
      });
      const data=await res.json();
      if(data&&data[0])conversationId=data[0].id;
    }catch(e){console.warn('[Pluxbot] Could not create conversation:',e)}
  }

  async function updateConversation(){
    if(!conversationId||history.length===0)return;
    try{
      await fetch(`${SUPABASE_URL}/rest/v1/conversations?id=eq.${conversationId}`,{
        method:'PATCH',
        headers:{'apikey':SUPABASE_ANON_KEY,'Authorization':`Bearer ${SUPABASE_ANON_KEY}`,'Content-Type':'application/json'},
        body:JSON.stringify({messages:history,last_message_at:new Date().toISOString()})
      });
    }catch(e){console.warn('[Pluxbot] Could not update conversation:',e)}
  }

  /* ── LEAD CAPTURE ── */
  function startChat(){
    leadDiv.style.display='none';msgs.style.display='flex';chips.style.display='flex';foot.style.display='flex';
    leadDone=true;
    createConversation(visitorName,visitorEmail);
    if(!greeted){greet();greeted=true;}
    input.focus();
  }

  function saveLead(name,email){
    fetch(`${SUPABASE_URL}/rest/v1/leads`,{
      method:'POST',
      headers:{'apikey':SUPABASE_ANON_KEY,'Authorization':`Bearer ${SUPABASE_ANON_KEY}`,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify({client_id:CLIENT_ID,name:name,email:email})
    }).catch(e=>console.warn('[Pluxbot] Lead save failed:',e));
  }

  leadBtn.addEventListener('click',function(){
    const name=leadName.value.trim();const email=leadEmail.value.trim();
    const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(!name||!emailOk){leadErr.style.display='block';return;}
    leadErr.style.display='none';
    visitorName=name;visitorEmail=email;
    saveLead(name,email);
    startChat();
  });
  leadEmail.addEventListener('keydown',e=>{if(e.key==='Enter')leadBtn.click()});
  leadName.addEventListener('keydown',e=>{if(e.key==='Enter')leadEmail.focus()});
  leadSkip.addEventListener('click',startChat);

  /* ── GREETING ── */
  function greet(){
    addMsg('bot',GREETING||`Hi! 👋 I'm <strong>${BOT_NAME}</strong>, the ${BIZ_RAW} assistant. How can I help you today?`);
    showChips(getChips());
  }

  /* ── CHIPS ── */
  function showChips(questions){
    chips.innerHTML='';
    questions.forEach(q=>{
      const c=document.createElement('button');c.className='_ox-chip';c.textContent=q;
      c.addEventListener('click',()=>{chips.innerHTML='';sendMsg(q)});
      chips.appendChild(c);
    });
  }

  /* ── ADD MESSAGE ── */
  function addMsg(role,html){
    const row=document.createElement('div');row.className=`_ox-row ${role==='user'?'_ox-u':'_ox-bot'}`;
    const av=document.createElement('div');av.className=`_ox-mini-av ${role==='user'?'_ox-u-av':'_ox-bot-av'}`;av.textContent=role==='user'?'✦':initLetter;
    const bubble=document.createElement('div');bubble.className='_ox-bubble';bubble.innerHTML=html;
    row.appendChild(av);row.appendChild(bubble);msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;
    return row;
  }

  /* ── TYPING ── */
  function showTyping(){
    const row=document.createElement('div');row.className='_ox-row _ox-bot';row.id='_ox-typing-row';
    const av=document.createElement('div');av.className='_ox-mini-av _ox-bot-av';av.textContent=initLetter;
    const bubble=document.createElement('div');bubble.className='_ox-bubble _ox-bot';bubble.innerHTML='<div class="_ox-typing"><i></i><i></i><i></i></div>';
    row.appendChild(av);row.appendChild(bubble);msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;
  }
  function hideTyping(){const t=document.getElementById('_ox-typing-row');if(t)t.remove()}

  /* ── SEND MESSAGE ── */
  async function sendMsg(text){
    text=text.trim();if(!text||waiting)return;
    waiting=true;input.value='';chips.innerHTML='';
    addMsg('user',text);showTyping();
    history.push({role:'user',content:text});
    try{
      const res=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId:CLIENT_ID,messages:history,language:LANGS[curLang].aiName})});
      const data=await res.json();hideTyping();
      const answer=data.answer||"I'm not sure about that — please contact us directly.";
      addMsg('bot',answer);
      history.push({role:'assistant',content:answer});
      updateConversation();
    }catch(e){
      hideTyping();addMsg('bot','Sorry, something went wrong. Please try again or contact us directly.');history.pop();
    }
    waiting=false;
  }

  sendB.addEventListener('click',()=>sendMsg(input.value));
  input.addEventListener('keydown',e=>{if(e.key==='Enter')sendMsg(input.value)});

})();
