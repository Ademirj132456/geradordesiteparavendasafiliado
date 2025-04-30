// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos principais
    const pageTitleInput = document.getElementById('pageTitleInput');
    const pageDescInput = document.getElementById('pageDescInput');
    const brandColorInput = document.getElementById('brandColorInput');
    const brandColorPicker = document.getElementById('brandColorPicker');
    const colorSuggestionsContainer = document.getElementById('color-suggestions');
    // Inputs de Redes Sociais
    const socialInstagramInput = document.getElementById('socialInstagram');
    const socialTiktokInput = document.getElementById('socialTiktok');
    const socialFacebookInput = document.getElementById('socialFacebook');
    const socialYoutubeInput = document.getElementById('socialYoutube');
    const socialWhatsappInput = document.getElementById('socialWhatsapp');
    const socialTelegramInput = document.getElementById('socialTelegram');
    // Restante dos elementos
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

    const DEFAULT_BRAND_COLOR = '#F58220';
    const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300.png/f8f8f8/cccccc?text=Sua+Imagem';
    const SUGGESTED_COLORS = [
        { name: 'Laranja Padrão', hex: '#F58220' }, { name: 'Azul Claro', hex: '#3B82F6' },
        { name: 'Verde Esmeralda', hex: '#10B981' },{ name: 'Roxo Íris', hex: '#8B5CF6' },
        { name: 'Rosa Pink', hex: '#EC4899' }, { name: 'Cinza Chumbo', hex: '#4B5563' },
        { name: 'Amarelo Sol', hex: '#F59E0B'}, { name: 'Azul Escuro', hex: '#1E3A8A'}
    ];

    // --- Funções Auxiliares (shadeColor, hexToRgba, sanitizeHTML, showCopyMsg, insertTextAtCursor) ---
    // (Colar as mesmas funções auxiliares da resposta anterior aqui)
    function shadeColor(color, percent) { if (!color || !/^#[0-9A-F]{6}$/i.test(color)) return '#cc6a00'; try { let R=parseInt(color.substring(1,3),16),G=parseInt(color.substring(3,5),16),B=parseInt(color.substring(5,7),16); R=parseInt(R*(100+percent)/100); G=parseInt(G*(100+percent)/100); B=parseInt(B*(100+percent)/100); R=Math.min(255,Math.max(0,R)); G=Math.min(255,Math.max(0,G)); B=Math.min(255,Math.max(0,B)); return "#"+R.toString(16).padStart(2,'0')+G.toString(16).padStart(2,'0')+B.toString(16).padStart(2,'0'); } catch(e){ console.error("ShadeColor Error:", e); return '#cc6a00'; }}
    function hexToRgba(hex, alpha) { if (!hex || !/^#[0-9A-F]{6}$/i.test(hex)) return `rgba(0,0,0,${alpha})`; try { const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16); return `rgba(${r},${g},${b},${alpha})`; } catch(e){ console.error("HexToRgba Error:", e); return `rgba(0,0,0,${alpha})`; }}
    function sanitizeHTML(str) { if (!str) return ''; const temp=document.createElement('div'); temp.textContent=str; return temp.innerHTML; }
    function showCopyMsg(message, isError = false) { copyFeedback.textContent=message; copyFeedback.style.color=isError?'var(--tool-danger)':'var(--tool-success)'; copyFeedback.classList.add('show'); setTimeout(() => { copyFeedback.classList.remove('show'); }, 3000); setTimeout(() => { copyFeedback.textContent=''; }, 3500); }
    function insertTextAtCursor(inputElement, textToInsert) { const startPos=inputElement.selectionStart; const endPos=inputElement.selectionEnd; const currentVal=inputElement.value; inputElement.value=currentVal.substring(0,startPos)+textToInsert+currentVal.substring(endPos,currentVal.length); inputElement.focus(); const newPos=startPos+textToInsert.length; inputElement.setSelectionRange(newPos, newPos); }


    // --- Inicialização da Ferramenta ---
    function initializeTool() {
        // Popula sugestões de cores
        colorSuggestionsContainer.innerHTML = ''; // Limpa antes de popular
        SUGGESTED_COLORS.forEach(color => {
            const swatch = document.createElement('span');
            // ... (código para criar e adicionar swatch - igual ao anterior) ...
             swatch.classList.add('color-swatch');
            swatch.style.backgroundColor = color.hex;
            swatch.title = `${color.name} (${color.hex})`;
            swatch.dataset.hex = color.hex;
            if(color.hex.toUpperCase() === brandColorInput.value.toUpperCase()) swatch.innerHTML = '✓'; // Marca inicial
            swatch.addEventListener('click', () => {
                brandColorInput.value = color.hex;
                brandColorPicker.value = color.hex;
                updateSwatchCheckmark();
            });
            colorSuggestionsContainer.appendChild(swatch);
        });

        // Sincroniza Color Picker e Input Texto
        brandColorPicker.addEventListener('input', (e) => { brandColorInput.value = e.target.value.toUpperCase(); updateSwatchCheckmark(); });
        brandColorInput.addEventListener('input', (e) => {
            const hexValue = e.target.value.toUpperCase();
            if (/^#[0-9A-F]{6}$/i.test(hexValue)) { brandColorPicker.value = hexValue; }
             updateSwatchCheckmark(); // Atualiza mesmo se inválido para remover checkmark antigo
        });

        // Adiciona listeners aos emojis
        emojiPalettes.forEach(palette => { /* ... (código igual ao anterior) ... */
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

         // Listeners dos botões principais
         generateFieldsButton?.addEventListener('click', generateProductFields);
         previewButton?.addEventListener('click', previewGeneratedCode);
         generateCodeButton?.addEventListener('click', triggerCodeGenerationAndDisplay);
         copyCodeButton?.addEventListener('click', copyCodeToClipboard);
         closePreviewButton?.addEventListener('click', closePreviewModal);
         openPreviewNewTabButton?.addEventListener('click', openPreviewInNewTab);
         previewModal?.addEventListener('click', (e) => { if (e.target === previewModal) closePreviewModal(); });

         // Estado inicial
         disableActionButtons();
    }
     function updateSwatchCheckmark() {
         // ... (código igual ao anterior) ...
         const currentHex = brandColorInput.value.toUpperCase();
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.innerHTML = (swatch.dataset.hex.toUpperCase() === currentHex) ? '✓' : '';
        });
     }
     function disableActionButtons() {
        generateCodeButton.disabled = true;
        previewButton.disabled = true;
        copyCodeButton.disabled = true;
     }
      function enableActionButtons() {
        generateCodeButton.disabled = false;
        previewButton.disabled = false;
        // copyCodeButton continua desabilitado até o código ser gerado
    }


    // --- Gera os campos dos produtos ---
    function generateProductFields() {
        const count = parseInt(productCountInput.value) || 0;
        productFieldsContainer.innerHTML = '';
        copyFeedback.textContent = '';
        outputSection.style.display = 'none';
        disableActionButtons();

        if (count <= 0) {
             productFieldsContainer.innerHTML = '<p class="placeholder-text error-text">O número de produtos deve ser maior que zero.</p>';
             return;
        }
        if (count > 50) {
            productFieldsContainer.innerHTML = '<p class="placeholder-text error-text">Limite de 50 produtos.</p>';
            return;
        }

        for (let i = 1; i <= count; i++) {
            // ... (código para criar os inputs - igual ao anterior) ...
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
         enableActionButtons(); // Habilita botões após criar campos
    }

    // --- Valida e Coleta Dados ---
    function collectAndValidateData() {
        let data = {
            pageTitle: sanitizeHTML(pageTitleInput.value.trim() || 'Meus Achadinhos'),
            pageDesc: sanitizeHTML(pageDescInput.value.trim() || 'Confira minha seleção!'),
            brandColor: /^#[0-9A-F]{6}$/i.test(brandColorInput.value.trim()) ? brandColorInput.value.trim() : DEFAULT_BRAND_COLOR,
            // Coleta links sociais
            socials: {
                instagram: sanitizeHTML(socialInstagramInput.value.trim()),
                tiktok: sanitizeHTML(socialTiktokInput.value.trim()),
                facebook: sanitizeHTML(socialFacebookInput.value.trim()),
                youtube: sanitizeHTML(socialYoutubeInput.value.trim()),
                whatsapp: sanitizeHTML(socialWhatsappInput.value.trim()),
                telegram: sanitizeHTML(socialTelegramInput.value.trim()),
            },
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
                productData[input.dataset.field] = value;
            });
            // Adiciona mesmo se inválido para manter a ordem, a validação geral impede de prosseguir
            data.products.push(productData);
        });

        if (!isValid) {
             alert('Atenção! Preencha todos os campos obrigatórios (*) marcados em vermelho nos produtos.');
             return null;
        }
        return data;
    }

    // --- Monta o HTML dos produtos ---
    function buildProductCardsHTML(products) {
         // ... (código igual ao anterior) ...
        let html = '';
        products.forEach((product, index) => {
            const imgUrl = product.imageUrl || PLACEHOLDER_IMAGE;
            const numberId = sanitizeHTML(product.identifierNumber || `N°${String(index + 1).padStart(3, '0')}`);
            const name = sanitizeHTML(product.name || `Produto ${index + 1}`);
            const affiliateLink = sanitizeHTML(product.affiliateLink || '#');
            const safeAlt = name.substring(0, 70);
             html += `
            <div class="muralzao-product-card">
                <div class="muralzao-card-top">
                    <div class="muralzao-image-container"><img src="${imgUrl}" alt="${safeAlt}" loading="lazy"></div>
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

    // --- Monta o HTML das redes sociais ---
    function buildSocialLinksHTML(socials) {
        let html = '<div class="muralzao-socials">';
        let hasSocials = false;

        // Ícones SVG simples embutidos
        const icons = {
            instagram: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.598-.92c-.11-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.231s.008-2.389.046-3.232c.035-.78.166-1.204.275-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.843-.038 1.096-.047 3.232-.047zM8 4.905a3.095 3.095 0 1 0 0 6.19 3.095 3.095 0 0 0 0-6.19zm0 5.072a1.977 1.977 0 1 1 0-3.954 1.977 1.977 0 0 1 0 3.954zm5.853-4.012a.97.97 0 1 0 0-1.94.97.97 0 0 0 0 1.94z"/></svg>',
            tiktok: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2.372a3 3 0 1 0 0 5.728V5a5 5 0 1 1 5-5z"/></svg>',
            facebook:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0 0 3.603 0 8.05C0 12.055 2.91 15.213 6.765 15.975V10.366H4.719V8.05H6.765V6.274c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.316H10.28V15.975A8.02 8.02 0 0 0 16 8.049z"/></svg>',
            youtube: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.022.26-.01.104c-.048.519-.119 1.023-.22 1.402a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.042c-.59-.001-4.948-.024-6.068-.335a2.01 2.01 0 0 1-1.415-1.419c-.1-.38-.172-.883-.22-1.402l-.01-.104-.022-.26-.008-.104c-.065-.914-.073-1.77-.074-1.957v-.075c.001-.194.01-1.108.082-2.06l.008-.105.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c1.16-.312 5.569-.334 6.18-.335zM6.4 5.209v5.584l4.493-2.79z"/></svg>',
            whatsapp:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.358 0 7.92-3.562 7.921-7.981a7.85 7.85 0 0 0-2.328-5.603zm-4.068 11.562c-1.302 0-2.507-.374-3.567-1.036l-.244-.145-.642.169.17-1.592-.159-.251a6.6 6.6 0 0 1-1.007-3.656c0-3.603 2.929-6.533 6.525-6.533a6.5 6.5 0 0 1 4.614 1.909 6.5 6.5 0 0 1 1.903 4.615c-.003 3.6-2.922 6.52-6.516 6.52zm3.613-4.934c-.197-.1-.836-.414-1.084-.461-.247-.046-.426-.07-.606.07-.18.146-.691.831-.847.996-.156.165-.312.188-.559.046-.247-.144-1.043-.384-1.987-1.233-.739-.656-1.23-1.465-1.377-1.713-.147-.247-.016-.38.053-.515.06-.126.14-.32.21-.428.07-.108.09-.188.14-.313.046-.125.023-.231-.012-.318-.035-.086-.569-1.356-.779-1.853-.21-.497-.42-.43-.567-.436-.146-.007-.313-.007-.48-.007a.97.97 0 0 0-.691.312c-.21.21-.836.831-.836 1.996s.856 2.317.972 2.472c.117.156 1.687 2.578 4.092 3.614.588.25.976.405 1.312.518.523.172.99.146 1.364.088.414-.064 1.282-.524 1.464-.996.182-.473.182-.875.126-.996c-.056-.12-.197-.188-.414-.288z"/></svg>',
            telegram:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906q-.087.114-.217.247c-.138.135-.3.274-.503.433-1.13.978-1.94 1.663-2.498 2.143-.596.51-1.034 1.002-1.328 1.41a3.4 3.4 0 0 0-.16.417c-.03.145-.026.293.006.442.031.148.104.31.213.488a.8.8 0 0 0 .43.336.93.93 0 0 0 .51.038q.34-.11.62-.327a.93.93 0 0 0 .437-.655q.036-.21.03-.383a4.5 4.5 0 0 1 .125-.94l.073-.316.107-.468.128-.555c.1-.44.24-.873.428-1.29q.14-.31.32-.537c.137-.172.3-.306.488-.405.16-.08.34-.12.534-.12q.284 0 .528.098.274.11.45.305.15.16.23.372.09.22.07.465-.02.25-.09.48-.09.25-.22.49-.14.25-.3.46q-.16.2-.37.36a2 2 0 0 1-.5.27c-.2.07-.43.1-.66.1a.75.75 0 0 0-.5.18q-.18.16-.17.418c.004.1.04.2.11.32q.07.1.18.17.12.07.28.12.16.05.36.05.28 0 .58-.07c.3-.08.6-.2.9-.4q.25-.17.49-.42.22-.23.4-.5.16-.28.28-.6.1-.3.13-.65q.04-.35.03-.75-.005-.4-.06-.78-.06-.37-.16-.7-.1-.33-.25-.64-.14-.3-.33-.55a2 2 0 0 0-.51-.41 2 2 0 0 0-.63-.25q-.3-.06-.63-.06z"/></svg>'
        };

        if (socials.instagram) { html += `<a href="${socials.instagram}" target="_blank" rel="noopener noreferrer" class="social-link" title="Instagram">${icons.instagram}</a>`; hasSocials = true; }
        if (socials.tiktok) { html += `<a href="${socials.tiktok}" target="_blank" rel="noopener noreferrer" class="social-link" title="TikTok">${icons.tiktok}</a>`; hasSocials = true; }
        if (socials.facebook) { html += `<a href="${socials.facebook}" target="_blank" rel="noopener noreferrer" class="social-link" title="Facebook">${icons.facebook}</a>`; hasSocials = true; }
        if (socials.youtube) { html += `<a href="${socials.youtube}" target="_blank" rel="noopener noreferrer" class="social-link" title="YouTube">${icons.youtube}</a>`; hasSocials = true; }
        if (socials.whatsapp) { html += `<a href="${socials.whatsapp}" target="_blank" rel="noopener noreferrer" class="social-link" title="WhatsApp">${icons.whatsapp}</a>`; hasSocials = true; }
        if (socials.telegram) { html += `<a href="${socials.telegram}" target="_blank" rel="noopener noreferrer" class="social-link" title="Telegram">${icons.telegram}</a>`; hasSocials = true; }

        html += '</div>';
        return hasSocials ? html : ''; // Retorna string vazia se nenhuma rede foi preenchida
    }

     // --- Gera o Código Final Completo ---
    function generateCompleteCode(data) {
        if (!data) return null;
        const { pageTitle, pageDesc, brandColor, products, socials } = data;
        const brandColorDarker = shadeColor(brandColor, -15);
        const brandRgbaShadow = hexToRgba(brandColor, 0.15);
        const instructionBg = hexToRgba(brandColor, 0.08);
        const instructionBorder = hexToRgba(brandColor, 0.2);
        const productCardsHTML = buildProductCardsHTML(products);
        const socialLinksHTML = buildSocialLinksHTML(socials); // Gera HTML das redes

        const safePageTitle = sanitizeHTML(pageTitle);
        const safePageDesc = sanitizeHTML(pageDesc);

        // Template final inclui a seção de redes sociais e meta charset
        return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safePageTitle}</title> <!-- Título da aba usa o título da página -->
<style>
    /* Estilos Gerados (Inclui estilos para .muralzao-footer e .muralzao-socials) */
    :root { --muralzao-brand-color: ${brandColor}; /* ... (restante das variáveis CSS como antes) ... */ --muralzao-brand-darker: ${brandColorDarker}; --muralzao-shadow-focus: ${brandRgbaShadow}; --muralzao-instruction-bg: ${instructionBg}; --muralzao-instruction-border: ${instructionBorder}; --muralzao-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }
    .muralzao-body { font-family: var(--muralzao-font); background-color: #ffffff; color: #333; line-height: 1.6; padding: 0; margin: 0; width: 100%; }
    .muralzao-container { max-width: 1140px; margin: 10px auto; padding: clamp(10px, 3vw, 20px); }
    .muralzao-header { text-align: center; margin-bottom: 15px; }
    .muralzao-header h2 { color: #1a202c; margin-bottom: 4px; font-size: clamp(1.5em, 4vw, 2em); font-weight: 600; word-wrap: break-word; }
    .muralzao-header p { color: #718096; font-size: clamp(0.95em, 2.5vw, 1.1em); margin: 0; word-wrap: break-word; }
    .muralzao-instructions { background-color: var(--muralzao-instruction-bg); color: var(--muralzao-brand-darker); padding: 8px 15px; border-radius: 8px; font-weight: 500; display: inline-block; margin: 10px auto 0px; font-size: clamp(0.9em, 2.2vw, 1em); border: 1px solid var(--muralzao-instruction-border); }
    .muralzao-divider { height: 1px; background-color: var(--muralzao-brand-color); opacity: 0.3; border: none; margin: 25px auto; width: 60%; max-width: 400px; }
    .muralzao-search { margin-bottom: 30px; text-align: center; padding: 0 5px; }
    .muralzao-search-input { padding: 11px 18px 11px 40px; border: 1px solid #cbd5e0; border-radius: 50px; width: 100%; max-width: 480px; font-size: 0.95em; outline: none; transition: all 0.3s ease; background-color: #f8f9fa; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23A0AEC0' class='bi bi-search' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: 15px center; background-size: 15px; }
    .muralzao-search-input::placeholder { color: #a0aec0; }
    .muralzao-search-input:focus { border-color: var(--muralzao-brand-color); box-shadow: 0 0 0 3px var(--muralzao-shadow-focus); background-color: #fff; }
    .muralzao-product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(185px, 1fr)); gap: clamp(15px, 2.5vw, 20px); } /* Ajustado gap */
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
    /* Novo Footer e Socials */
    .muralzao-footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #edf2f7; text-align: center; }
    .muralzao-socials { margin-bottom: 15px; display: flex; justify-content: center; align-items: center; gap: 15px; flex-wrap: wrap; }
    .social-link { color: #4a5568; text-decoration: none; display: inline-block; transition: transform 0.2s ease, color 0.2s ease; }
    .social-link:hover { color: var(--muralzao-brand-color); transform: scale(1.1); }
    .social-link svg { width: 22px; height: 22px; vertical-align: middle; } /* Tamanho dos ícones */
    .muralzao-disclaimer { text-align: center; font-size: 0.75em; color: #a0aec0; }
    /* Responsividade */
    @media (max-width: 768px) { .muralzao-product-grid { grid-template-columns: repeat(auto-fill, minmax(165px, 1fr)); } }
    @media (max-width: 480px) { .muralzao-product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } .muralzao-container { padding: 8px;} .muralzao-header h2 {font-size: 1.4em;} .muralzao-header p {font-size: 0.9em;} .muralzao-instructions {font-size: 0.85em; margin-bottom: 0px;} .muralzao-divider { margin: 20px auto; } .muralzao-product-name {font-size: 0.8rem; min-height: 3.6em; -webkit-line-clamp: 3;} .muralzao-shopee-button { font-size: 0.9em; padding: 9px 10px;} .muralzao-search-input{font-size: 0.9em; padding: 10px 15px 10px 35px;} .muralzao-socials { gap: 12px; } .social-link svg { width: 20px; height: 20px;} }
</style>
</head>
<body class="muralzao-body">
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

        <footer class="muralzao-footer">
            ${socialLinksHTML} <!-- Links sociais inseridos aqui -->
            <div class="muralzao-disclaimer">
                <small>Como Afiliado(a), posso receber comissões por compras qualificadas originadas nesta página.</small>
            </div>
        </footer>
    </div>

<script>
    // Funções auxiliares (incluídas para autonomia)
    function muralzaoShadeColor(c,p){/* ... código ... */}
    function muralzaoHexToRgba(h,a){/* ... código ... */}

    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('muralzaoProductSearchInput');
        const productGrid = document.querySelector('.muralzao-product-grid');
        if (!searchInput || !productGrid) { return; }
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
                if(searchTerm.length > 0){ matchNumber = numberText.includes(searchTerm) || (pureSearchNumber.length > 0 && numberText.replace(/n°|nº|\\.|\\s/g,'').includes(pureSearchNumber)); }
                const matchName = nameText.includes(searchTerm);
                card.style.display = (matchNumber || matchName || searchTerm === '') ? 'flex' : 'none';
            });
        });
        // Aplicar cores via CSS Variables (injeção no :root do style block)
    });
<\/script>
<!-- Fim do Código Muralzão -->
`;
    }


    // --- Ações dos Botões ---
    function triggerCodeGenerationAndDisplay() { /* ... (igual anterior, chama collect e generateCompleteCode) ... */
         const data = collectAndValidateData(); if (!data) return; const finalCode = generateCompleteCode(data);
         if (finalCode) { generatedCodeOutput.value = finalCode; outputSection.style.display = 'block'; copyCodeButton.disabled = false; generatedCodeOutput.focus(); generatedCodeOutput.select(); outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
     }

    function previewGeneratedCode() { /* ... (igual anterior, chama collect e generateCompleteCode) ... */
        const data = collectAndValidateData(); if (!data) return; const previewCode = generateCompleteCode(data);
        if(previewCode) { previewIframe.srcdoc = previewCode; previewModal.style.display = 'flex'; setTimeout(() => previewModal.classList.add('show'), 10); }
    }

    function openPreviewInNewTab() { /* ... (igual anterior, com tratamento de erro) ... */
         const data = collectAndValidateData(); if (!data) return; const codeToOpen = generateCompleteCode(data);
         if(codeToOpen) { try { const blob = new Blob([codeToOpen], { type: 'text/html;charset=utf-8' }); /* Força UTF-8 no Blob */ const url = URL.createObjectURL(blob); const newTab = window.open(url, '_blank'); if (!newTab) { showCopyMsg('❌ Abertura de nova aba bloqueada!', true); } } catch (e) { showCopyMsg('❌ Erro ao abrir em nova aba.', true); console.error(e); } }
    }

    function closePreviewModal() { /* ... (igual anterior) ... */
        previewModal.classList.remove('show'); setTimeout(() => { previewModal.style.display = 'none'; previewIframe.srcdoc = '<html><body></body></html>'; }, 300);
    }

    function copyCodeToClipboard() { /* ... (igual anterior, com showCopyMsg) ... */
         if (!generatedCodeOutput.value) return; if (!navigator.clipboard) { try { generatedCodeOutput.select(); generatedCodeOutput.setSelectionRange(0, 99999); document.execCommand('copy'); showCopyMsg('✅ Código Copiado! (Fallback)'); } catch (err) { showCopyMsg('❌ Erro ao copiar. Use Ctrl+C.', true); } return; }
         navigator.clipboard.writeText(generatedCodeOutput.value).then(() => { showCopyMsg('✅ Código Copiado!'); copyCodeButton.disabled = true; copyCodeButton.textContent = 'Copiado!'; setTimeout(() => { copyCodeButton.disabled = false; copyCodeButton.textContent = '📋 Copiar Código'; }, 2500); }).catch(err => { showCopyMsg('❌ Erro ao copiar. Tente manualmente (Ctrl+C).', true); });
    }


    // --- Inicialização ---
    initializeTool();

}); // Fim DOMContentLoaded