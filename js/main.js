
// =========================================================
// 1. CÓDIGO JQUERY (DEVE ESTAR FORA DO DOMContentLoaded)
// O bloco $(function() { ... }) é um atalho para $(document).ready()
// E garante que todo o código jQuery rode após o DOM estar pronto.
// =========================================================
$(function () {
  // ---------------------------
  // 1.1. ANIMAÇÃO FADE-IN (jQuery)
  // ---------------------------
  // Seu código original do fade-in
  $(".fade-img").css("opacity", 0);

  $(".fade-img").each(function () {
    $(this).on("load", function () {
      $(this).animate({ opacity: 1 }, 800);
    });

    // Caso a imagem já tenha carregado rápido (cache)
    if (this.complete) {
      $(this).trigger("load");
    }
  });

  // ---------------------------
  // 1.2. SMOOTH SCROLL (jQuery)
  // ---------------------------
  // Seu código original do smooth scroll
  $('a[href^="#"]').on('click', function (e) {
    e.preventDefault();
    const alvo = $($(this).attr('href'));

    if (alvo.length) {
      $('html, body').animate({
        // Adicione o scroll offset aqui se necessário, ex:
        scrollTop: alvo.offset().top
      }, 600);
    }
  });

  // =========================================================
// 1.3. MODAL DE AVISO (Bootstrap/jQuery) - AGORA COM VERIFICAÇÃO DE ESCOPO
// =========================================================

// Verifica se existe o botão de Adicionar ou Comprar na página atual
if ($('#btnAdicionar').length > 0 || $('#btnComprar').length > 0) {
    
    // Se os botões existirem (ou seja, estamos em uma página de produto),
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

    // 1. Adiciona o HTML do modal ao final do body do documento
    $('body').append(modalHTML);

    // 2. Adiciona o listener de clique
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
// Fim do bloco if que garante que o código só roda nas páginas de produto.

// ---------------------------
    // 1.4. FUNCIONALIDADE DE QUANTIDADE E PREÇO
    // ---------------------------
    const BASE_PRICE = parseFloat($('#preco').text().replace('R$ ', '').replace(',', '.')); // O preço base (convertido para número)

    const $quantidadeInput = $('#quantidade');
    const $precoTotalDisplay = $('#precoTotalDisplay');
    const $btnAumentar = $('#btnAumentar');
    const $btnDiminuir = $('#btnDiminuir');

    // Função para formatar o valor como moeda brasileira
    function formatarMoeda(valor) {
        // Garante duas casas decimais e substitui ponto por vírgula
        return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    }

    // Função principal para calcular e atualizar o preço total
    function updatePrice() {
        let quantidade = parseInt($quantidadeInput.val());
        
        // Garante que a quantidade mínima seja 1
        if (isNaN(quantidade) || quantidade < 1) {
            quantidade = 1;
            $quantidadeInput.val(1);
        }
        
        const novoTotal = quantidade * BASE_PRICE;
        $precoTotalDisplay.text(formatarMoeda(novoTotal));
    }

    // 2. Eventos de Clique nos Botões de Quantidade

    // Evento de Aumentar Quantidade (+)
    $btnAumentar.on('click', function() {
        let quantidadeAtual = parseInt($quantidadeInput.val());
        $quantidadeInput.val(quantidadeAtual + 1);
        updatePrice(); // Recalcula o preço após a mudança
    });

    // Evento de Diminuir Quantidade (-)
    $btnDiminuir.on('click', function() {
        let quantidadeAtual = parseInt($quantidadeInput.val());
        // Só diminui se for maior que 1
        if (quantidadeAtual > 1) {
            $quantidadeInput.val(quantidadeAtual - 1);
            updatePrice(); // Recalcula o preço após a mudança
        }
    });

    // 3. Inicializa o preço total ao carregar a página
    updatePrice();

    // =========================================================
// 1.5. FILTRO AO VIVO (LIVE SEARCH)
// =========================================================

const $searchInput = $('#txtbusca');
const $productArticles = $('.lista-produtos article'); // Alvo: todos os artigos dentro do contêiner

$searchInput.on('keyup', function() {
    // 1. Obtém o termo de busca e o normaliza
    const searchTerm = $(this).val().toLowerCase().trim();

    // 2. Itera sobre cada produto
    $productArticles.each(function() {
        const $product = $(this);
        // Captura o texto que deve ser pesquisado (título + descrição)
        // O h3 e o p dentro do div.info são os alvos
        const productText = $product.find('.info h3').text().toLowerCase() + ' ' + 
                            $product.find('.info p').text().toLowerCase();

        // 3. Verifica se o termo de busca está contido no texto do produto
        if (productText.includes(searchTerm)) {
            // Se o produto corresponder, garante que ele está visível
            if (!$product.is(':visible')) {
                $product.slideDown(200); // Efeito suave para mostrar
            }
        } else {
            // Se o produto NÃO corresponder, garante que ele está escondido
            if ($product.is(':visible')) {
                $product.slideUp(200); // Efeito suave para esconder
            }
        }
    });

    // Se o campo estiver vazio, mostra todos os produtos imediatamente
    if (searchTerm === '') {
        $productArticles.slideDown(200);
    }
});



});


// =========================================================
// 2. CÓDIGO VANILLA JS (FUNÇÕES DE CONTATO)
// Este bloco deve conter toda a lógica que não depende de jQuery.
// =========================================================
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

}); // Fim do DOMContentLoaded
