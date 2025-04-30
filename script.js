// script.js
document.addEventListener('DOMContentLoaded', () => {
    const pageTitleInput = document.getElementById('pageTitleInput');
    const pageDescInput = document.getElementById('pageDescInput');
    const brandColorInput = document.getElementById('brandColorInput');
    const brandColorPicker = document.getElementById('brandColorPicker'); // Color Picker
    const productCountInput = document.getElementById('productCountInput');
    const generateFieldsButton = document.getElementById('generateFieldsButton');
    const productFieldsContainer = document.getElementById('product-fields-container');
    const generateCodeButton = document.getElementById('generateCodeButton');
    const outputSection = document.getElementById('outputSection');
    const generatedCodeOutput = document.getElementById('generatedCodeOutput');
    const copyCodeButton = document.getElementById('copyCodeButton');
    const copyFeedback = document.getElementById('copyFeedback');

    const DEFAULT_BRAND_COLOR = '#F58220';
    const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300.png/f8f8f8/cccccc?text=Sua+Imagem+Aqui';

    // Sincroniza Color Picker com Input Texto
    brandColorPicker.addEventListener('input', (e) => {
        brandColorInput.value = e.target.value;
    });
    brandColorInput.addEventListener('input', (e) => {
         // Tenta validar HEX antes de atualizar o picker
         if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
             brandColorPicker.value = e.target.value;
         }
    });

    // --- Gera os campos dos produtos ---
    function generateProductFields() {
        const count = parseInt(productCountInput.value) || 0;
        productFieldsContainer.innerHTML = '';
        copyFeedback.textContent = '';
        outputSection.style.display = 'none';
        copyCodeButton.disabled = true;
        generateCodeButton.disabled = true; // Desabilita gerar até ter campos

        if (count <= 0 || count > 50) {
            productFieldsContainer.innerHTML = '<p class="placeholder-text error-text">Insira um número válido de produtos (1 a 50).</p>';
            return;
        }

        for (let i = 1; i <= count; i++) {
            const productGroup = document.createElement('div');
            productGroup.classList.add('product-input-group');
            const defaultNumber = `N°${String(i).padStart(3, '0')}`;
            productGroup.innerHTML = `
                <h3>Produto ${i}</h3>
                <div class="form-group">
                    <label for="imgUrl-${i}">URL da Imagem:</label>
                    <input type="url" class="product-input" id="imgUrl-${i}" data-field="imageUrl" placeholder="https://url-da-imagem.jpg" required>
                </div>
                <div class="form-group">
                    <label for="numberId-${i}">Número Identificador:</label>
                    <input type="text" class="product-input" id="numberId-${i}" data-field="identifierNumber" value="${defaultNumber}" placeholder="Ex: N°001" required>
                </div>
                <div class="form-group">
                    <label for="name-${i}">Nome do Produto:</label>
                    <input type="text" class="product-input" id="name-${i}" data-field="name" placeholder="Nome conciso do produto" required>
                </div>
                <div class="form-group">
                    <label for="affiliateLink-${i}">Link de Afiliado:</label>
                    <input type="url" class="product-input" id="affiliateLink-${i}" data-field="affiliateLink" placeholder="https://link-afiliado.com" required>
                </div>
            `;
            productFieldsContainer.appendChild(productGroup);
        }
         generateCodeButton.disabled = false; // Habilita botão de gerar após criar campos
    }

    // --- Função para gerar o código final ---
    function generateFinalCode() {
        const pageTitle = pageTitleInput.value.trim() || 'Meus Achadinhos';
        const pageDesc = pageDescInput.value.trim() || 'Confira minha seleção especial!';
        const brandColorHex = brandColorInput.value.trim();
        // Valida a cor HEX, se inválida usa o padrão
        const brandColor = /^#[0-9A-F]{6}$/i.test(brandColorHex) ? brandColorHex : DEFAULT_BRAND_COLOR;
        const brandColorDarker = shadeColor(brandColor, -15); // Escurece um pouco para hover
        const brandRgbaShadow = hexToRgba(brandColor, 0.15); // Para sombra de foco

        const productGroups = productFieldsContainer.querySelectorAll('.product-input-group');
        let productCardsHTML = '';
        copyFeedback.textContent = '';
        let missingData = false;

        if (productGroups.length === 0) {
            alert('Gere os campos e preencha os detalhes dos produtos primeiro!');
            generateCodeButton.disabled = true;
            return;
        }

        productGroups.forEach((group, index) => {
            const i = index + 1;
            const inputs = group.querySelectorAll('.product-input');
            const productData = {};
            inputs.forEach(input => {
                productData[input.dataset.field] = input.value.trim();
                 // Simples verificação visual de campos obrigatórios (poderia ser mais robusta)
                 if(!input.value.trim() && input.required) {
                     input.style.borderColor = '#E53E3E'; // Borda vermelha
                     missingData = true;
                 } else {
                      input.style.borderColor = ''; // Remove borda vermelha se preenchido
                 }
            });

            if (missingData) return; // Para a geração se faltar dado obrigatório

            const imgUrl = productData.imageUrl || PLACEHOLDER_IMAGE;
            const numberId = productData.identifierNumber || `N°${String(i).padStart(3, '0')}`;
            const name = productData.name || `Produto ${i}`;
            const affiliateLink = productData.affiliateLink || '#';

            const safeName = name.replace(/"/g, '"').replace(/</g, '<').replace(/>/g, '>'); // Escapa HTML básico
            const safeAlt = safeName.substring(0, 70);

            productCardsHTML += `
            <!-- Produto ${i} -->
            <div class="muralzao-product-card">
                <div class="muralzao-card-top">
                    <div class="muralzao-image-container">
                        <img src="${imgUrl}" alt="${safeAlt}" loading="lazy">
                    </div>
                    <div class="muralzao-card-content">
                        <span class="muralzao-product-number">${numberId}</span>
                        <p class="muralzao-product-name" title="${safeName}">${safeName}</p>
                    </div>
                </div>
                <a href="${affiliateLink}" target="_blank" rel="noopener noreferrer nofollow" class="muralzao-shopee-button">Ver na Shopee 🔥</a>
            </div>\n`; // Adiciona nova linha para melhor formatação do código gerado
        });

        if (missingData) {
             alert('Atenção! Preencha todos os campos marcados em vermelho antes de gerar o código.');
             return;
        }


        // --- Template Final (HTML + CSS + JS) ---
        const fullGeneratedCode = `
<!-- Início do Código Muralzão para Google Sites -->
<style>
    /* Estilos Gerados - Inspirado no seu exemplo */
    :root {
        --muralzao-brand-color: ${brandColor};
        --muralzao-brand-darker: ${brandColorDarker};
        --muralzao-shadow-focus: ${brandRgbaShadow};
        --muralzao-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    .muralzao-body { font-family: var(--muralzao-font); background-color: #ffffff; color: #333; line-height: 1.6; padding: 0; margin: 0; width: 100%; }
    .muralzao-container { max-width: 1140px; margin: 10px auto; padding: clamp(10px, 3vw, 20px); } /* Container principal */

    /* Cabeçalho e Instruções */
    .muralzao-header { text-align: center; margin-bottom: 20px; }
    .muralzao-header h2 { color: #1a202c; margin-bottom: 4px; font-size: clamp(1.5em, 4vw, 2em); font-weight: 600; }
    .muralzao-header p { color: #718096; font-size: clamp(0.95em, 2.5vw, 1.1em); margin: 0; }
    .muralzao-instructions { background-color: ${hexToRgba(brandColor, 0.08)}; color: var(--muralzao-brand-darker); padding: 8px 15px; border-radius: 8px; font-weight: 500; display: inline-block; margin: 15px auto 25px; font-size: clamp(0.9em, 2.2vw, 1em); border: 1px solid ${hexToRgba(brandColor, 0.2)}; }
    .muralzao-instructions strong { font-weight: 700; }

    /* Busca */
    .muralzao-search { margin-bottom: 30px; text-align: center; }
    .muralzao-search-input { padding: 11px 18px 11px 40px; border: 1px solid #cbd5e0; border-radius: 50px; width: 100%; max-width: 480px; font-size: 0.95em; outline: none; transition: all 0.3s ease; background-color: #f8f9fa; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23A0AEC0' class='bi bi-search' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: 15px center; background-size: 15px; }
    .muralzao-search-input::placeholder { color: #a0aec0; }
    .muralzao-search-input:focus { border-color: var(--muralzao-brand-color); box-shadow: 0 0 0 3px var(--muralzao-shadow-focus); background-color: #fff; }

    /* Grid de Produtos */
    .muralzao-product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: clamp(12px, 2.5vw, 20px); }

    /* Card de Produto */
    .muralzao-product-card { background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; text-align: center; /* Centraliza N° e Nome */ box-shadow: 0 2px 5px rgba(0,0,0,0.06); transition: transform 0.25s ease, box-shadow 0.25s ease; display: flex; flex-direction: column; overflow: hidden; }
    .muralzao-product-card:hover { transform: translateY(-4px); box-shadow: 0 6px 15px rgba(0,0,0,0.09); }
    .muralzao-card-top { display: flex; flex-direction: column; flex-grow: 1; text-decoration: none; color: inherit;} /* Agrupa Imagem e Conteúdo */
    .muralzao-image-container { width: 100%; padding-top: 100%; position: relative; background-color: #f8f9fa; border-bottom: 1px solid #f1f1f1; }
    .muralzao-image-container img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; border-top-left-radius: 9px; border-top-right-radius: 9px; }
    .muralzao-product-card:hover img { transform: scale(1.03); }
    .muralzao-card-content { padding: 12px 10px 10px; flex-grow: 1; }
    .muralzao-product-number { font-weight: 700; font-size: 1.1em; color: var(--muralzao-brand-color); display: block; margin-bottom: 6px; }
    .muralzao-product-name { font-size: 0.9rem; /* Levemente menor */ color: #4a5568; margin-bottom: 10px; font-weight: 500; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; min-height: 4.2em; /* Aprox. 3 linhas */ }
    .muralzao-shopee-button { display: block; background: var(--muralzao-brand-color); color: #ffffff !important; padding: 10px 15px; text-decoration: none !important; border-bottom-left-radius: 9px; border-bottom-right-radius: 9px; font-weight: 600; transition: background-color 0.25s ease; border: none; cursor: pointer; font-size: 0.95em; text-align: center; border-top: 1px solid #eee; }
    .muralzao-shopee-button:hover { background: var(--muralzao-brand-darker); color: #ffffff !important; }

    /* Disclaimer */
    .muralzao-disclaimer { text-align: center; font-size: 0.75em; color: #a0aec0; margin-top: 35px; padding-top: 15px; border-top: 1px solid #edf2f7; }

    /* Responsividade */
    @media (max-width: 768px) { .muralzao-product-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); } }
    @media (max-width: 480px) { .muralzao-product-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } .muralzao-container { padding: 5px;} .muralzao-intro h2 {font-size: 1.4em;} .muralzao-intro p {font-size: 0.95em;} .muralzao-instructions {font-size: 0.85em; margin-bottom: 20px;} .muralzao-product-name {font-size: 0.85rem; min-height: 3.8em; -webkit-line-clamp: 3;} .muralzao-shopee-button { font-size: 0.9em; padding: 9px 10px;} .muralzao-search-input{font-size: 0.9em; padding: 10px 15px 10px 35px;} }
</style>

<div class="muralzao-body">
    <div class="muralzao-container">
        <div class="muralzao-header">
            <h2>${pageTitle}</h2>
            <p>${pageDesc}</p>
            <div class="muralzao-instructions">
                <span>👇 Procure pelo <strong>NÚMERO</strong> ou <strong>NOME</strong> do produto abaixo! 👇</span>
            </div>
        </div>

        <div class="muralzao-search">
            <input type="text" id="muralzaoProductSearchInput" class="muralzao-search-input" placeholder="Digite o N° ou nome do produto...">
        </div>

        <div class="muralzao-product-grid">
            ${productCardsHTML}
        </div>

        <div class="muralzao-disclaimer">
            <small>Como Afiliado(a), posso receber comissões por compras qualificadas originadas nesta página.</small>
        </div>
    </div>
</div>

<script>
    // Função auxiliar para escurecer cor HEX
    function shadeColor(color, percent) {
        if (!color || color.length !== 7 || color[0] !== '#') return '#cc6a00'; // Fallback
        try {
            let R = parseInt(color.substring(1, 3), 16), G = parseInt(color.substring(3, 5), 16), B = parseInt(color.substring(5, 7), 16);
            R = parseInt(R * (100 + percent) / 100); G = parseInt(G * (100 + percent) / 100); B = parseInt(B * (100 + percent) / 100);
            R = Math.min(255, Math.max(0, R)); G = Math.min(255, Math.max(0, G)); B = Math.min(255, Math.max(0, B));
            return "#" + R.toString(16).padStart(2, '0') + G.toString(16).padStart(2, '0') + B.toString(16).padStart(2, '0');
        } catch(e) { return '#cc6a00'; }
     }
     // Função auxiliar para HEX -> RGBA
     function hexToRgba(hex, alpha) {
          if (!hex || hex.length !== 7 || hex[0] !== '#') return \`rgba(0, 0, 0, \${alpha})\`;
          try {
              const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
              return \`rgba(\${r}, \${g}, \${b}, \${alpha})\`;
          } catch(e) { return \`rgba(0, 0, 0, \${alpha})\`; }
     }

    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('muralzaoProductSearchInput'); // ID único para busca no embed
        const productGrid = document.querySelector('.muralzao-product-grid');
        if (!searchInput || !productGrid) { console.error('Muralzão Search or Grid not found in embed'); return; }
        const productCards = productGrid.querySelectorAll('.muralzao-product-card');

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            productCards.forEach(card => {
                const numberEl = card.querySelector('.muralzao-product-number');
                const nameEl = card.querySelector('.muralzao-product-name');
                const numberText = numberEl ? numberEl.textContent.toLowerCase() : '';
                const nameText = nameEl ? nameEl.textContent.toLowerCase() : '';
                const pureSearchNumber = searchTerm.replace(/n°|nº|\\.|\\s/g,'').trim();

                let matchNumber = false;
                if (searchTerm.length > 0) {
                    matchNumber = numberText.includes(searchTerm) || (pureSearchNumber.length > 0 && numberText.replace(/n°|nº|\\.|\\s/g,'').includes(pureSearchNumber));
                }
                const matchName = nameText.includes(searchTerm);

                if (matchNumber || matchName || searchTerm === '') {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
         // Aplica a cor da marca vinda do gerador
         const rootStyle = document.documentElement.style;
         rootStyle.setProperty('--muralzao-brand-color', '${brandColor}');
         rootStyle.setProperty('--muralzao-brand-darker', shadeColor('${brandColor}', -15));
         rootStyle.setProperty('--muralzao-shadow-focus', hexToRgba('${brandColor}', 0.15));
    });
<\/script>
<!-- Fim do Código Muralzão -->
`;

        // Exibe o código gerado na ferramenta
        generatedCodeOutput.value = fullGeneratedCode;
        outputSection.style.display = 'block';
        copyCodeButton.disabled = false;
        generatedCodeOutput.focus();
        generatedCodeOutput.select();
    }

    // --- Função auxiliar para escurecer a cor ---
    function shadeColor(color, percent) {
        if (!color || color.length !== 7 || color[0] !== '#') return '#cc6a00';
        try {
            let R = parseInt(color.substring(1, 3), 16), G = parseInt(color.substring(3, 5), 16), B = parseInt(color.substring(5, 7), 16);
            R = parseInt(R * (100 + percent) / 100); G = parseInt(G * (100 + percent) / 100); B = parseInt(B * (100 + percent) / 100);
            R = Math.min(255, Math.max(0, R)); G = Math.min(255, Math.max(0, G)); B = Math.min(255, Math.max(0, B));
            return "#" + R.toString(16).padStart(2, '0') + G.toString(16).padStart(2, '0') + B.toString(16).padStart(2, '0');
        } catch(e) { return '#cc6a00'; }
    }
    // --- Função auxiliar para HEX -> RGBA ---
     function hexToRgba(hex, alpha) {
         if (!hex || hex.length !== 7 || hex[0] !== '#') return `rgba(0, 0, 0, ${alpha})`;
         try {
             const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
             return `rgba(${r}, ${g}, ${b}, ${alpha})`;
         } catch(e) { return `rgba(0, 0, 0, ${alpha})`; }
    }

    // --- Função para copiar o código ---
    function copyCodeToClipboard() {
        if (!navigator.clipboard) {
            try {
                generatedCodeOutput.select(); generatedCodeOutput.setSelectionRange(0, 99999); document.execCommand('copy');
                showCopyFeedback('✅ Código Copiado! (Fallback)');
            } catch (err) { showCopyFeedback('❌ Erro ao copiar. Use Ctrl+C.'); }
            return;
        }
        navigator.clipboard.writeText(generatedCodeOutput.value).then(() => {
            showCopyFeedback('✅ Código Copiado!'); copyCodeButton.disabled = true; copyCodeButton.textContent = 'Copiado!';
            setTimeout(() => { copyCodeButton.disabled = false; copyCodeButton.textContent = '📋 Copiar Código'; }, 2500);
        }).catch(err => { showCopyFeedback('❌ Erro ao copiar. Tente manualmente (Ctrl+C).'); });
    }

    // --- Função para mostrar feedback de cópia ---
    function showCopyFeedback(message) {
        copyFeedback.textContent = message; copyFeedback.className = 'copy-feedback show'; // Adiciona classe para animar
        setTimeout(() => { copyFeedback.className = 'copy-feedback'; }, 2500); // Remove classe
    }

    // --- Listeners ---
    generateFieldsButton?.addEventListener('click', generateProductFields);
    generateCodeButton?.addEventListener('click', generateFinalCode);
    copyCodeButton?.addEventListener('click', copyCodeToClipboard);

    // Gera campos iniciais
    if (parseInt(productCountInput?.value) > 0) { generateProductFields(); }
});