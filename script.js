/* =============================================
   GLOW BEAUTY — TEMPLATE ESTÉTICA
   Enrico Hoshii Dev Web — Campinas
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ---- HAMBURGER MOBILE ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Fechar ao clicar em link
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ---- REVEAL ON SCROLL ---- */
  // Stagger genérico: usa a posição do elemento entre os irmãos com [data-reveal],
  // então funciona igual em qualquer seção (masthead, catálogo, mural, etc).
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.children)
          .filter(el => el.hasAttribute('data-reveal'));
        const delay = siblings.indexOf(entry.target) * 90;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

  /* ---- CARROSSEL DE DEPOIMENTOS ---- */
  const depoimentosCarousel = document.getElementById('depoimentosCarousel');
  const depoimentosTrack = depoimentosCarousel?.querySelector('.pinboard-track');
  const depoimentosCards = [...(depoimentosTrack?.querySelectorAll('.note-card') || [])];
  const depoimentosPrev = document.getElementById('depoimentosPrev');
  const depoimentosNext = document.getElementById('depoimentosNext');
  const depoimentosStatus = document.getElementById('depoimentosStatus');

  if (depoimentosCarousel && depoimentosTrack && depoimentosCards.length) {
    let depoimentoAtual = 0;
    let scrollTimer;

    const quantidadeVisivel = () => window.matchMedia('(max-width: 768px)').matches ? 1 : 2;
    const indiceMaximo = () => Math.max(0, depoimentosCards.length - quantidadeVisivel());
    const passo = () => {
      const gap = parseFloat(getComputedStyle(depoimentosTrack).gap) || 0;
      return depoimentosCards[0].getBoundingClientRect().width + gap;
    };

    const atualizarControles = () => {
      depoimentoAtual = Math.min(depoimentoAtual, indiceMaximo());
      depoimentosPrev.disabled = depoimentoAtual === 0;
      depoimentosNext.disabled = depoimentoAtual === indiceMaximo();
      const primeiro = depoimentoAtual + 1;
      const ultimo = Math.min(depoimentoAtual + quantidadeVisivel(), depoimentosCards.length);
      depoimentosStatus.textContent = quantidadeVisivel() === 1
        ? `Depoimento ${primeiro} de ${depoimentosCards.length}`
        : `Depoimentos ${primeiro} e ${ultimo} de ${depoimentosCards.length}`;
    };

    const irParaDepoimento = (indice, comportamento = 'smooth') => {
      depoimentoAtual = Math.max(0, Math.min(indice, indiceMaximo()));
      depoimentosCarousel.scrollTo({ left: depoimentoAtual * passo(), behavior: comportamento });
      atualizarControles();
    };

    depoimentosPrev.addEventListener('click', () => irParaDepoimento(depoimentoAtual - 1));
    depoimentosNext.addEventListener('click', () => irParaDepoimento(depoimentoAtual + 1));
    depoimentosCarousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        irParaDepoimento(depoimentoAtual - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        irParaDepoimento(depoimentoAtual + 1);
      }
    });
    depoimentosCarousel.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        depoimentoAtual = Math.max(0, Math.min(Math.round(depoimentosCarousel.scrollLeft / passo()), indiceMaximo()));
        atualizarControles();
      }, 80);
    }, { passive: true });
    window.addEventListener('resize', () => irParaDepoimento(depoimentoAtual, 'auto'));

    atualizarControles();
  }

  /* ---- FAQ ACCORDION ---- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-pergunta');
    const resp = item.querySelector('.faq-resposta');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Fechar todos
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-resposta').style.maxHeight = null;
        openItem.querySelector('.faq-pergunta').setAttribute('aria-expanded', 'false');
      });
      // Abrir clicado (se estava fechado)
      if (!isOpen) {
        item.classList.add('open');
        resp.style.maxHeight = resp.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---- FILTRO RESULTADOS ---- */
  const filtroBtns = document.querySelectorAll('.filtro-btn');
  const resultadoCards = document.querySelectorAll('.resultado-card');

  filtroBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filtroBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filtro = btn.dataset.filtro;
      resultadoCards.forEach(card => {
        if (filtro === 'todos' || card.dataset.tipo === filtro) {
          card.classList.remove('hidden');
          setTimeout(() => card.style.opacity = '1', 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.classList.add('hidden'), 300);
        }
      });
    });
  });

  /* ---- COMPARADOR ANTES E DEPOIS ---- */
  document.querySelectorAll('.ad-comparison').forEach(comparison => {
    const slider = comparison.querySelector('.ad-slider');
    const updatePosition = () => {
      comparison.style.setProperty('--position', `${slider.value}%`);
    };

    slider.addEventListener('input', updatePosition);
    updatePosition();
  });

  /* ---- FORMULÁRIO ---- */
  const form = document.getElementById('contatoForm');
  const formSuccess = document.getElementById('formSuccess');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    // Coletar dados
    const nome = form.querySelector('#nome').value.trim();
    const tel = form.querySelector('#tel').value.trim();
    const msg = form.querySelector('#msg').value.trim();
    // Montar mensagem pro WhatsApp (fallback se não tiver backend)
    const texto = encodeURIComponent(
      `Olá, sou ${nome}!\n\nMeu WhatsApp: ${tel}${msg ? '\n\nMensagem: ' + msg : ''}`
    );

    const numero = '551932561900';

    // Se tiver backend, envie o form aqui (fetch/ajax)
    // Simulação de envio:
    await new Promise(r => setTimeout(r, 800));

    // Mostrar sucesso
    form.querySelectorAll('.form-group, button[type="submit"]').forEach(el => {
      el.style.display = 'none';
    });
    formSuccess.style.display = 'block';

    // Redirecionar pro WhatsApp após 1.5s
    setTimeout(() => {
      window.open(`https://wa.me/${numero}?text=${texto}`, '_blank');
    }, 1500);
  });

  /* ---- SMOOTH SCROLL OFFSET (navbar fixa) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
