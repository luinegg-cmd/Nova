/* =========================================
   NOVA Invitaciones Digitales - Script
   ========================================= */

const state = {
  diseno: 'clasico',
  color: 'oro',
  evento: 'boda',
  eventoOtro: '',
  nombres: 'Nombres & Apellidos',
  fecha: '',
  lugar: '',
  musica: false,
  extras: ['qr', 'rsvp', 'qr-invitados', 'lector-entrada'],
};

const EVENT_LABELS = {
  boda: 'Boda',
  cumpleanos: 'Cumpleaños',
  'baby-shower': 'Baby Shower',
  graduacion: 'Graduación',
  xv: 'XV Años',
  corporativo: 'Evento Corporativo',
  otros: 'Otros',
};

const COLOR_LABELS = {
  oro: 'Oro',
  esmeralda: 'Esmeralda',
  rosa: 'Rosa Gold',
  azul: 'Zafiro',
  bordeaux: 'Borgoña',
  platino: 'Platino',
};

const DESIGNS = [
  { id: 'clasico', nombre: 'Clásico Real', desc: 'Bordes dorados y tipografía serif. Ideal para bodas elegantes.', style: { border: '#d4af37', bg: 'rgba(255,255,255,0.06)', text: '#ffffff', accent: '#d4af37' } },
  { id: 'moderno', nombre: 'Moderno Oscuro', desc: 'Estética oscura con acentos neón. Ideal para eventos corporativos.', style: { border: '#00ffff', bg: 'rgba(15,23,42,0.4)', text: '#00ffff', accent: '#00ffff' } },
  { id: 'minimal', nombre: 'Minimalista', desc: 'Limpio, blanco y sofisticado. Menos es más.', style: { border: '#e5e7eb', bg: 'rgba(255,255,255,0.1)', text: '#111', accent: '#6b7280' } },
  { id: 'tropical', nombre: 'Tropical', desc: 'Verdes frescos y vivos. Perfecto para baby showers.', style: { border: '#10b981', bg: 'rgba(220,252,231,0.15)', text: '#064e3b', accent: '#10b981' } },
  { id: 'real', nombre: 'Realeza', desc: 'Púrpura profundo y detalles majestuosos.', style: { border: '#7e22ce', bg: 'rgba(237,233,254,0.1)', text: '#5b21b6', accent: '#7e22ce' } },
];

/* Elementos DOM */
const designsGrid = document.getElementById('designsGrid');
const selEvento = document.getElementById('selEvento');
const grupoOtro = document.getElementById('grupoOtro');
const inpEventoOtro = document.getElementById('inpEventoOtro');
const colorPicker = document.getElementById('colorPicker');
const colorSelected = document.getElementById('colorSelected');
const inpNombres = document.getElementById('inpNombres');
const inpFecha = document.getElementById('inpFecha');
const inpLugar = document.getElementById('inpLugar');
const btnWhatsApp = document.getElementById('btnWhatsApp');
const pedidoForm = document.getElementById('pedidoForm');

const prevEvent = document.getElementById('prevEvent');
const prevNames = document.getElementById('prevNames');
const prevDate = document.getElementById('prevDate');
const prevLocation = document.getElementById('prevLocation');
const prevMusic = document.getElementById('prevMusic');
const inviteCard = document.getElementById('invitePreview');

const fDiseno = document.getElementById('fDiseno');
const fEvento = document.getElementById('fEvento');
const resumen = document.getElementById('resumenPedido');
const resDetalle = document.getElementById('resDetalle');
const resModulos = document.getElementById('resModulos');

const modulosBodas = document.getElementById('modulosBodas');

