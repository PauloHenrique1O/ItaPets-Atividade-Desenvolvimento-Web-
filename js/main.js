// JS do contato

document.addEventListener('DOMContentLoaded', () => {

  const form = document.querySelector('main.contato form');
  if (!form) return;

  const fldName = form.querySelector('#fname');
  const fldEmail = form.querySelector('#femail');
  const fldTel = form.querySelector('#ftel');
  const fldAssunto = form.querySelector('#assunto');
  const fldMotivo = form.querySelector('#motivo');
  const fldMessage = form.querySelector('#message');

  const btnSubmit = form.querySelector('input[type="submit"]');
  const btnReset = form.querySelector('input[type="reset"]');

  // ---------------------------
  // Ajuste de pattern do telefone
  // ---------------------------
  if (fldTel) {
    // aceita 11 dígitos puros OU máscara como "(11) 99999-9999"
    fldTel.setAttribute('pattern', '^\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}$');
    fldTel.setAttribute('title', 'Digite DDD + número (11 dígitos) ou no formato (11) 99999-9999');
  }

  // ---------------------------
  //  CONFIGURAÇÕES
  // ---------------------------
  const DRAFT_KEY = 'itapets_contact_draft_v1';
  const MAX_MESSAGE = parseInt(fldMessage.getAttribute('maxlength') || '1000', 10);

  // ---------------------------
  //  CRIAR CONTADOR DE CARACTERES
  // ---------------------------
  let counter = document.createElement('small');
  counter.id = 'messageCount';
  counter.style.display = 'block';
  counter.style.marginTop = '6px';
  counter.style.color = '#666';
  counter.textContent = `0 / ${MAX_MESSAGE}`;

  fldMessage.insertAdjacentElement('afterend', counter);

  // ---------------------------
  // TOAST SIMPLES
  // ---------------------------
  function toast(msg, ms = 1600) {
    const el = document.createElement('div');
    el.className = 'simple-toast';
    el.textContent = msg;

    document.body.appendChild(el);

    requestAnimationFrame(() => el.classList.add('visible'));

    setTimeout(() => el.classList.remove('visible'), ms - 200);
    setTimeout(() => el.remove(), ms);
  }

  // apenas dígitos
  const onlyDigits = s => (s || '').replace(/\D/g, '');

  // ---------------------------
  // RESTAURAR RASCUNHO
  // ---------------------------
  (function restore() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;

      const obj = JSON.parse(raw);

      if (obj.fname) fldName.value = obj.fname;
      if (obj.femail) fldEmail.value = obj.femail;
      if (obj.ftel) fldTel.value = obj.ftel;
      if (obj.assunto) fldAssunto.value = obj.assunto;
      if (obj.motivo) fldMotivo.value = obj.motivo;
      if (obj.message) fldMessage.value = obj.message;

      updateMessageCount();
    } catch (e) {
      // ignora erro
    }
  })();

  // ---------------------------
  // SALVAR RASCUNHO (debounce)
  // ---------------------------
  let saveTimer = null;

  function saveDraft() {
    clearTimeout(saveTimer);

    saveTimer = setTimeout(() => {
      const payload = {
        fname: fldName.value || '',
        femail: fldEmail.value || '',
        ftel: fldTel.value || '',
        assunto: fldAssunto.value || '',
        motivo: fldMotivo.value || '',
        message: fldMessage.value || ''
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    }, 300);
  }

  // ---------------------------
  // MÁSCARA DE TELEFONE (BR)
  // ---------------------------
  function maskPhone(e) {
    const el = e.target;
    let v = onlyDigits(el.value).slice(0, 11);

    if (v.length <= 2) {
      el.value = v;
    } else if (v.length <= 6) {
      el.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length <= 10) {
      el.value = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    } else {
      el.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    }
  }

  // ---------------------------
  // CONTADOR DE CARACTERES
  // ---------------------------
  function updateMessageCount() {
    counter.textContent = `${fldMessage.value.length} / ${MAX_MESSAGE}`;
  }

  // ---------------------------
  // MARCAR CAMPO INVÁLIDO
  // ---------------------------
  function setInvalid(el, flag = true) {
    if (!el) return;
    if (flag) el.classList.add('invalid');
    else el.classList.remove('invalid');
  }

  // ---------------------------
  // VALIDAÇÃO CUSTOMIZADA
  // ---------------------------
  function validate() {

    // limpa classes inválidas
    [fldName, fldEmail, fldTel, fldMessage, fldAssunto, fldMotivo]
      .forEach(i => i && setInvalid(i, false));

    let ok = true;

    if (!fldName.value.trim() || fldName.value.trim().length < 3) {
      setInvalid(fldName);
      ok = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(fldEmail.value || '')) {
      setInvalid(fldEmail);
      ok = false;
    }

    // telefone deve ter 11 dígitos
    if (onlyDigits(fldTel.value).length !== 11) {
      setInvalid(fldTel);
      ok = false;
    }

    if (!fldAssunto.value) {
      setInvalid(fldAssunto);
      ok = false;
    }

    if (!fldMotivo.value) {
      setInvalid(fldMotivo);
      ok = false;
    }

    if (!fldMessage.value.trim() || fldMessage.value.trim().length < 5) {
      setInvalid(fldMessage);
      ok = false;
    }

    return ok;
  }

  // ---------------------------
  // LISTENERS (input)
  // ---------------------------
  [fldName, fldEmail, fldTel, fldAssunto, fldMotivo, fldMessage].forEach(inp => {
    if (!inp) return;

    inp.addEventListener('input', (e) => {

      if (e.target === fldTel) maskPhone(e);
      if (e.target === fldMessage) updateMessageCount();

      setInvalid(e.target, false);
      saveDraft();
    });
  });

  // ---------------------------
  // SUBMIT
  // ---------------------------
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    if (!validate()) {
      toast('Corrija os campos marcados.');
      const first = form.querySelector('.invalid');
      if (first) first.focus();
      return;
    }

    const prevText = btnSubmit.value;
    btnSubmit.disabled = true;
    btnSubmit.value = 'Enviando...';

    // simulação de envio
    setTimeout(() => {
      localStorage.removeItem(DRAFT_KEY);
      form.reset();
      updateMessageCount();

      toast('Mensagem enviada (simulada). Obrigado!');

      btnSubmit.disabled = false;
      btnSubmit.value = prevText;
    }, 1200);
  });

  // ---------------------------
  // RESET: limpa rascunho
  // ---------------------------
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      localStorage.removeItem(DRAFT_KEY);
      setTimeout(updateMessageCount, 10);
    });
  }
});



