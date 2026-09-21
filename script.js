/* ==========================================================================
   PETROLOG — SCRIPT DE INTERAÇÕES E OLEODUTOS
   Animação: Líquido de Petróleo Fluindo nos Tubos (sem bolinhas)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initOilPipelineCanvas();
  initNavigation();
  initModalInteractions();
});

/* ==========================================================================
   1. OLEODUTOS COM PETRÓLEO FLUINDO (GRADIENTE ANIMADO — SEM BOLINHAS)
   ========================================================================== */
function initOilPipelineCanvas() {
  const canvas = document.getElementById('pipelineCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animOffset = 0;

  // Definição dos tubos (x1,y1) → (x2,y2) e raio
  let pipes = [];

  function resize() {
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    buildPipes();
  }

  function buildPipes() {
    const y1 = height * 0.27;
    const y2 = height * 0.71;
    const cx = width * 0.80;

    pipes = [
      // Tubo principal superior (esquerda → dobra)
      { x1: -30, y1: y1, x2: cx, y2: y1, r: 13, horizontal: true },
      // Tubo vertical (dobra)
      { x1: cx, y1: y1, x2: cx, y2: y2, r: 13, horizontal: false },
      // Tubo principal inferior (dobra → direita)
      { x1: cx, y1: y2, x2: width + 30, y2: y2, r: 13, horizontal: true },
      // Ramo secundário menor
      { x1: -30, y1: y2 + 38, x2: width * 0.42, y2: y2 + 38, r: 9, horizontal: true },
    ];
  }

  window.addEventListener('resize', resize);
  resize();

  // Paleta do petróleo: preto viscoso com variação sutil
  const OIL_COLORS = [
    '#060A10',
    '#0D1220',
    '#111827',
    '#181F2E',
    '#0A0F1A',
    '#141C2B',
    '#060A10',
  ];

  function drawPipe(pipe) {
    const { x1, y1, x2, y2, r, horizontal } = pipe;

    // ── Sombra/borda externa metálica ──
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = r * 2 + 6;
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.22)';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // ── Corpo do tubo (metal cinza aço) ──
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = r * 2 + 2;
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.30)';
    ctx.stroke();

    // ── Interior com petróleo fluindo ──
    // Usamos um gradiente linear perpendicular ao tubo para dar a aparência
    // de cilindro cheio de óleo escuro. O deslocamento animOffset faz o
    // padrão de textura do petróleo deslizar suavemente.
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = r * 2 - 2;
    ctx.lineCap = 'round';

    if (horizontal) {
      // Gradiente vertical (cima→baixo) para cilindro horizontal
      const grad = ctx.createLinearGradient(0, y1 - r, 0, y1 + r);
      grad.addColorStop(0,    'rgba(20, 28, 43, 0.85)');
      grad.addColorStop(0.18, 'rgba(10, 15, 26, 0.92)');
      grad.addColorStop(0.45, 'rgba(6,  10, 16, 0.98)');
      grad.addColorStop(0.72, 'rgba(12, 18, 30, 0.94)');
      grad.addColorStop(1,    'rgba(22, 30, 48, 0.80)');
      ctx.strokeStyle = grad;
    } else {
      // Gradiente horizontal (esquerda→direita) para tubo vertical
      const grad = ctx.createLinearGradient(x1 - r, 0, x1 + r, 0);
      grad.addColorStop(0,    'rgba(20, 28, 43, 0.85)');
      grad.addColorStop(0.18, 'rgba(10, 15, 26, 0.92)');
      grad.addColorStop(0.45, 'rgba(6,  10, 16, 0.98)');
      grad.addColorStop(0.72, 'rgba(12, 18, 30, 0.94)');
      grad.addColorStop(1,    'rgba(22, 30, 48, 0.80)');
      ctx.strokeStyle = grad;
    }
    ctx.stroke();
    ctx.restore();

    // ── Textura do petróleo deslizando ──
    // Criamos um padrão de faixas sutis que se move com animOffset
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = r * 2 - 6;
    ctx.lineCap = 'round';

    if (horizontal) {
      // Faixas horizontais se movem da esquerda para a direita
      const length = Math.abs(x2 - x1) || 1;
      const dir = x2 > x1 ? 1 : -1;
      const off = (animOffset * dir) % 60;
      const gx1 = x1 + off;
      const gx2 = gx1 + 60;
      const stripGrad = ctx.createLinearGradient(gx1, y1, gx2, y1);
      stripGrad.addColorStop(0,    'rgba(6, 10, 16, 0)');
      stripGrad.addColorStop(0.3,  'rgba(20, 28, 48, 0.12)');
      stripGrad.addColorStop(0.55, 'rgba(30, 40, 64, 0.08)');
      stripGrad.addColorStop(0.8,  'rgba(10, 14, 24, 0.14)');
      stripGrad.addColorStop(1,    'rgba(6, 10, 16, 0)');
      ctx.strokeStyle = stripGrad;
    } else {
      // Faixas verticais descem (movimento para baixo)
      const off = animOffset % 60;
      const gy1 = y1 + off;
      const gy2 = gy1 + 60;
      const stripGrad = ctx.createLinearGradient(x1, gy1, x1, gy2);
      stripGrad.addColorStop(0,    'rgba(6, 10, 16, 0)');
      stripGrad.addColorStop(0.3,  'rgba(20, 28, 48, 0.12)');
      stripGrad.addColorStop(0.55, 'rgba(30, 40, 64, 0.08)');
      stripGrad.addColorStop(0.8,  'rgba(10, 14, 24, 0.14)');
      stripGrad.addColorStop(1,    'rgba(6, 10, 16, 0)');
      ctx.strokeStyle = stripGrad;
    }
    ctx.stroke();
    ctx.restore();

    // ── Reflexo especular no topo do tubo (highlight metálico) ──
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = r * 0.55;
    ctx.lineCap = 'round';

    if (horizontal) {
      const hiGrad = ctx.createLinearGradient(0, y1 - r, 0, y1);
      hiGrad.addColorStop(0, 'rgba(148, 163, 184, 0.18)');
      hiGrad.addColorStop(1, 'rgba(148, 163, 184, 0)');
      ctx.strokeStyle = hiGrad;
      // deslocar o highlight para cima do centro
      ctx.translate(0, -(r * 0.52));
    } else {
      const hiGrad = ctx.createLinearGradient(x1 - r, 0, x1, 0);
      hiGrad.addColorStop(0, 'rgba(148, 163, 184, 0.18)');
      hiGrad.addColorStop(1, 'rgba(148, 163, 184, 0)');
      ctx.strokeStyle = hiGrad;
      ctx.translate(-(r * 0.52), 0);
    }
    ctx.stroke();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Avança o offset de fluxo (velocidade suave)
    animOffset += 0.55;

    pipes.forEach(pipe => drawPipe(pipe));

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. NAVEGAÇÃO & MENU RESPONSIVO
   ========================================================================== */
function initNavigation() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const header = document.querySelector('.site-header');

  if (mobileBtn && drawer) {
    mobileBtn.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   3. MICRO-INTERAÇÕES DOS MODAIS
   ========================================================================== */
function initModalInteractions() {
  // Duto: Lançamento do PIG e Velocidade
  const pigBtn = document.getElementById('launchPigBtn');
  const pig = document.getElementById('smartPig');
  const speedSlider = document.getElementById('dutoSpeedSlider');
  const speedVal = document.getElementById('speedValue');
  const oilStream = document.querySelector('.oil-stream-black');

  if (pigBtn && pig) {
    let busy = false;
    pigBtn.addEventListener('click', () => {
      if (busy) return;
      busy = true;
      pigBtn.textContent = 'PIG em Varredura no Duto...';
      pig.style.left = '85%';

      setTimeout(() => {
        pig.style.left = '10%';
        pigBtn.textContent = 'Lançar PIG Inteligente';
        busy = false;
      }, 2200);
    });
  }

  if (speedSlider && oilStream) {
    speedSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      if (speedVal) speedVal.textContent = `${val}x`;
      const duration = (2.8 / val).toFixed(2);
      oilStream.style.animationDuration = `${duration}s`;
    });
  }

  // Rodoviário: Aceleração suave do caminhão
  const boostTruckBtn = document.getElementById('boostTruckBtn');
  const roadDashes = document.querySelector('.dashes-lane');

  if (boostTruckBtn && roadDashes) {
    let fast = false;
    boostTruckBtn.addEventListener('click', () => {
      fast = !fast;
      boostTruckBtn.textContent = fast ? 'Velocidade Padrão' : 'Acelerar Caminhão na Rodovia';
      roadDashes.style.animationDuration = fast ? '0.6s' : '1.2s';
    });
  }

  // Ferroviário: Contador de Vagões
  const addWagonBtn = document.getElementById('addWagonBtn');
  const wagonDisplay = document.getElementById('wagonCounterDisplay');

  if (addWagonBtn && wagonDisplay) {
    let wagons = 60;
    addWagonBtn.addEventListener('click', () => {
      wagons = wagons >= 120 ? 40 : wagons + 20;
      wagonDisplay.textContent = `${wagons} Vagões-Tanque`;
    });
  }
}