/* Modal ejemplos */
const exampleModal = document.getElementById('exampleModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalIframe = document.getElementById('modalIframe');
const modalTitle = document.getElementById('modalTitle');

function init() {
  renderDesigns();
  setupEventListeners();
  updatePreview();
  selectDesign('clasico');
  initCheckboxes();
  setupModal();
}

function renderDesigns() {
  designsGrid.innerHTML = DESIGNS.map(d => {
    const s = d.style;
    return `
      <div class="design-card ${d.id === state.diseno ? 'selected' : ''}" data-id="${d.id}">
        <div class="design-thumb" style="border:1px solid ${s.border}; background:${s.bg};">
          <div style="font-family:'Cinzel',serif; font-size:0.8rem; text-transform:uppercase; letter-spacing:2px; color:${s.accent || s.border}; margin-bottom:0.5rem;">${d.nombre.split(' ')[0]}</div>
          <div style="font-family:'Playfair Display',serif; font-size:1.15rem; color:${s.text}; font-style:italic;">${d.nombre}</div>
        </div>
        <div class="design-info">
          <h3>${d.nombre}</h3>
          <p>${d.desc}</p>
        </div>
      </div>
    `;
  }).join('');
}

function selectDesign(id) {
  state.diseno = id;
  document.querySelectorAll('.design-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.id === id);
  });
  fDiseno.value = DESIGNS.find(d => d.id === id).nombre;
  updatePreview();
}

function setupEventListeners() {
  designsGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.design-card');
    if (card) selectDesign(card.dataset.id);
  });

  selEvento.addEventListener('change', (e) => {
    state.evento = e.target.value;
    const esOtros = state.evento === 'otros';
    grupoOtro.style.display = esOtros ? 'block' : 'none';
    modulosBodas.style.display = state.evento === 'boda' ? 'block' : 'none';
    fEvento.value = esOtros ? (inpEventoOtro.value || 'Otros') : EVENT_LABELS[state.evento];
    updatePreview();
  });

  inpEventoOtro.addEventListener('input', (e) => {
    state.eventoOtro = e.target.value;
    fEvento.value = state.eventoOtro || 'Otros';
    updatePreview();
  });

  colorPicker.addEventListener('click', (e) => {
    const btn = e.target.closest('.color-option');
    if (!btn) return;
    document.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.color = btn.dataset.color;
    colorSelected.textContent = `Seleccionado: ${COLOR_LABELS[state.color]}`;
    applyColorTheme();
  });

  inpNombres.addEventListener('input', (e) => {
    state.nombres = e.target.value || 'Nombres & Apellidos';
    updatePreview();
  });

  inpFecha.addEventListener('input', (e) => {
    state.fecha = e.target.value;
    updatePreview();
  });

  inpLugar.addEventListener('input', (e) => {
    state.lugar = e.target.value || 'Lugar';
    updatePreview();
  });

  pedidoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendWhatsApp();
  });
}

function initCheckboxes() {
  // Delegación para módulos comunes
  const extrasList = document.querySelector('.extras-list');
  if (extrasList) {
    extrasList.addEventListener('change', (e) => {
      const cb = e.target;
      if (!cb || cb.type !== 'checkbox') return;
      toggleExtra(cb.value, cb.checked);
      state.musica = state.extras.includes('musica');
      updatePreview();
    });
  }

  // Delegación para módulos de boda
  if (modulosBodas) {
    modulosBodas.addEventListener('change', (e) => {
      const cb = e.target;
      if (!cb || cb.type !== 'checkbox') return;
      toggleExtra(cb.value, cb.checked);
      updatePreview();
    });
  }

  // Marcar los que vienen por defecto en state.extras
  state.extras.forEach(val => {
    const cb = document.querySelector(`.extras-list input[value="${val}"], #modulosBodas input[value="${val}"]`);
    if (cb) cb.checked = true;
  });
}

function toggleExtra(value, checked) {
  if (checked) {
    if (!state.extras.includes(value)) state.extras.push(value);
  } else {
    state.extras = state.extras.filter(x => x !== value);
  }
}

function applyColorTheme() {
  const colorMap = {
    oro: '#d4af37',
    esmeralda: '#0f766e',
    rosa: '#e879f9',
    azul: '#2563eb',
    bordeaux: '#7f1d1d',
    platino: '#e5e7eb',
  };
  const c = colorMap[state.color] || '#d4af37';
  const borderEl = inviteCard.querySelector('.i-border');
  if (borderEl) borderEl.style.borderColor = `rgba(212,175,55,0.6)`;
  const divider = inviteCard.querySelector('.i-divider');
  if (divider) divider.style.background = c;
  const eventEl = inviteCard.querySelector('.i-event');
  if (eventEl) eventEl.style.color = c;
}

