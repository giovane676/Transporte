/* ==========================================================================
   PETROLOG — SCRIPT DE INTERAÇÕES E OLEODUTOS
   Design Refinado • Fundo Elegante com Petróleo Preto Fluido
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initIndustrialPipelineCanvas();
  initNavigation();
  initModalInteractions();
});

/* ==========================================================================
   1. OLEODUTOS INDUSTRIAIS RESTAURADOS (LÍQUIDO PRETO FLUIDO)
   ========================================================================== */
function initIndustrialPipelineCanvas() {
  const canvas = document.getElementById('pipelineCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const pipeSegments = [];

  function resize() {
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    buildPipes();
  }

  function buildPipes() {
    pipeSegments.length = 0;
    particles.length = 0;

    // Tubos industriais cortando a seção com elegância
    const pipeY1 = height * 0.28;
    const pipeY2 = height * 0.72;

    pipeSegments.push({
      x1: -20, y1: pipeY1, x2: width * 0.82, y2: pipeY1, radius: 12
    });

    pipeSegments.push({
      x1: width * 0.82, y1: pipeY1, x2: width * 0.82, y2: pipeY2, radius: 12
    });

    pipeSegments.push({
      x1: width * 0.82, y1: pipeY2, x2: width + 20, y2: pipeY2, radius: 12
    });

    // Ramo secundário suave
    pipeSegments.push({
      x1: -20, y1: pipeY2 + 35, x2: width * 0.45, y2: pipeY2 + 35, radius: 9
    });

    // Partículas de petróleo contínuas na cor PRETA
    for (let i = 0; i < 55; i++) {
      particles.push({
        segmentIndex: i % pipeSegments.length,
        t: Math.random(),
        speed: 0.0016 + Math.random() * 0.0018,
        size: 2.8 + Math.random() * 2.8,
        color: '#090D16' // Preto petróleo elegante
      });
    }
  }

  window.addEventListener('resize', resize);
  resize();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. Desenhar a tubulação metálica com juntas e acabamento industrial
    pipeSegments.forEach(pipe => {
      // Parede metálica externa
      ctx.beginPath();
      ctx.moveTo(pipe.x1, pipe.y1);
      ctx.lineTo(pipe.x2, pipe.y2);
      ctx.lineWidth = pipe.radius * 2;
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.14)';
      ctx.lineCap = 'round';
      ctx.stroke();

      // Interior do duto
      ctx.beginPath();
      ctx.moveTo(pipe.x1, pipe.y1);
      ctx.lineTo(pipe.x2, pipe.y2);
      ctx.lineWidth = pipe.radius * 1.35;
      ctx.strokeStyle = 'rgba(241, 245, 249, 0.9)';
      ctx.stroke();
    });

    // 2. Desenhar as partículas pretas de petróleo em fluxo contínuo
    particles.forEach(p => {
      p.t += p.speed;
      if (p.t > 1) {
        p.t = 0;
        if (p.segmentIndex < 2) {
          p.segmentIndex++;
        } else if (p.segmentIndex === 2) {
          p.segmentIndex = 0;
        }
      }

      const pipe = pipeSegments[p.segmentIndex];
      if (!pipe) return;

      const currentX = pipe.x1 + (pipe.x2 - pipe.x1) * p.t;
      const currentY = pipe.y1 + (pipe.y2 - pipe.y1) * p.t;

      ctx.save();
      ctx.beginPath();
      ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 3;
      ctx.fill();
      ctx.restore();
    });

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
