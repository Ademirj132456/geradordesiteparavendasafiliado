// script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores DOM ---
    const pageTitleInput = document.getElementById('pageTitleInput');
    const pageDescInput = document.getElementById('pageDescInput');
    const brandColorInput = document.getElementById('brandColorInput');
    const brandColorPicker = document.getElementById('brandColorPicker');
    const colorSuggestionsContainer = document.getElementById('color-suggestions');
    const socialInputs = { instagram: document.getElementById('socialInstagram'), tiktok: document.getElementById('socialTiktok'), facebook: document.getElementById('socialFacebook'), youtube: document.getElementById('socialYoutube'), whatsapp: document.getElementById('socialWhatsapp'), telegram: document.getElementById('socialTelegram'), };
    const productCountInput = document.getElementById('productCountInput');
    const generateFieldsButton = document.getElementById('generateFieldsButton');
    const productFieldsContainer = document.getElementById('product-fields-container');
    const linkWarning = document.querySelector('.link-warning');
    const previewButton = document.getElementById('previewButton');
    const generateCodeButton = document.getElementById('generateCodeButton');
    const outputSection = document.getElementById('outputSection');
    const generatedCodeOutput = document.getElementById('generatedCodeOutput');
    const copyCodeButton = document.getElementById('copyCodeButton');
    const downloadCodeButton = document.getElementById('downloadCodeButton');
    const copyFeedback = document.getElementById('copyFeedback');
    const previewModal = document.getElementById('previewModal');
    const previewIframe = document.getElementById('previewIframe');
    const closePreviewButton = document.getElementById('closePreviewButton');
    const openPreviewNewTabButton = document.getElementById('openPreviewNewTabButton');
    const initialModal = document.getElementById('initialModal');
    const closeInitialModalButton = document.getElementById('closeInitialModalButton');
    const continueToGeneratorButton = document.getElementById('continueToGeneratorButton');
    const modalYoutubeButton = document.getElementById('modalYoutubeButton');
    const emptyFieldsModal = document.getElementById('emptyFieldsModal'); // Novo Modal
    const closeEmptyFieldsModalButton = document.getElementById('closeEmptyFieldsModalButton');
    const okEmptyFieldsButton = document.getElementById('okEmptyFieldsButton');
    const emojiPalettes = document.querySelectorAll('.emoji-palette');

    // --- Constantes e Configurações ---
    const DEFAULT_BRAND_COLOR = '#F58220';
    const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300.png/f8f8f8/cccccc?text=Sua+Imagem';
    const SUGGESTED_COLORS = [ { name: 'Laranja Padrão', hex: '#F58220' }, { name: 'Azul Claro', hex: '#3B82F6' }, { name: 'Verde Esmeralda', hex: '#10B981' },{ name: 'Roxo Íris', hex: '#8B5CF6' }, { name: 'Rosa Pink', hex: '#EC4899' }, { name: 'Cinza Chumbo', hex: '#4B5563' }, { name: 'Amarelo Sol', hex: '#F59E0B'}, { name: 'Azul Escuro', hex: '#1E3A8A'} ];
    let currentProductData = []; // Array para guardar dados dos produtos

    // --- Funções Auxiliares ---
    function shadeColor(c,p){if(!c||!/^#[0-9A-F]{6}$/i.test(c))return'#cc6a00';try{let R=parseInt(c.substring(1,3),16),G=parseInt(c.substring(3,5),16),B=parseInt(c.substring(5,7),16);R=parseInt(R*(100+p)/100);G=parseInt(G*(100+p)/100);B=parseInt(B*(100+p)/100);R=Math.min(255,Math.max(0,R));G=Math.min(255,Math.max(0,G));B=Math.min(255,Math.max(0,B));return"#"+R.toString(16).padStart(2,'0')+G.toString(16).padStart(2,'0')+B.toString(16).padStart(2,'0')}catch(e){console.error("ShadeColor Error:",e);return'#cc6a00'}}
    function hexToRgba(h,a){if(!h||!/^#[0-9A-F]{6}$/i.test(h))return`rgba(0,0,0,${a})`;try{const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return`rgba(${r},${g},${b},${a})`}catch(e){console.error("HexToRgba Error:",e);return`rgba(0,0,0,${a})`}}
    function sanitizeHTML(s){if(!s)return'';const t=document.createElement('div');t.textContent=s;return t.innerHTML}
    function showCopyMsg(m,e=!1){copyFeedback.textContent=m;copyFeedback.className=e?'copy-feedback show error':'copy-feedback show';setTimeout(()=>{copyFeedback.classList.remove('show');copyFeedback.classList.remove('error')},3000);setTimeout(()=>{copyFeedback.textContent=''},3500)}
    function insertTextAtCursor(el,t){if(!el)return;try{const s=el.selectionStart??el.value.length,e=el.selectionEnd??el.value.length,v=el.value;el.value=v.substring(0,s)+t+v.substring(e,v.length);el.focus();const n=s+t.length;el.setSelectionRange(n,n)}catch(err){console.error("Error inserting emoji:",err)}}
    function disableActionButtons(){generateCodeButton.disabled=true;previewButton.disabled=true;copyCodeButton.disabled=true;downloadCodeButton.disabled=true;}
    function enableActionButtons(){const c=parseInt(productCountInput.value)||0;if(c>0){generateCodeButton.disabled=false;previewButton.disabled=false;}else{disableActionButtons()}}
    function updateSwatchCheckmark(){const c=brandColorInput.value.toUpperCase();document.querySelectorAll('.color-swatch').forEach(s=>{s.innerHTML=(s.dataset.hex.toUpperCase()===c)?'✓':''})}

    // --- Inicialização da Ferramenta ---
    function initializeTool() {
        if(initialModal&&!sessionStorage.getItem('muralzaoModalShown')){initialModal.style.display='flex';setTimeout(()=>initialModal.classList.add('show'),50);sessionStorage.setItem('muralzaoModalShown','true')}else if(initialModal){initialModal.style.display='none'}
        colorSuggestionsContainer.innerHTML='';SUGGESTED_COLORS.forEach(c=>{const s=document.createElement('span');s.className='color-swatch';s.style.backgroundColor=c.hex;s.title=`${c.name} (${c.hex})`;s.dataset.hex=c.hex;if(c.hex.toUpperCase()===brandColorInput.value.toUpperCase())s.innerHTML='✓';s.addEventListener('click',()=>{brandColorInput.value=c.hex;brandColorPicker.value=c.hex;updateSwatchCheckmark()});colorSuggestionsContainer.appendChild(s)});
        brandColorPicker.addEventListener('input',(e)=>{brandColorInput.value=e.target.value.toUpperCase();updateSwatchCheckmark()});
        brandColorInput.addEventListener('input',(e)=>{const h=e.target.value.toUpperCase();if(/^#[0-9A-F]{6}$/i.test(h)){brandColorPicker.value=h}updateSwatchCheckmark()});
        emojiPalettes.forEach(p=>{const t=p.dataset.targetInput,i=document.getElementById(t);if(i){p.querySelectorAll('span').forEach(s=>{s.addEventListener('click',(ev)=>{ev.stopPropagation();insertTextAtCursor(i,s.textContent)})})}});
        generateFieldsButton?.addEventListener('click',generateProductFields);previewButton?.addEventListener('click',previewGeneratedCode);generateCodeButton?.addEventListener('click',triggerCodeGenerationAndDisplay);copyCodeButton?.addEventListener('click',copyCodeToClipboard);downloadCodeButton?.addEventListener('click',downloadCodeAsZip);
        closePreviewButton?.addEventListener('click',closePreviewModal);openPreviewNewTabButton?.addEventListener('click',openPreviewInNewTab);previewModal?.addEventListener('click',(e)=>{if(e.target===previewModal)closePreviewModal()});
        closeInitialModalButton?.addEventListener('click',closeInitialModal);continueToGeneratorButton?.addEventListener('click',closeInitialModal);modalYoutubeButton?.addEventListener('click',(e)=>e.stopPropagation());
        closeEmptyFieldsModalButton?.addEventListener('click', closeEmptyFieldsModal); // Listener para fechar modal de aviso
        okEmptyFieldsButton?.addEventListener('click', closeEmptyFieldsModal); // Listener para fechar modal de aviso

        disableActionButtons();productCountInput.value='0';
    }

    // --- Modais ---
    function closeInitialModal(){initialModal.classList.remove('show');setTimeout(()=>{initialModal.style.display='none'},300)}
    function closePreviewModal(){previewModal.classList.remove('show');setTimeout(()=>{previewModal.style.display='none';previewIframe.srcdoc='<html><body></body></html>'},300)}
    function showEmptyFieldsWarning(){emptyFieldsModal.style.display='flex';setTimeout(()=>emptyFieldsModal.classList.add('show'),10)}
    function closeEmptyFieldsModal(){emptyFieldsModal.classList.remove('show');setTimeout(()=>{emptyFieldsModal.style.display='none'},300)}

    // --- Preservar Dados ---
    function storeCurrentProductData(){const cF=productFieldsContainer.querySelectorAll('.product-input-group');currentProductData=[];cF.forEach((g,i)=>{const pD={};g.querySelectorAll('.product-input').forEach(n=>{pD[n.dataset.field]=n.value});currentProductData[i]=pD})}

    // --- Gerar Campos (Com Botão Remover e Preservando Dados) ---
    function generateProductFields() {
        storeCurrentProductData(); // Guarda antes

        const count = parseInt(productCountInput.value) || 0;
        productFieldsContainer.innerHTML = ''; copyFeedback.textContent = ''; outputSection.style.display = 'none'; linkWarning.style.display = 'none'; disableActionButtons();

        if (count <= 0) { productFieldsContainer.innerHTML = '<p class="placeholder-text error-text">O número de produtos deve ser maior que zero.</p>'; return; }
        if (count > 50) { productFieldsContainer.innerHTML = '<p class="placeholder-text error-text">Limite de 50 produtos.</p>'; return; }

        if(count > 0) linkWarning.style.display = 'block';

        for (let i = 1; i <= count; i++) {
            const productGroup = document.createElement('div'); productGroup.className = 'product-input-group'; productGroup.id = `product-group-${i}`; // Adiciona ID único
            const defaultNumber = `N°${String(i).padStart(3, '0')}`;
            const savedData = currentProductData[i-1] || {};

            productGroup.innerHTML = `<h3>Produto ${i} <button type="button" class="button danger-button remove-product-button" data-index="${i}" title="Remover este produto">Remover</button></h3>
                <div class=form-group><label for=imgUrl-${i}>URL da Imagem: <span class=required title=Obrigatório>*</span></label><input type=url class=product-input id=imgUrl-${i} data-field=imageUrl placeholder=https://... required value="${sanitizeHTML(savedData.imageUrl||'')}"></div>
                <div class=form-group><label for=numberId-${i}>Número Identificador: <span class=required title=Obrigatório>*</span></label><input type=text class=product-input id=numberId-${i} data-field=identifierNumber value="${sanitizeHTML(savedData.identifierNumber||defaultNumber)}" placeholder="Ex: N°001" required></div>
                <div class=form-group><label for=name-${i}>Nome do Produto: <span class=required title=Obrigatório>*</span></label><input type=text class=product-input id=name-${i} data-field=name placeholder="Nome conciso do produto" required value="${sanitizeHTML(savedData.name||'')}"></div>
                <div class=form-group><label for=affiliateLink-${i}>Link de Afiliado: <span class=required title=Obrigatório>*</span></label><input type=url class=product-input id=affiliateLink-${i} data-field=affiliateLink placeholder="SEU link CORRETO aqui!" required value="${sanitizeHTML(savedData.affiliateLink||'')}"><small style="color:var(--tool-danger);font-weight:500">Atenção: Verifique este link!</small></div>`;

            // Adiciona Listener ao botão Remover DESTE grupo específico
            const removeButton = productGroup.querySelector('.remove-product-button');
            removeButton.addEventListener('click', () => removeProductField(i));

            productFieldsContainer.appendChild(productGroup);
        }
        enableActionButtons();
    }

    // --- Remover Campo de Produto ---
    function removeProductField(indexToRemove) {
        const groupToRemove = document.getElementById(`product-group-${indexToRemove}`);
        if (groupToRemove) {
            groupToRemove.remove();
            // Reajusta o contador de produtos
            const remainingGroups = productFieldsContainer.querySelectorAll('.product-input-group');
            productCountInput.value = remainingGroups.length; // Atualiza input numérico
            // Renumera os títulos H3 dos grupos restantes (opcional, mas bom para UX)
            remainingGroups.forEach((group, newIndex) => {
                const h3 = group.querySelector('h3');
                const removeBtn = group.querySelector('.remove-product-button');
                const newNum = newIndex + 1;
                if (h3) h3.firstChild.textContent = `Produto ${newNum} `; // Atualiza o texto antes do botão
                if (removeBtn) removeBtn.dataset.index = newNum; // Atualiza o data-index do botão
                group.id = `product-group-${newNum}`; // Atualiza o ID do grupo
                // Atualiza os IDs e 'for' dos labels/inputs (importante!)
                group.querySelectorAll('label, input').forEach(el => {
                    if (el.id) el.id = el.id.replace(/-\d+$/, `-${newNum}`);
                    if (el.htmlFor) el.htmlFor = el.htmlFor.replace(/-\d+$/, `-${newNum}`);
                });
            });
             if (remainingGroups.length === 0) { // Se removeu o último
                 disableActionButtons();
                 linkWarning.style.display = 'none';
                 productFieldsContainer.innerHTML = '<p class="placeholder-text">Nenhum produto adicionado. Defina a quantidade e gere os campos.</p>';
            }
        }
    }

    // --- Valida e Coleta Dados (Verifica campos vazios) ---
    function collectAndValidateData(){
        let data={pageTitle:sanitizeHTML(pageTitleInput.value.trim()||'Meus Achadinhos'),pageDesc:sanitizeHTML(pageDescInput.value.trim()||'Confira minha seleção!'),brandColor:/^#[0-9A-F]{6}$/i.test(brandColorInput.value.trim())?brandColorInput.value.trim():DEFAULT_BRAND_COLOR,socials:{},products:[]};
        let hasEmptyRequiredFields = false;
        for(const k in socialInputs){if(socialInputs[k].value.trim()){data.socials[k]=sanitizeHTML(socialInputs[k].value.trim())}}
        const pG=productFieldsContainer.querySelectorAll('.product-input-group');
        if(pG.length === 0){ alert('Adicione pelo menos um produto antes de continuar.'); return null; } // Verifica se há produtos

        pG.forEach(g=>{const pD={};let pIV=!0;g.querySelectorAll('.product-input').forEach(i=>{const v=i.value.trim();if(i.required&&!v){i.classList.add('error');pIV=!1;hasEmptyRequiredFields=true;}else{i.classList.remove('error')}pD[i.dataset.field]=v});data.products.push(pD)});

        if(hasEmptyRequiredFields){
            showEmptyFieldsWarning(); // Mostra o modal de aviso
            return null; // Impede de prosseguir
        }
        return data
    }

    // --- Monta HTML Produtos ---
    function buildProductCardsHTML(products){let h='';products.forEach((p,idx)=>{const i=p.imageUrl||PLACEHOLDER_IMAGE,n=sanitizeHTML(p.identifierNumber||`N°${String(idx+1).padStart(3,'0')}`),m=sanitizeHTML(p.name||`Produto ${idx+1}`),l=sanitizeHTML(p.affiliateLink||'#'),a=m.substring(0,70);h+=`\n<div class=muralzao-product-card><div class=muralzao-card-top><div class=muralzao-image-container><img src="${i}" alt="${a}" loading=lazy></div><div class=muralzao-card-content><span class=muralzao-product-number>${n}</span><p class=muralzao-product-name title="${m}">${m}</p></div></div><a href="${l}" target=_blank rel="noopener noreferrer nofollow" class=muralzao-shopee-button>Ver na Shopee 🔥</a></div>`});return h}

    // --- Monta HTML Redes Sociais ---
    function buildSocialLinksHTML(socials) {
        let socialHTML = '', hasSocials = false;
        const icons = { instagram:'<svg fill="currentColor" width="24" height="24" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zM8 1.442a6.6 6.6 0 0 1 3.232.046c.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.598-.92c-.11-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.231s.008-2.389.046-3.232c.035-.78.166-1.204.275-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.843-.038 1.096-.047 3.232-.047zM8 4.905a3.095 3.095 0 1 0 0 6.19 3.095 3.095 0 0 0 0-6.19zm0 5.072a1.977 1.977 0 1 1 0-3.954 1.977 1.977 0 0 1 0 3.954zm5.853-4.012a.97.97 0 1 0 0-1.94.97.97 0 0 0 0 1.94z"/></svg>', tiktok:'<svg fill="currentColor" width="24" height="24" viewBox="0 0 16 16"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2.372a3 3 0 1 0 0 5.728V5a5 5 0 1 1 5-5z"/></svg>', facebook:'<svg fill="currentColor" width="24" height="24" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0 0 3.603 0 8.05C0 12.055 2.91 15.213 6.765 15.975V10.366H4.719V8.05H6.765V6.274c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.316H10.28V15.975A8.02 8.02 0 0 0 16 8.049z"/></svg>', youtube:'<svg fill="currentColor" width="24" height="24" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.022.26-.01.104c-.048.519-.119 1.023-.22 1.402a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.042c-.59-.001-4.948-.024-6.068-.335a2.01 2.01 0 0 1-1.415-1.419c-.1-.38-.172-.883-.22-1.402l-.01-.104-.022-.26-.008-.104c-.065-.914-.073-1.77-.074-1.957v-.075c.001-.194.01-1.108.082-2.06l.008-.105.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42C1.948 2.022 6.356 2 7.006 2h.045zM6.4 5.209v5.584l4.493-2.79z"/></svg>', whatsapp:'<svg fill="currentColor" width="24" height="24" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.358 0 7.92-3.562 7.921-7.981a7.85 7.85 0 0 0-2.328-5.603zm-4.068 11.562c-1.302 0-2.507-.374-3.567-1.036l-.244-.145-.642.169.17-1.592-.159-.251a6.6 6.6 0 0 1-1.007-3.656c0-3.603 2.929-6.533 6.525-6.533a6.5 6.5 0 0 1 4.614 1.909 6.5 6.5 0 0 1 1.903 4.615c-.003 3.6-2.922 6.52-6.516 6.52zm3.613-4.934c-.197-.1-.836-.414-1.084-.461-.247-.046-.426-.07-.606.07-.18.146-.691.831-.847.996-.156.165-.312.188-.559.046-.247-.144-1.043-.384-1.987-1.233-.739-.656-1.23-1.465-1.377-1.713-.147-.247-.016-.38.053-.515.06-.126.14-.32.21-.428.07-.108.09-.188.14-.313.046-.125.023-.231-.012-.318-.035-.086-.569-1.356-.779-1.853-.21-.497-.42-.43-.567-.436-.146-.007-.313-.007-.48-.007a.97.97 0 0 0-.691.312c-.21.21-.836.831-.836 1.996s.856 2.317.972 2.472c.117.156 1.687 2.578 4.092 3.614.588.25.976.405 1.312.518.523.172.99.146 1.364.088.414-.064 1.282-.524 1.464-.996.182-.473.182-.875.126-.996c-.056-.12-.197-.188-.414-.288z"/></svg>', telegram:'<svg fill="currentColor" width="24" height="24" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.087.114-.217.247-.361.383-.145.137-.319.28-.527.446-1.13.978-1.94 1.663-2.498 2.143-.596.51-1.034 1.002-1.328 1.41a3.4 3.4 0 0 0-.16.417c-.03.145-.026.293.006.442.031.148.104.31.213.488a.8.8 0 0 0 .43.336.93.93 0 0 0 .51.038c.18-.037.34-.11.47-.21.13-.1.24-.23.3-.38.06-.15.09-.32.1-.48a4.5 4.5 0 0 1 .125-.94l.073-.316.107-.468.128-.555c.1-.44.24-.873.428-1.29q.14-.31.32-.537c.137-.172.3-.306.488-.405.16-.08.34-.12.534-.12.284 0 .528.098.772.293.244.194.4.484.446.864.045.38-.054.77-.194 1.16-.14.39-.33.75-.57 1.08q-.24.33-.54.58a4.3 4.3 0 0 1-.77.48c-.3.13-.62.2-.96.2a4 4 0 0 1-1.1-.16c-.33-.1-.63-.25-.91-.46a4.7 4.7 0 0 1-1.24-1.11 6.5 6.5 0 0 1-.86-1.45A4 4 0 0 1 3.5 8.5c0-.4.07-.78.2-1.14a2.8 2.8 0 0 1 .55-.9.8.8 0 0 1 .5-.26 1.2 1.2 0 0 1 .72.07c.25.07.48.2.68.38.2.18.35.38.46.62q.1.24.13.51z"/></svg>' };
        for (const n in socials) { if (socials[n] && icons[n]) { socialHTML += `<a href="${sanitizeHTML(socials[n])}" target="_blank" rel="noopener noreferrer nofollow" class="social-link" title="${n.charAt(0).toUpperCase()+n.slice(1)}">${icons[n]}</a>`; hasSocials = true; } }
        return hasSocials ? `<div class="muralzao-socials">${socialHTML}</div>` : '';
    }

     // --- Gera o Código Final Completo ---
    function generateCompleteCode(data) {
        if (!data) return null;
        const { pageTitle:pT, pageDesc:pD, brandColor:bC, products:ps, socials:s } = data;
        const bCD=shadeColor(bC,-15),bRS=hexToRgba(bC,.15),iBg=hexToRgba(bC,.08),iBo=hexToRgba(bC,.2);
        const pCH=buildProductCardsHTML(ps); const sLH=buildSocialLinksHTML(s);
        const sPT=sanitizeHTML(pT),sPD=sanitizeHTML(pD);

        // CSS completo (inclua o CSS COMPLETO da V6 aqui)
        const finalCSS = `
<style>
    :root{--muralzao-brand-color:${bC};--muralzao-brand-darker:${bCD};--muralzao-shadow-focus:${bRS};--muralzao-instruction-bg:${iBg};--muralzao-instruction-border:${iBo};--muralzao-font:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif}
    .muralzao-body{font-family:var(--muralzao-font);background-color:#fff;color:#333;line-height:1.6;padding:0;margin:0;width:100%}
    .muralzao-container{max-width:1140px;margin:10px auto;padding:clamp(10px,3vw,20px)}
    .muralzao-header{text-align:center;margin-bottom:15px}
    .muralzao-header h2{color:#1a202c;margin-bottom:4px;font-size:clamp(1.5em,4vw,2em);font-weight:600;word-wrap:break-word}
    .muralzao-header p{color:#718096;font-size:clamp(.95em,2.5vw,1.1em);margin:0;word-wrap:break-word}
    .muralzao-instructions{background-color:var(--muralzao-instruction-bg);color:var(--muralzao-brand-darker);padding:8px 15px;border-radius:8px;font-weight:500;display:inline-block;margin:10px auto 0;font-size:clamp(.9em,2.2vw,1em);border:1px solid var(--muralzao-instruction-border)}
    .muralzao-divider{height:1px;background-color:var(--muralzao-brand-color);opacity:.3;border:none;margin:25px auto;width:60%;max-width:400px}
    .muralzao-search{margin-bottom:30px;text-align:center;padding:0 5px}
    .muralzao-search-input{padding:11px 18px 11px 40px;border:1px solid #cbd5e0;border-radius:50px;width:100%;max-width:480px;font-size:.95em;outline:0;transition:all .3s ease;background-color:#f8f9fa;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23A0AEC0' class='bi bi-search' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zm12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:15px center;background-size:15px}
    .muralzao-search-input::placeholder{color:#a0aec0}
    .muralzao-search-input:focus{border-color:var(--muralzao-brand-color);box-shadow:0 0 0 3px var(--muralzao-shadow-focus);background-color:#fff}
    .muralzao-product-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(185px,1fr));gap:clamp(15px,2.5vw,20px)}
    .muralzao-product-card{background-color:#fff;border:1px solid #e8e8f0;border-radius:10px;text-align:center;box-shadow:0 3px 7px rgba(0,0,0,.05);transition:transform .2s ease-out,box-shadow .2s ease-out;display:flex;flex-direction:column;overflow:hidden}
    .muralzao-product-card:hover{transform:translateY(-4px);box-shadow:0 8px 18px rgba(0,0,0,.08)}
    .muralzao-card-top{display:flex;flex-direction:column;flex-grow:1;text-decoration:none;color:inherit}
    .muralzao-image-container{width:100%;padding-top:100%;position:relative;background-color:#f8f8f8;border-bottom:1px solid #f1f1f1}
    .muralzao-image-container img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;transition:transform .25s ease;border-top-left-radius:9px;border-top-right-radius:9px}
    .muralzao-product-card:hover img{transform:scale(1.03)}
    .muralzao-card-content{padding:12px 10px 8px;flex-grow:1}
    .muralzao-product-number{font-weight:700;font-size:1.1em;color:var(--muralzao-brand-color);display:block;margin-bottom:5px}
    .muralzao-product-name{font-size:.9rem;color:#4a5568;margin-bottom:8px;font-weight:500;line-height:1.4;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;min-height:4.2em}
    .muralzao-shopee-button{display:block;background:var(--muralzao-brand-color);color:#fff!important;padding:10px 15px;text-decoration:none!important;border-bottom-left-radius:9px;border-bottom-right-radius:9px;font-weight:600;transition:background-color .2s ease;border:none;cursor:pointer;font-size:.95em;text-align:center;border-top:1px solid #eee}
    .muralzao-shopee-button:hover{background:var(--muralzao-brand-darker);color:#fff!important}
    .muralzao-footer{margin-top:40px;padding-top:20px;border-top:1px solid #edf2f7;text-align:center}
    .muralzao-socials{margin-bottom:15px;display:flex;justify-content:center;align-items:center;gap:18px;flex-wrap:wrap}
    .social-link{color:#4a5568;text-decoration:none;display:inline-block;transition:transform .2s ease,color .2s ease}
    .social-link:hover{color:var(--muralzao-brand-color);transform:scale(1.15)}
    .social-link svg{width:24px;height:24px;vertical-align:middle;fill:currentColor;} /* Garante que o SVG pegue a cor */
    .muralzao-disclaimer{font-size:.75em;color:#a0aec0}
    .muralzao-promo-footer{margin-top:25px;padding-top:15px;border-top:1px dashed #ccc;text-align:center;font-size:.85em;color:#718096}
    .muralzao-promo-footer p{margin-bottom:8px}
    .muralzao-promo-footer a{color:var(--muralzao-brand-color);text-decoration:none;font-weight:600}
    .muralzao-promo-footer a:hover{text-decoration:underline}
    .muralzao-promo-footer .muralzao-socials{margin-top:8px;} /* Espaço no footer de promo */
    .muralzao-promo-footer .social-link svg{width:20px;height:20px} /* Ícones menores na promo */
    @media(max-width:768px){.muralzao-product-grid{grid-template-columns:repeat(auto-fill,minmax(170px,1fr))}}
    @media(max-width:480px){.muralzao-product-grid{grid-template-columns:repeat(2,1fr);gap:12px}.muralzao-container{padding:8px}.muralzao-header h2{font-size:1.4em}.muralzao-header p{font-size:.95em}.muralzao-instructions{font-size:.85em;margin-bottom:0}.muralzao-divider{margin:20px auto}.muralzao-product-name{font-size:.8rem;min-height:3.6em;-webkit-line-clamp:3}.muralzao-shopee-button{font-size:.85em;padding:8px 10px}.muralzao-search-input{font-size:.9em;padding:10px 15px 10px 35px}.muralzao-socials{gap:15px}.social-link svg{width:22px;height:22px}}
</style>`;
        // JS completo (incluindo funções auxiliares)
        const finalJS = `
<script>
    function muralzaoShadeColor(c,p){if(!c||!/^#[0-9A-F]{6}$/i.test(c))return'#cc6a00';try{let R=parseInt(c.substring(1,3),16),G=parseInt(c.substring(3,5),16),B=parseInt(c.substring(5,7),16);R=parseInt(R*(100+p)/100);G=parseInt(G*(100+p)/100);B=parseInt(B*(100+p)/100);R=Math.min(255,Math.max(0,R));G=Math.min(255,Math.max(0,G));B=Math.min(255,Math.max(0,B));return"#"+R.toString(16).padStart(2,'0')+G.toString(16).padStart(2,'0')+B.toString(16).padStart(2,'0')}catch(e){return'#cc6a00'}}
    function muralzaoHexToRgba(h,a){if(!h||!/^#[0-9A-F]{6}$/i.test(h))return\`rgba(0,0,0,\${a})\`;try{const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return\`rgba(\${r},\${g},\${b},\${a})\`}catch(e){return\`rgba(0,0,0,\${a})\`}}
    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('muralzaoProductSearchInput');
        const productGrid = document.querySelector('.muralzao-product-grid');
        if (!searchInput || !productGrid) { return; }
        const productCards = productGrid.querySelectorAll('.muralzao-product-card');
        const brandColor = '${bC}';
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            productCards.forEach(card => {
                const numberEl = card.querySelector('.muralzao-product-number');
                const nameEl = card.querySelector('.muralzao-product-name');
                const numberText = numberEl ? numberEl.textContent.toLowerCase() : '';
                const nameText = nameEl ? nameEl.textContent.toLowerCase() : '';
                const pureSearchNumber = searchTerm.replace(/n°|nº|\\.|\\s|,/g,'').trim(); // Remove mais caracteres
                let matchNumber = false;
                if (searchTerm.length > 0) {
                    const pureNumberText = numberText.replace(/n°|nº|\\.|\\s|,/g, '').trim();
                    matchNumber = numberText.includes(searchTerm) || (pureSearchNumber.length > 0 && pureNumberText.includes(pureSearchNumber));
                 }
                const matchName = nameText.includes(searchTerm);
                card.style.display = (matchNumber || matchName || searchTerm === '') ? 'flex' : 'none';
            });
        });
         const bodyElement = document.querySelector('.muralzao-body');
         if(bodyElement) {
             bodyElement.style.setProperty('--muralzao-brand-color', brandColor);
             bodyElement.style.setProperty('--muralzao-brand-darker', muralzaoShadeColor(brandColor, -15));
             bodyElement.style.setProperty('--muralzao-shadow-focus', muralzaoHexToRgba(brandColor, .15));
             bodyElement.style.setProperty('--muralzao-instruction-bg', muralzaoHexToRgba(brandColor, .08));
             bodyElement.style.setProperty('--muralzao-instruction-border', muralzaoHexToRgba(brandColor, .2));
         }
    });
<\/script>`;

        // Montagem final do HTML Completo
        return `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${sPT}</title>\n${finalCSS}\n</head>\n<body class="muralzao-body">\n    <div class="muralzao-container">\n        <div class="muralzao-header">\n            <h2>${sPT}</h2>\n            <p>${sPD}</p>\n            <div class="muralzao-instructions"><span>👇 Procure pelo <strong>NÚMERO</strong> ou <strong>NOME</strong> do produto abaixo! 👇</span></div>\n        </div>\n        <hr class="muralzao-divider">\n        <div class="muralzao-search"><input type="text" id="muralzaoProductSearchInput" class="muralzao-search-input" placeholder="Digite o N° ou nome do produto..."></div>\n        <div class="muralzao-product-grid">${pCH}</div>\n        <footer class="muralzao-footer">\n            ${sLH}\n            <div class="muralzao-promo-footer">\n                <p>Gostou desta página? Crie a sua também!</p>\n                <p><a href="LINK_PARA_SUA_FERRAMENTA_GERADORA" target="_blank"><strong>Clique aqui para usar o Gerador Muralzão!</strong></a></p>\n                <p>Siga o Muralzão:</p>\n                <div class="muralzao-socials">\n                    <a href="LINK_INSTA_MURALZAO" target="_blank" rel="noopener noreferrer nofollow" class="social-link" title="Instagram Muralzão"><svg fill="currentColor" width="20" height="20" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-.923 1.417A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 .923-1.417c.445-.445.718-.891.923-1.416.198-.51.333-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zM8 1.442a6.6 6.6 0 0 1 3.232.046c.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485C14.992 6.444 15 6.717 15 8s-.008 1.556-.047 2.399c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.598-.92c-.11-.281-.24-.705-.275-1.485C1.008 9.556 1 9.283 1 8s.008-1.556.046-2.399c.035-.78.166-1.204.275-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276C5.557 1.449 5.83 1.442 8 1.442zm0 2.88a3.678 3.678 0 1 0 0 7.356 3.678 3.678 0 0 0 0-7.356zM8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4.853-6.91a.97.97 0 1 0 0-1.94.97.97 0 0 0 0 1.94z"/></svg></a>\n                    <a href="LINK_TIKTOK_MURALZAO" target="_blank" rel="noopener noreferrer nofollow" class="social-link" title="TikTok Muralzão"><svg fill="currentColor" width="20" height="20" viewBox="0 0 16 16"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2.372a3 3 0 1 0 0 5.728V5a5 5 0 1 1 5-5z"/></svg></a>\n                    <a href="LINK_YOUTUBE_MURALZAO" target="_blank" rel="noopener noreferrer nofollow" class="social-link" title="YouTube Muralzão"><svg fill="currentColor" width="20" height="20" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.022.26-.01.104c-.048.519-.119 1.023-.22 1.402a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.042c-.59-.001-4.948-.024-6.068-.335a2.01 2.01 0 0 1-1.415-1.419c-.1-.38-.172-.883-.22-1.402l-.01-.104-.022-.26-.008-.104c-.065-.914-.073-1.77-.074-1.957v-.075c.001-.194.01-1.108.082-2.06l.008-.105.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42C1.948 2.022 6.356 2 7.006 2h.045zM6.4 5.209v5.584l4.493-2.79z"/></svg></a>\n                </div>\n            </div>\n            <div class="muralzao-disclaimer"><small>Como Afiliado(a), posso receber comissões por compras qualificadas.</small></div>\n        </footer>\n    </div>\n${finalJS}\n</body>\n</html>\n<!-- Fim do Código Muralzão -->`;
    }

    // --- Funções do Modal de Preview ---
    function previewGeneratedCode() { const d=collectAndValidateData();if(!d)return;const p=generateCompleteCode(d);if(p){previewIframe.srcdoc=p;previewModal.style.display='flex';setTimeout(()=>previewModal.classList.add('show'),10)} }
    function openPreviewInNewTab() { const d=collectAndValidateData();if(!d)return;const c=generateCompleteCode(d);if(c){try{const b=new Blob([c],{type:'text/html;charset=utf-8'});const u=URL.createObjectURL(b);const n=window.open(u,'_blank');if(!n){showCopyMsg('❌ Abertura de nova aba bloqueada!',true)}}catch(e){showCopyMsg('❌ Erro ao abrir em nova aba.',true);console.error(e)}} }
    function closePreviewModal() { previewModal.classList.remove('show');setTimeout(()=>{previewModal.style.display='none';previewIframe.srcdoc='<html><head><meta charset="UTF-8"></head><body></body></html>'},300); }

    // --- Funções de Geração Final, Cópia e Download ---
    function triggerCodeGenerationAndDisplay() { const d=collectAndValidateData();if(!d)return;const f=generateCompleteCode(d);if(f){generatedCodeOutput.value=f;outputSection.style.display='block';copyCodeButton.disabled=false;downloadCodeButton.disabled=false;generatedCodeOutput.focus();generatedCodeOutput.select();outputSection.scrollIntoView({behavior:'smooth',block:'start'})} }
    function copyCodeToClipboard() { if(!generatedCodeOutput.value)return;if(!navigator.clipboard){try{generatedCodeOutput.select();generatedCodeOutput.setSelectionRange(0,99999);document.execCommand('copy');showCopyMsg('✅ Código Copiado! (Fallback)')}catch(err){showCopyMsg('❌ Erro ao copiar. Use Ctrl+C.',true)}return}navigator.clipboard.writeText(generatedCodeOutput.value).then(()=>{showCopyMsg('✅ Código Copiado!');copyCodeButton.disabled=true;copyCodeButton.textContent='Copiado!';setTimeout(()=>{copyCodeButton.disabled=false;copyCodeButton.textContent='📋 Copiar Código (Google Sites)'},2500)}).catch(err=>{showCopyMsg('❌ Erro ao copiar. Tente manualmente (Ctrl+C).',true)})}
    function downloadCodeAsZip() { const finalCode=generatedCodeOutput.value;if(!finalCode){showCopyMsg('❌ Gere o código primeiro!',true);return}if(typeof JSZip==='undefined'){showCopyMsg('❌ Erro: JSZip não carregado.',true);return}try{const zip=new JSZip();const siteFolder=zip.folder("site");siteFolder.file("vendas.html",finalCode);zip.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:6}}).then(content=>{const link=document.createElement('a');link.href=URL.createObjectURL(content);link.download="muralzao_colecao.zip";document.body.appendChild(link);link.click();document.body.removeChild(link);URL.revokeObjectURL(link.href);showCopyMsg('✅ Arquivo .zip baixado!')}).catch(e=>{showCopyMsg('❌ Erro ao gerar .zip.',true);console.error("Zip gen error:",e)})}catch(e){showCopyMsg('❌ Erro no download.',true);console.error("Download error:",e)}}

    // --- Inicialização ---
    initializeTool();

});