function updatePreview() {
  const eventoTexto = state.evento === 'otros' ? (state.eventoOtro || 'Otros') : EVENT_LABELS[state.evento];
  prevEvent.textContent = eventoTexto;
  prevNames.textContent = state.nombres;
  prevDate.textContent = state.fecha ? formatDate(state.fecha) : 'Fecha del evento';
  prevLocation.textContent = state.lugar || 'Lugar';
  prevMusic.classList.toggle('visible', state.musica);
  const diseno = DESIGNS.find(d => d.id === state.diseno);
  inviteCard.style.background = diseno.style.bg;
  inviteCard.style.borderColor = diseno.style.border;
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('es-ES', options);
}

/* ===== Modal Ejemplos ===== */
function setupModal() {
  document.querySelectorAll('.example-card').forEach(card => {
    card.addEventListener('click', () => {
      const url = card.dataset.url;
      const title = card.dataset.title;
      openExample(url, title);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeExample);
  if (modalOverlay) modalOverlay.addEventListener('click', closeExample);

  // Cerrar con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && exampleModal && exampleModal.style.display === 'flex') {
      closeExample();
    }
  });
}

function openExample(url, title) {
  if (!exampleModal || !modalIframe || !modalTitle) return;
  modalTitle.textContent = title;
  modalIframe.src = url;
  exampleModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeExample() {
  if (!exampleModal || !modalIframe) return;
  exampleModal.style.display = 'none';
  modalIframe.src = '';
  document.body.style.overflow = '';
}

function sendWhatsApp() {
  const nombre = document.getElementById('fNombre').value.trim();
  const whatsapp = document.getElementById('fWhatsapp').value.trim();
  const email = document.getElementById('fEmail').value.trim();
  const mensaje = document.getElementById('fMensaje').value.trim();

  if (!nombre || !whatsapp || !email) {
    alert('Por favor completa los campos obligatorios.');
    return;
  }

  const numeroDestino = '527775457308'; // ⚠️ CAMBIA por tu número real con código de país (sin +)

  const disenoObj = DESIGNS.find(d => d.id === state.diseno);
  const eventoTexto = state.evento === 'otros' ? (state.eventoOtro || 'Otros') : EVENT_LABELS[state.evento];

  const modulosLabels = {
    qr: 'Código QR ubicación',
    rsvp: 'Confirmación WhatsApp',
    galeria: 'Galería de fotos',
    regalos: 'Mesa de regalos digital',
    musica: 'Canción de fondo',
    'qr-invitados': 'Generador QR invitados (Boda)',
    'lector-entrada': 'Lector QR pases entrada (Boda)',
  };

  const modulosTexto = state.extras.length > 0 ? state.extras.map(x => modulosLabels[x]).join(', ') : 'Ninguno';

  const lines = [
    '*💌 Nuevo Pedido - NOVA Invitaciones Digitales*',
    '',
    `*Cliente:* ${nombre}`,
    `*WhatsApp:* ${whatsapp}`,
    `*Correo:* ${email}`,
    `*Diseño:* ${disenoObj.nombre}`,
    `*Evento:* ${eventoTexto}`,
    `*Nombres:* ${state.nombres}`,
    `*Fecha:* ${state.fecha ? formatDate(state.fecha) : 'Por definir'}`,
    `*Lugar:* ${state.lugar || 'Por definir'}`,
    `*Módulos:* ${modulosTexto}`,
    '',
    mensaje ? `*Mensaje adicional:* ${mensaje}` : '',
    '',
    'Quedo atento/a a su confirmación. ¡Gracias por elegir NOVA! ✨',
  ].filter(l => l !== '').join('%0A');

  const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(lines)}`;
  window.open(url, '_blank');
}

init();



/* =========================================
   Carrusel de Galería
   ========================================= */
(function(){
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const total = slides.length;
  let currentIndex = 0;
  let autoplayInterval;

  // Crear dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Diapositiva ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.carousel-dot');

  function goTo(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
    resetAutoplay();
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function startAutoplay() {
    autoplayInterval = setInterval(next, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Pausar al pasar el mouse
  track.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  track.addEventListener('mouseleave', startAutoplay);

  // Iniciar
  startAutoplay();
})();