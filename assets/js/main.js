(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.hidden = expanded;
    });

    mobileMenu.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.hidden = true;
      });
    });
  }

  // Product division filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.filter;
      filterButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      productCards.forEach((card) => {
        const match = target === 'all' || card.dataset.category === target;
        card.hidden = !match;
      });
    });
  });

  // Native <dialog> RFQ modal
  const rfqDialog = document.getElementById('rfq-dialog');
  const rfqCategory = document.getElementById('rfq-category');
  const rfqForm = document.getElementById('rfq-form');
  const rfqCancel = document.getElementById('rfq-cancel');
  const rfqStatus = document.getElementById('rfq-status');

  if (rfqDialog) {
    document.querySelectorAll('[data-open-rfq]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const category = trigger.getAttribute('data-open-rfq');
        if (rfqCategory && category) {
          const match = Array.from(rfqCategory.options).find(
            (opt) => opt.value === category || opt.text.includes(category)
          );
          if (match) rfqCategory.value = match.value;
        }
        if (rfqStatus) {
          rfqStatus.hidden = true;
          rfqStatus.textContent = '';
        }
        rfqDialog.showModal();
      });
    });

    if (rfqCancel) {
      rfqCancel.addEventListener('click', () => rfqDialog.close('cancel'));
    }

    // Fallback light-dismiss for browsers without <dialog closedby="any">
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const outside = (e, dialog) => {
        const r = dialog.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      let pressedOutside = false;
      rfqDialog.addEventListener('pointerdown', (e) => {
        pressedOutside = outside(e, rfqDialog);
      });
      rfqDialog.addEventListener('pointerup', (e) => {
        if (pressedOutside && outside(e, rfqDialog)) rfqDialog.close('dismiss');
      });
    }

    rfqDialog.addEventListener('close', () => {
      rfqDialog.returnValue = '';
    });
  }

  if (rfqForm && rfqStatus) {
    rfqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(rfqForm);
      const name = data.get('name');
      const category = data.get('category');
      const hub = data.get('hub');
      const qty = data.get('quantity') || 'Not specified';
      const notes = data.get('notes') || 'None';

      rfqStatus.textContent = `Thank you, ${name}. Your ${category} inquiry (${hub}) is ready — opening your mail client to send to hello@moraprex.com.`;
      rfqStatus.hidden = false;

      const subject = encodeURIComponent(`Moraprex RFQ: ${category} (${hub})`);
      const body = encodeURIComponent(
        `Name: ${name}\nWork Email: ${data.get('email')}\nCategory: ${category}\nPreferred Hub: ${hub}\nEstimated Quantity: ${qty}\nNotes: ${notes}`
      );
      window.location.href = `mailto:hello@moraprex.com?subject=${subject}&body=${body}`;
    });
  }
})();
