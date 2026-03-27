// --- CONFIGURAÇÃO INICIAL E PERSISTÊNCIA ---
let astros = JSON.parse(localStorage.getItem('universo_v21')) || [];
let zoom = 1;

// Relógio HUD no topo esquerdo
function clock() {
    const agora = new Date();
    document.getElementById('relogio').innerText = agora.toLocaleTimeString('pt-BR');
}
setInterval(clock, 1000);
clock();

// --- CONTROLES DE INTERFACE ---

// Abre e fecha o menu lateral
function toggleMenu() {
    document.getElementById('menuPrincipal').classList.toggle('aberto');
}

// Controla o Zoom do universo (Botões + e -)
function mudarZoom(v) {
    zoom = Math.min(Math.max(0.3, zoom + v), 2.5);
    document.getElementById('universo').style.transform = `scale(${zoom})`;
}

// Salva os dados no navegador do usuário
function salvar() {
    localStorage.setItem('universo_v21', JSON.stringify(astros));
}

// --- LÓGICA DO SISTEMA SOLAR ---

// Adiciona um novo astro (Planeta Fixo ou Lua Variável)
function addAstro(tipo) {
    const nomeInput = document.getElementById('nome');
    const valorInput = document.getElementById('valor');
    const freqInput = document.getElementById('freq');

    const nome = nomeInput.value;
    const valor = parseFloat(valorInput.value);
    const freq = freqInput.value;

    if (!nome || isNaN(valor)) {
        alert("Por favor, preencha o nome e o valor corretamente!");
        return;
    }

    // Cria o objeto do astro
    const novoAstro = {
        id: Date.now(),
        nome: nome,
        valor: valor,
        tipo: tipo, // 'lucro' ou 'gasto'
        freq: freq, // 'fixo' ou 'variável'
        dist: Math.floor(Math.random() * 35) + 65, // Distância da órbita do planeta
        vel: (Math.random() * 5 + 4).toFixed(1) + "s" // Velocidade da órbita
    };

    astros.push(novoAstro);
    salvar();
    renderizar();

    // Limpa os campos do formulário
    nomeInput.value = "";
    valorInput.value = "";
}

// Remove um astro do sistema
function remover(id) {
    astros = astros.filter(a => a.id !== id);
    salvar();
    renderizar();
}

// --- RENDERIZAÇÃO (DESENHA TUDO NA TELA) ---
function renderizar() {
    const containerLucro = document.getElementById('luas-lucro');
    const containerGasto = document.getElementById('luas-gasto');
    const listaGestao = document.getElementById('lista-gestao');
    
    // Limpa containers antes de desenhar
    containerLucro.innerHTML = "";
    containerGasto.innerHTML = "";
    listaGestao.innerHTML = "";

    let receitaFixa = 0;
    let gastoFixo = 0;
    let saldoTotal = 0;

    astros.forEach(a => {
        // Calcula o Saldo Total
        if(a.tipo === 'lucro') {
            saldoTotal += a.valor;
        } else {
            saldoTotal -= a.valor;
        }

        // Se for FIXO, soma nos planetas (Terra/Marte)
        if(a.freq === 'fixo') {
            if(a.tipo === 'lucro') receitaFixa += a.valor;
            else gastoFixo += a.valor;
        } 
        // Se for VARIÁVEL, cria uma LUA orbitando o planeta
        else {
            const wrap = document.createElement('div');
            wrap.className = "wrap-lua";
            wrap.style.width = (a.dist * 2) + "px";
            wrap.style.height = (a.dist * 2) + "px";
            wrap.style.setProperty('--vel', a.vel);

            const lua = document.createElement('div');
            // 'gasto' aplica a imagem LuaM.png configurada no CSS
            lua.className = `corpo-celeste lua-item ${a.tipo === 'gasto' ? 'gasto' : ''}`;
            lua.style.top = "0";
            lua.style.left = "50%";
            lua.style.transform = "translateX(-50%)";
            
            wrap.appendChild(lua);
            if(a.tipo === 'lucro') containerLucro.appendChild(wrap);
            else containerGasto.appendChild(wrap);
        }

        // Adiciona o item na lista do menu lateral para poder excluir
        listaGestao.innerHTML += `
            <div style="padding:10px; border-bottom:1px solid #222; display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); margin-bottom:5px; border-radius:5px">
                <span><b>${a.nome}</b><br><small>R$ ${a.valor.toFixed(2)}</small></span>
                <button onclick="remover(${a.id})" style="background:none; border:1px solid #ff4444; color:#ff4444; padding:5px 8px; border-radius:4px; cursor:pointer">X</button>
            </div>
        `;
    });

    // Atualiza os textos dos Planetas e do Sol
    document.getElementById('val-lucro').innerText = "R$ " + receitaFixa.toFixed(2);
    document.getElementById('val-gasto').innerText = "R$ " + gastoFixo.toFixed(2);
    document.getElementById('valor-sol').innerText = "R$ " + saldoTotal.toFixed(2);

    // Lógica Visual do Sol / Buraco Negro
    const solElement = document.getElementById('sol-central');
    const labelSol = document.getElementById('label-sol');

    if(saldoTotal < 0) {
        solElement.classList.add('modo-buraco-negro');
        labelSol.innerText = "BURACO NEGRO";
    } else {
        solElement.classList.remove('modo-buraco-negro');
        labelSol.innerText = "SALDO TOTAL";
    }
}

// Inicia o sistema ao carregar a página
renderizar();
