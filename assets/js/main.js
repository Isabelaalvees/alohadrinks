const WHATSAPP_NUMBER = '5519989390282';

function normalizeText(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function initMobileMenu() {
  const header = document.querySelector('header .container');
  const navbar = document.querySelector('.navbar');

  if (!header || !navbar || document.querySelector('.menu-toggle')) {
    return;
  }

  document.body.classList.add('nav-ready');
  navbar.id = navbar.id || 'menu-principal';

  const button = document.createElement('button');
  button.className = 'menu-toggle';
  button.type = 'button';
  button.setAttribute('aria-label', 'Abrir menu');
  button.setAttribute('aria-controls', navbar.id);
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = '<span></span><span></span><span></span>';

  header.insertBefore(button, navbar);

  button.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('menu-open');
    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    button.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  navbar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Abrir menu');
    });
  });
}

function initActiveNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.navbar a').forEach(link => {
    const linkPage = link.getAttribute('href')?.split('#')[0] || 'index.html';
    const isActive = linkPage === currentPage || (currentPage === '' && linkPage === 'index.html');

    link.classList.toggle('active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function initFooterYear() {
  document.querySelectorAll('.footer-bottom p').forEach(item => {
    item.innerHTML = `&copy; ${new Date().getFullYear()} Aloha Drinks. Todos os direitos reservados.`;
  });
}

function initFloatingWhatsApp() {
  if (document.querySelector('.whatsapp-float')) {
    return;
  }

  const link = document.createElement('a');
  link.className = 'whatsapp-float';
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Gostaria de solicitar um orçamento para meu evento.')}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', 'Chamar a Aloha Drinks no WhatsApp');
  link.textContent = 'WhatsApp';

  document.body.appendChild(link);
}

function initDrinkFilter() {
  const filterButtons = document.querySelectorAll('.categorias button');
  const drinks = document.querySelectorAll('.drink');
  const count = document.querySelector('.cardapio-count');

  if (!filterButtons.length || !drinks.length) {
    return;
  }

  const updateCount = () => {
    if (!count) {
      return;
    }

    const visible = [...drinks].filter(drink => !drink.classList.contains('is-hidden')).length;
    count.textContent = `${visible} opção${visible === 1 ? '' : 'es'} encontrada${visible === 1 ? '' : 's'}`;
  };

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = normalizeText(button.dataset.filter || button.textContent);

      filterButtons.forEach(item => item.classList.remove('active'));
      button.classList.add('active');

      drinks.forEach(drink => {
        const fallbackCategory = drink.querySelector('.drink-content p')?.textContent || '';
        const categories = normalizeText(drink.dataset.category || fallbackCategory);
        const shouldShow = category === 'todos' || (categories && (categories.includes(category) || category.includes(categories)));

        drink.classList.toggle('is-hidden', !shouldShow);

        if (shouldShow) {
          drink.style.animation = 'fadeIn 0.3s ease-in';
        }
      });

      updateCount();
    });
  });

  updateCount();
}

function initWhatsAppForms() {
  document.querySelectorAll('.contato-form form, .whatsapp-form').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const nome = data.get('nome') || '';
      const email = data.get('email') || '';
      const telefone = data.get('telefone') || '';
      const dataEvento = data.get('data_evento') || '';
      const tipoEvento = data.get('tipo_evento') || '';
      const convidados = data.get('convidados') || '';
      const mensagem = data.get('mensagem') || '';

      openWhatsApp(
        `Olá! Gostaria de solicitar um orçamento.\n\n` +
        `Nome: ${nome}\n` +
        `E-mail: ${email}\n` +
        `WhatsApp: ${telefone}\n` +
        `Data do evento: ${dataEvento}\n` +
        `Tipo de evento: ${tipoEvento}\n` +
        `Convidados: ${convidados}\n` +
        `Detalhes: ${mensagem}`
      );
    });
  });
}

function initDrinkQuoteButtons() {
  document.querySelectorAll('[data-drink]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const drink = link.dataset.drink;

      openWhatsApp(`Olá! Gostaria de incluir ${drink} no orçamento do meu evento.`);
    });
  });
}

function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    if (!question) {
      return;
    }

    question.addEventListener('click', () => {
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      item.classList.toggle('active');
    });
  });
}

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNavigation();
  initFooterYear();
  initFloatingWhatsApp();
  initDrinkFilter();
  initWhatsAppForms();
  initDrinkQuoteButtons();
  initFaq();
});
