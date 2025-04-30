// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos principais
    const pageTitleInput = document.getElementById('pageTitleInput');
    const pageDescInput = document.getElementById('pageDescInput');
    const brandColorInput = document.getElementById('brandColorInput');
    const brandColorPicker = document.getElementById('brandColorPicker');
    const colorSuggestionsContainer = document.getElementById('color-suggestions');
    const productCountInput = document.getElementById('productCountInput');
    const generateFieldsButton = document.getElementById('generateFieldsButton');
    const productFieldsContainer = document.getElementById('product-fields-container');
    const previewButton = document.getElementById('previewButton');
    const generateCodeButton = document.getElementById('generateCodeButton');
    const outputSection = document.getElementById('outputSection');
    const generatedCodeOutput = document.getElementById('generatedCodeOutput');
    const copyCodeButton = document.getElementById('copyCodeButton');
    const copyFeedback = document.getElementById('copyFeedback');
    const previewModal = document.getElementById('previewModal');
    const previewIframe = document.getElementById('previewIframe');
    const closePreviewButton = document.getElementById('closePreviewButton');
    const openPreviewNewTabButton = document.getElementById('openPreviewNewTabButton');
    const emojiPalettes = document.querySelectorAll('.emoji-palette');

    const DEFAULT_BRAND_COLOR = '#F58220'; // Laranja padrão Muralzão
    const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300.png/f8f8f8/cccccc?text=Sua+Imagem';
    const SUGGESTED_COLORS = [
        { name: 'Laranja (Padrão)', hex: '#F58220' },
        { name: 'Azul Profissional', hex: '#3B82F6' },
        { name: 'Verde Natural', hex: '#10B981' },
        { name: 'Roxo Moderno', hex: '#8B5CF6' },
        { name: 'Rosa Vibrante', hex: '#EC4899' },
        { name: 'Cinza Sólido', hex: '#6B7280' },
    ];

    // --- Funções Auxiliares ---
    function shadeColor(color, percent) {
        if (!color || !/^#[0-9A-F]{6}$/i.test(color)) return '#cc6a00';
        try {
            let R = parseInt(color.substring(1, 3), 16), G = parseInt(color.substring(3, 5), 16), B = parseInt(color.substring(5, 7), 16);
            R = parseInt(R * (100 + percent) / 100); G = parseInt(G * (100 + percent) / 100); B = parseInt(B * (100 + percent) / 100);
            R = Math.min(255, Math.max(0, R)); G = Math.min(255, Math.max(0, G)); B = Math.min(255, Math.max(0, B));
            return "#" + R.toString(16).padStart(2, '0') + G.toString(16).padStart(2, '0') + B.toString(16).padStart(2, '0');
        } catch(e) { console.error("ShadeColor Error:", e); return '#cc6a00'; }
    }
    function hexToRgba(hex, alpha) {
         if (!hex || !/^#[0-9A-F]{6}$/i.test(hex)) return `rgba(0, 0, 0, ${alpha})`;
         try {
             const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
             return `rgba(${r}, ${g}, ${b}, ${alpha})`;
         } catch(e) { console.error("HexToRgba Error:", e); return `rgba(0, 0, 0, ${alpha})`; }
    }
    function sanitizeHTML(str) {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML; // Usa a codificação nativa do navegador
    }
     function showCopyMsg(message, isError = false) {
        copyFeedback.textContent = message;
        copyFeedback.style.color = isError ? 'var(--tool-danger)' : 'var(--tool-success)';
        copyFeedback.classList.add('show');
        setTimeout(() => { copyFeedback.classList.remove('show'); }, 3000);
        setTimeout(() => { copyFeedback.textContent = ''; }, 3500);
    }
     // Função para inserir texto na posição do cursor
     function insertTextAtCursor(inputElement, textToInsert) {
        const startPos = inputElement.selectionStart;
        const endPos = inputElement.selectionEnd;
        const currentVal = inputElement.value;
        inputElement.value = currentVal.substring(0, startPos) + textToInsert + currentVal.substring(endPos, currentVal.length);
        // Move o cursor para depois do texto inserido
        inputElement.focus();
        inputElement.setSelectionRange(startPos + textToInsert.length, startPos + textToInsert.length);
    }

    // --- Inicialização ---
    function initializeTool() {
        // Popula sugestões de cores
        SUGGESTED_COLORS.forEach(color => {
            const swatch = document.createElement('span');
            swatch.classList.add('color-swatch');
            swatch.style.backgroundColor = color.hex;
            swatch.title = `${color.name} (${color.hex})`;
            swatch.dataset.hex = color.hex;
            // Adiciona checkmark para cor padrão
            if(color.hex === DEFAULT_BRAND_COLOR) swatch.innerHTML = '✓';
            swatch.addEventListener('click', () => {
                brandColorInput.value = color.hex;
                brandColorPicker.value = color.hex;
                 // Atualiza checkmarks
                 document.querySelectorAll('.color-swatch').forEach(s => s.innerHTML = '');
                 swatch.innerHTML = '✓';
            });
            colorSuggestionsContainer.appendChild(swatch);
        });

        // Sincroniza Color Picker e Input Texto
        brandColorPicker.addEventListener('input', (e) => { brandColorInput.value = e.target.value.toUpperCase(); updateSwatchCheckmark(); });
        brandColorInput.addEventListener('input', (e) => {
            const hexValue = e.target.value.toUpperCase();
            if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
                brandColorPicker.value = hexValue;
                 updateSwatchCheckmark();
            }
        });

        // Adiciona listeners aos emojis
        emojiPalettes.forEach(palette => {
            const targetInputId = palette.dataset.targetInput;
            const targetInput = document.getElementById(targetInputId);
            if (targetInput) {
                palette.querySelectorAll('span').forEach(emojiSpan => {
                    emojiSpan.addEventListener('click', () => {
                        insertTextAtCursor(targetInput, emojiSpan.textContent);
                    });
                });
            }
        });

         // Adiciona listeners aos botões principais
         generateFieldsButton?.addEventListener('click', generateProductFields);
         previewButton?.addEventListener('click', previewGeneratedCode);
         generateCodeButton?.addEventListener('click', triggerCodeGenerationAndDisplay);
         copyCodeButton?.addEventListener('click', copyCodeToClipboard);
         closePreviewButton?.addEventListener('click', closePreviewModal);
         openPreviewNewTabButton?.addEventListener('click', openPreviewInNewTab);
         previewModal?.addEventListener('click', (e) => { if (e.target === previewModal) closePreviewModal(); });

         // Estado inicial dos botões
         generateCodeButton.disabled = true;
         previewButton.disabled = true;
         copyCodeButton.disabled = true;
    }
     function updateSwatchCheckmark() {
        const currentHex = brandColorInput.value.toUpperCase();
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            if (swatch.dataset.hex.toUpperCase() === currentHex) {
                swatch.innerHTML = '✓';
            } else {
                swatch.innerHTML = '';
            }
        });
    }


    // --- Gera os campos dos produtos ---
    function generateProductFields() {
        const count = parseInt(productCountInput.value) || 0;
        productFieldsContainer.innerHTML = '';
        copyFeedback.textContent = '';
        outputSection.style.display = 'none';
        copyCodeButton.disabled = true;
        generateCodeButton.disabled = true;
        previewButton.disabled = true;

        if (count <= 0) {
             productFieldsContainer.innerHTML = '<p class="placeholder-text error-text">O número de produtos deve ser maior que zero.</p>';
             return;
        }
        if (count > 50) {
            productFieldsContainer.innerHTML = '<p class="placeholder-text error-text">Limite de 50 produtos.</p>';
            return;
        }

        for (let i = 1; i <= count; i++) {
             // ... (código para criar os inputs - igual ao da resposta anterior) ...
              const productGroup = document.createElement('div');
            productGroup.classList.add('product-input-group');
            const defaultNumber = `N°${String(i).padStart(3, '0')}`;
            productGroup.innerHTML = `
                <h3>Produto ${i}</h3>
                <div class="form-group">
                    <label for="imgUrl-${i}">URL da Imagem: <span class="required" title="Obrigatório">*</span></label>
                    <input type="url" class="product-input" id="imgUrl-${i}" data-field="imageUrl" placeholder="https://url-da-imagem.jpg" required>
                </div>
                <div class="form-group">
                    <label for="numberId-${i}">Número Identificador: <span class="required" title="Obrigatório">*</span></label>
                    <input type="text" class="product-input" id="numberId-${i}" data-field="identifierNumber" value="${defaultNumber}" placeholder="Ex: N°001" required>
                </div>
                <div class="form-group">
                    <label for="name-${i}">Nome do Produto: <span class="required" title="Obrigatório">*</span></label>
                    <input type="text" class="product-input" id="name-${i}" data-field="name" placeholder="Nome conciso do produto" required>
                </div>
                <div class="form-group">
                    <label for="affiliateLink-${i}">Link de Afiliado: <span class="required" title="Obrigatório">*</span></label>
                    <input type="url" class="product-input" id="affiliateLink-${i}" data-field="affiliateLink" placeholder="https://link-afiliado.com" required>
                </div>
            `;
            productFieldsContainer.appendChild(productGroup);
        }
         generateCodeButton.disabled = false;
         previewButton.disabled = false;
    }

    // --- Valida e Coleta Dados ---
    function collectAndValidateData() {
        let data = {
            pageTitle: sanitizeHTML(pageTitleInput.value.trim() || 'Meus Achadinhos'),
            pageDesc: sanitizeHTML(pageDescInput.value.trim() || 'Confira minha seleção!'),
            brandColor: /^#[0-9A-F]{6}$/i.test(brandColorInput.value.trim()) ? brandColorInput.value.trim() : DEFAULT_BRAND_COLOR,
            products: []
        };
        let isValid = true;
        const productGroups = productFieldsContainer.querySelectorAll('.product-input-group');

        if (productGroups.length === 0) {
            alert('Gere os campos e preencha os detalhes dos produtos primeiro!');
            return null;
        }

        productGroups.forEach((group) => {
            const productData = {};
            const inputs = group.querySelectorAll('.product-input');
            let productIsValid = true;
            inputs.forEach(input => {
                const value = input.value.trim();
                if (input.required && !value) {
                    input.classList.add('error'); isValid = false; productIsValid = false;
                } else { input.classList.remove('error'); }
                productData[input.dataset.field] = value; // Coleta mesmo se inválido, para reter dados
            });
            // Adiciona apenas se o produto individual for válido (ou se não for requerido?) - Decidi adicionar sempre para manter a ordem
            // if(productIsValid) {
                data.products.push(productData);
            // }
        });

        if (!isValid) {
             alert('Atenção! Preencha todos os campos obrigatórios (*) marcados em vermelho.');
             return null;
        }
        return data;
    }

    // --- Monta o HTML dos produtos ---
    function buildProductCardsHTML(products) {
        let html = '';
        products.forEach((product, index) => {
            const imgUrl = product.imageUrl || PLACEHOLDER_IMAGE;
            const numberId = sanitizeHTML(product.identifierNumber || `N°${String(index + 1).padStart(3, '0')}`);
            const name = sanitizeHTML(product.name || `Produto ${index + 1}`);
            const affiliateLink = sanitizeHTML(product.affiliateLink || '#');
            const safeAlt = name.substring(0, 70);

            html += `
            <!-- Produto ${index + 1} -->
            <div class="muralzao-product-card">
                <div class="muralzao-card-top">
                    <div class="muralzao-image-container">
                        <img src="${imgUrl}" alt="${safeAlt}" loading="lazy">
                    </div>
                    <div class="muralzao-card-content">
                        <span class="muralzao-product-number">${numberId}</span>
                        <p class="muralzao-product-name" title="${name}">${name}</p>
                    </div>
                </div>
                <a href="${affiliateLink}" target="_blank" rel="noopener noreferrer nofollow" class="muralzao-shopee-button">Ver na Shopee 🔥</a>
            </div>\n`;
        });
        return html;
    }

     // --- Gera o Código Final ---
    function generateCompleteCode(data) {
        if (!data) return null;
        const { pageTitle, pageDesc, brandColor, products } = data;
        // Recalcula cores derivadas a cada geração
        const brandColorDarker = shadeColor(brandColor, -15);
        const brandRgbaShadow = hexToRgba(brandColor, 0.15);
        const instructionBg = hexToRgba(brandColor, 0.08);
        const instructionBorder = hexToRgba(brandColor, 0.2);
        const productCardsHTML = buildProductCardsHTML(products);

        // Escapa título e descrição para evitar problemas no HTML/JS
        const safePageTitle = pageTitle.replace(/[`\${}\\]/g, '\\$&'); // Escapa backticks, ${} e \
        const safePageDesc = pageDesc.replace(/[`\${}\\]/g, '\\$&');

        return `
<!-- Início do Código Muralzão para Google Sites -->
<style>
    :root { --muralzao-brand-color: ${brandColor}; --muralzao-brand-darker: ${brandColorDarker}; --muralzao-shadow-focus: ${brandRgbaShadow}; --muralzao-instruction-bg: ${instructionBg}; --muralzao-instruction-border: ${instructionBorder}; --muralzao-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }
    .muralzao-body { font-family: var(--muralzao-font); background-color: #ffffff; color: #333; line-height: 1.6; padding: 0; margin: 0; width: 100%; }
    .muralzao-container { max-width: 1140px; margin: 10px auto; padding: clamp(10px, 3vw, 20px); }
    .muralzao-header { text-align: center; margin-bottom: 15px; }
    .muralzao-header h2 { color: #1a202c; margin-bottom: 4px; font-size: clamp(1.5em, 4vw, 2em); font-weight: 600; word-wrap: break-word; }
    .muralzao-header p { color: #718096; font-size: clamp(0.95em, 2.5vw, 1.1em); margin: 0; word-wrap: break-word; }
    .muralzao-instructions { background-color: var(--muralzao-instruction-bg); color: var(--muralzao-brand-darker); padding: 8px 15px; border-radius: 8px; font-weight: 500; display: inline-block; margin: 10px auto 0px; font-size: clamp(0.9em, 2.2vw, 1em); border: 1px solid var(--muralzao-instruction-border); }
    .muralzao-divider { height: 1px; background-color: var(--muralzao-brand-color); opacity: 0.3; border: none; margin: 25px auto; width: 60%; max-width: 400px; } /* HR usa cor da marca */
    .muralzao-search { margin-bottom: 30px; text-align: center; padding: 0 5px; }
    .muralzao-search-input { padding: 11px 18px 11px 40px; border: 1px solid #cbd5e0; border-radius: 50px; width: 100%; max-width: 480px; font-size: 0.95em; outline: none; transition: all 0.3s ease; background-color: #f8f9fa; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23A0AEC0' class='bi bi-search' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: 15px center; background-size: 15px; }
    .muralzao-search-input::placeholder { color: #a0aec0; }
    .muralzao-search-input:focus { border-color: var(--muralzao-brand-color); box-shadow: 0 0 0 3px var(--muralzao-shadow-focus); background-color: #fff; }
    .muralzao-product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(185px, 1fr)); gap: clamp(15px, 2.5vw, 20px); } /* Aumentei minmax */
    .muralzao-product-card { background-color: #ffffff; border: 1px solid #e8e8f0; border-radius: 10px; text-align: center; box-shadow: 0 3px 7px rgba(0,0,0,0.05); transition: transform 0.2s ease-out, box-shadow 0.2s ease-out; display: flex; flex-direction: column; overflow: hidden; }
    .muralzao-product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 18px rgba(0,0,0,0.08); }
    .muralzao-card-top { display: flex; flex-direction: column; flex-grow: 1; text-decoration: none; color: inherit; }
    .muralzao-image-container { width: 100%; padding-top: 100%; position: relative; background-color: #f8f8f8; border-bottom: 1px solid #f1f1f1; }
    .muralzao-image-container img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.25s ease; border-top-left-radius: 9px; border-top-right-radius: 9px; }
    .muralzao-product-card:hover img { transform: scale(1.03); }
    .muralzao-card-content { padding: 12px 10px 8px; flex-grow: 1; }
    .muralzao-product-number { font-weight: 700; font-size: 1.1em; color: var(--muralzao-brand-color); display: block; margin-bottom: 5px; }
    .muralzao-product-name { font-size: 0.9rem; color: #4a5568; margin-bottom: 8px; font-weight: 500; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; min-height: 4.2em; }
    .muralzao-shopee-button { display: block; background: var(--muralzao-brand-color); color: #ffffff !important; padding: 10px 15px; text-decoration: none !important; border-bottom-left-radius: 9px; border-bottom-right-radius: 9px; font-weight: 600; transition: background-color 0.2s ease; border: none; cursor: pointer; font-size: 0.95em; text-align: center; border-top: 1px solid #eee; }
    .muralzao-shopee-button:hover { background: var(--muralzao-brand-darker); color: #ffffff !important; }
    .muralzao-disclaimer { text-align: center; font-size: 0.75em; color: #a0aec0; margin-top: 35px; padding-top: 15px; border-top: 1px solid #edf2f7; }
    @media (max-width: 768px) { .muralzao-product-grid { grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); } }
    @media (max-width: 480px) { .muralzao-product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } .muralzao-container { padding: 8px;} .muralzao-header h2 {font-size: 1.3em;} .muralzao-header p {font-size: 0.9em;} .muralzao-instructions {font-size: 0.8em; padding: 6px 10px;} .muralzao-divider { margin: 20px auto; } .muralzao-product-name {font-size: 0.8rem; min-height: 3.6em; -webkit-line-clamp: 3;} .muralzao-shopee-button { font-size: 0.85em; padding: 8px 10px;} .muralzao-search-input{font-size: 0.9em; padding: 10px 15px 10px 35px;} }
</style>

<div class="muralzao-body">
    <div class="muralzao-container">
        <div class="muralzao-header">
            <h2>${safePageTitle}</h2>
            <p>${safePageDesc}</p>
            <div class="muralzao-instructions">
                <span>👇 Procure pelo <strong>NÚMERO</strong> ou <strong>NOME</strong> do produto abaixo! 👇</span>
            </div>
        </div>

        <hr class="muralzao-divider">

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
    // Funções auxiliares (incluídas para autonomia do código gerado)
    function muralzaoShadeColor(c, p) { if (!c || c.length !== 7 || c[0] !== '#') return '#cc6a00'; try { let R=parseInt(c.substring(1,3),16),G=parseInt(c.substring(3,5),16),B=parseInt(c.substring(5,7),16); R=parseInt(R*(100+p)/100); G=parseInt(G*(100+p)/100); B=parseInt(B*(100+p)/100); R=Math.min(255,Math.max(0,R)); G=Math.min(255,Math.max(0,G)); B=Math.min(255,Math.max(0,B)); return "#"+R.toString(16).padStart(2,'0')+G.toString(16).padStart(2,'0')+B.toString(16).padStart(2,'0'); } catch(e) { return '#cc6a00'; }}
    function muralzaoHexToRgba(h, a) { if (!h || h.length !== 7 || h[0] !== '#') return \`rgba(0,0,0,\${a})\`; try { let r=parseInt(h.slice(1,3),16), g=parseInt(h.slice(3,5),16), b=parseInt(h.slice(5,7),16); return \`rgba(\${r},\${g},\${b},\${a})\`; } catch(e) { return \`rgba(0,0,0,\${a})\`; }}

    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('muralzaoProductSearchInput');
        const productGrid = document.querySelector('.muralzao-product-grid');
        if (!searchInput || !productGrid) { return; }
        const productCards = productGrid.querySelectorAll('.muralzao-product-card');
        const brandColor = '${brandColor}'; // Cor é injetada aqui

         // Aplica cores dinâmicas via CSS Variables no elemento body do código gerado
         const bodyStyle = document.querySelector('.muralzao-body'); // Ou outro container se necessário
         if (bodyStyle) {
             bodyStyle.style.setProperty('--muralzao-brand-color', brandColor);
             bodyStyle.style.setProperty('--muralzao-brand-darker', muralzaoShadeColor(brandColor, -15));
             bodyStyle.style.setProperty('--muralzao-shadow-focus', muralzaoHexToRgba(brandColor, 0.15));
             bodyStyle.style.setProperty('--muralzao-instruction-bg', muralzaoHexToRgba(brandColor, 0.08));
             bodyStyle.style.setProperty('--muralzao-instruction-border', muralzaoHexToRgba(brandColor, 0.2));
         }


        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            productCards.forEach(card => {
                const numberEl = card.querySelector('.muralzao-product-number');
                const nameEl = card.querySelector('.muralzao-product-name');
                const numberText = numberEl ? numberEl.textContent.toLowerCase() : '';
                const nameText = nameEl ? nameEl.textContent.toLowerCase() : '';
                const pureSearchNumber = searchTerm.replace(/n°|nº|\\.|\\s/g,'').trim(); // Limpa busca por número

                let matchNumber = false;
                if (searchTerm.length > 0) {
                    // Compara número limpo com número limpo
                    matchNumber = numberText.replace(/n°|nº|\\.|\\s/g,'').includes(pureSearchNumber);
                }
                const matchName = nameText.includes(searchTerm);

                card.style.display = (matchNumber || matchName || searchTerm === '') ? 'flex' : 'none';
            });
        });
    });
<\/script>
<!-- Fim do Código Muralzão -->
`;
    }

    // --- Ações dos Botões ---
    function triggerCodeGenerationAndDisplay() {
        const data = collectAndValidateData();
        if (!data) return;
        const finalCode = generateCompleteCode(data);
        if (finalCode) {
            generatedCodeOutput.value = finalCode;
            outputSection.style.display = 'block';
            copyCodeButton.disabled = false;
            generatedCodeOutput.focus();
            generatedCodeOutput.select();
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function previewGeneratedCode() {
        const data = collectAndValidateData();
        if (!data) return;
        const previewCode = generateCompleteCode(data);
        if(previewCode) {
            previewIframe.srcdoc = previewCode; // Carrega no iframe
            previewModal.style.display = 'flex';
            setTimeout(() => previewModal.classList.add('show'), 10); // Ativa animação
        }
    }

    function openPreviewInNewTab() {
         const data = collectAndValidateData();
         if (!data) return;
         const codeToOpen = generateCompleteCode(data);
         if(codeToOpen) {
             try {
                const blob = new Blob([codeToOpen], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const newTab = window.open(url, '_blank');
                 if (!newTab) { // Verifica se foi bloqueado
                    alert('Abertura de nova aba bloqueada pelo navegador. Verifique as configurações.');
                 }
                 // URL.revokeObjectURL(url); // Revogar o URL do blob depois de um tempo pode ser bom, mas pode quebrar se a aba demorar para carregar
             } catch (e) {
                 alert('Erro ao tentar abrir a prévia em nova aba.');
                 console.error(e);
             }
         }
    }

    function closePreviewModal() {
        previewModal.classList.remove('show');
        setTimeout(() => {
            previewModal.style.display = 'none';
            previewIframe.srcdoc = '<html><body></body></html>'; // Limpa
        }, 300); // Espera transição
    }

    function copyCodeToClipboard() {
         //... (função de cópia igual à resposta anterior) ...
          if (!generatedCodeOutput.value) return;
         if (!navigator.clipboard) {
             try { generatedCodeOutput.select(); generatedCodeOutput.setSelectionRange(0, 99999); document.execCommand('copy'); showCopyMsg('✅ Código Copiado! (Fallback)'); }
             catch (err) { showCopyMsg('❌ Erro ao copiar. Use Ctrl+C.', true); } return;
         }
         navigator.clipboard.writeText(generatedCodeOutput.value).then(() => {
             showCopyMsg('✅ Código Copiado!'); copyCodeButton.disabled = true; copyCodeButton.textContent = 'Copiado!';
             setTimeout(() => { copyCodeButton.disabled = false; copyCodeButton.textContent = '📋 Copiar Código'; }, 2500);
         }).catch(err => { showCopyMsg('❌ Erro ao copiar. Tente manualmente (Ctrl+C).', true); });
    }

    // --- Inicialização e Listeners ---
    initializeTool(); // Chama a função para configurar cores e emojis iniciais

}); // Fim DOMContentLoaded