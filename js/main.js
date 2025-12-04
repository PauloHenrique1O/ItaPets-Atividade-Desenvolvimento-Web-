
// =========================================================
// 1. CÓDIGO JQUERY
// O bloco $(function() { ... }) é usado para garantir que o código
// só rode após o carregamento completo do DOM.
// =========================================================
$(function () {
  // ---------------------------
  // 1.1. animação carregamento da imagem usando jQuery
  $(".fade-img").css("opacity", 0);

  $(".fade-img").each(function () {
    $(this).on("load", function () {
      $(this).animate({ opacity: 1 }, 800);
    });

    //caso a imagem já tenha carregado rápido, vai disparar o load manualmente
    if (this.complete) {
      $(this).trigger("load");
    }
  });

  // ---------------------------
  // 1.2.scroll suave, quando clicar em 'ver descrição completa', usando jQuery
  $('a[href^="#"]').on('click', function (e) {
    e.preventDefault();
    const alvo = $($(this).attr('href'));

    if (alvo.length) {
      $('html, body').animate({
        scrollTop: alvo.offset().top
      }, 600);
    }
  });

  // =========================================================
// 1.3. modal de aviso quando comprar ou adicionar produto, usando Bootstrap e jQuery
// =========================================================

// vai verificar se existe o botão de Adicionar ou Comprar na página atual -> criei para excluir das paginas que nao forem dos produtos
if ($('#btnAdicionar').length > 0 || $('#btnComprar').length > 0) {
    
    //se os botões existirem (ou seja, estamos em uma página de produto),
    // o código abaixo será executado.
    
    const modalHTML = `
        <div class="modal fade" id="cartAlertModal" tabindex="-1" aria-labelledby="cartAlertModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="cartAlertModalLabel">Notificação</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Aguardando ação...
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
              </div>
            </div>
          </div>
        </div>
    `;

    $('body').append(modalHTML);
    $("#btnAdicionar, #btnComprar").on("click", function (e) {
        e.preventDefault();

        let modalText = "Produto adicionado ao carrinho!";
        if ($(this).attr('id') === 'btnComprar') {
          modalText = "Produto enviado para a finalização da compra!";
        }

        $("#cartAlertModal .modal-body").text(modalText);
        $("#cartAlertModal").modal('show');
    });
}

// ---------------------------
    // 1.4.funcionalidade quantidade e preço total na pagina do produto
    // ---------------------------
    const BASE_PRICE = parseFloat($('#preco').text().replace('R$ ', '').replace(',', '.')); //converto o preço string para numero

    const $quantidadeInput = $('#quantidade');
    const $precoTotalDisplay = $('#precoTotalDisplay');
    const $btnAumentar = $('#btnAumentar');
    const $btnDiminuir = $('#btnDiminuir');


    function formatarMoeda(valor) {
        return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    }

    function updatePrice() {
        let quantidade = parseInt($quantidadeInput.val());
        if (isNaN(quantidade) || quantidade < 1) {
            quantidade = 1;
            $quantidadeInput.val(1);
        }
        const novoTotal = quantidade * BASE_PRICE;
        $precoTotalDisplay.text(formatarMoeda(novoTotal));
    }

    // eventos de clique nos botoes de quantidade(+ e -)
    $btnAumentar.on('click', function() {
        let quantidadeAtual = parseInt($quantidadeInput.val());
        $quantidadeInput.val(quantidadeAtual + 1);
        updatePrice(); 
    });

    $btnDiminuir.on('click', function() {
        let quantidadeAtual = parseInt($quantidadeInput.val());
        if (quantidadeAtual > 1) {
            $quantidadeInput.val(quantidadeAtual - 1);
            updatePrice();
        }
    });
    updatePrice();

    // =========================================================
// 1.5.filtro de busca enquanto digita
// =========================================================

const $searchInput = $('#txtbusca');
const $productArticles = $('.lista-produtos article'); // todos os produtos dentro da div com a classe lista-produtos 

$searchInput.on('keyup', function() {
    // pego o termo de busca e o normaliza
    const searchTerm = $(this).val().toLowerCase().trim();

    $productArticles.each(function() {
        const $product = $(this);
        //o h3 e o p dentro do div.info são os alvos
        const productText = $product.find('.info h3').text().toLowerCase() + ' ' + 
                            $product.find('.info p').text().toLowerCase();

        if (productText.includes(searchTerm)) {
            if (!$product.is(':visible')) { 
                $product.slideDown(200); 
            }
        } else {
            if ($product.is(':visible')) {
                $product.slideUp(200); 
            }
        }
    });
    //se o campo estiver vazio vai mostra todos os produtos
    if (searchTerm === '') {
        $productArticles.slideDown(200);
    }
});


});


// =========================================================
// 2.codigo javaScript puro para o formulario de contato
// =========================================================
document.addEventListener('DOMContentLoaded', () => { //garanti que so vai rodar quando o DOM estiver carregado, é difetente do jQuery, por isso foi separado

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


  // ajuste de pattern do telefone
  if (fldTel) {
    fldTel.setAttribute('pattern', '^\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}$');
    fldTel.setAttribute('title', 'Digite DDD + número (11 dígitos) ou no formato (11) 99999-9999');
  }
  const DRAFT_KEY = 'itapets_contact_draft_v1';
  const MAX_MESSAGE = parseInt(fldMessage.getAttribute('maxlength') || '1000', 10);

//contador de caracteres
  let counter = document.createElement('small');
  counter.id = 'messageCount';
  counter.style.display = 'block';
  counter.style.marginTop = '6px';
  counter.style.color = '#666';
  counter.textContent = `0 / ${MAX_MESSAGE}`;

  fldMessage.insertAdjacentElement('afterend', counter);

//aplicacao de um toast simples(notificação)
  function toast(msg, ms = 1600) {
    const el = document.createElement('div');
    el.className = 'simple-toast';
    el.textContent = msg;

    document.body.appendChild(el);

    requestAnimationFrame(() => el.classList.add('visible'));

    setTimeout(() => el.classList.remove('visible'), ms - 200);
    setTimeout(() => el.remove(), ms);
  }

  const onlyDigits = s => (s || '').replace(/\D/g, '');

//restaurar o rascunho salvo
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
    }
  })();

//salvar o rascunho automaticamente usando localStorage
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

//usando uma mascara para o telefone
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

  //contadoir de caracteres da mensagem
  function updateMessageCount() {
    counter.textContent = `${fldMessage.value.length} / ${MAX_MESSAGE}`;
  }

  //marcacao de campo invalido
  function setInvalid(el, flag = true) {
    if (!el) return;
    if (flag) el.classList.add('invalid');
    else el.classList.remove('invalid');
  }

//validacao completa do formulario
  function validate() {

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

  [fldName, fldEmail, fldTel, fldAssunto, fldMotivo, fldMessage].forEach(inp => {
    if (!inp) return;

    inp.addEventListener('input', (e) => {

      if (e.target === fldTel) maskPhone(e);
      if (e.target === fldMessage) updateMessageCount();

      setInvalid(e.target, false);
      saveDraft();
    });
  });


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


  if (btnReset) {
    btnReset.addEventListener('click', () => {
      localStorage.removeItem(DRAFT_KEY);
      setTimeout(updateMessageCount, 10);
    });
  }

}); 
