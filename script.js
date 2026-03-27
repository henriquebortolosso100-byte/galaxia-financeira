let astros = JSON.parse(localStorage.getItem('universo_v21')) || [];
let zoom = 1;

function clock() {
    document.getElementById('relogio').innerText = new Date().toLocaleTimeString('pt-BR');
}
setInterval(clock, 1000); clock();

function toggleMenu() { document.getElementById('menuPrincipal').classList.toggle('aberto'); }

function mudarZoom(v) {
    zoom = Math.min(Math.max(0.3, zoom + v), 2.5);
    document.getElementById('universo').style.transform = `scale(${zoom})`;
}

function salvar() { localStorage.setItem('universo_v21', JSON.stringify(astros)); }

function formatar(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

function addAstro(tipo) {
    const nome = document.getElementById('nome').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const freq = document.getElementById('freq').value;
    if (!nome || isNaN(valor)) return alert("Preencha Nome e Valor!");

    astros.push({
        id: Date.now(), nome, valor, tipo, freq,
        dist: Math.floor(Math.random() * 40) + 85,
        vel: (Math.random() * 5 + 4).toFixed(1) + "s"
    });
    salvar(); renderizar();
    document.getElementById('nome').value = ""; document.getElementById('valor').value = "";
}

function remover(id) {
    astros = astros.filter(a => a.id !== id);
    salvar(); renderizar();
}

function renderizar() {
    const cLucro = document.getElementById('luas-lucro');
    const cGasto = document.getElementById('luas-gasto');
    const lista = document.getElementById('lista-gestao');
    
    if(!cLucro || !cGasto) return;

    cLucro.innerHTML = ""; cGasto.innerHTML = ""; 
    lista.innerHTML = `<h4>Gestão Financeira</h4>`;
    
    let rF = 0, gF = 0, total = 0;

    astros.forEach(a => {
        if(a.tipo === 'lucro') total += a.valor; else total -= a.valor;

        if(a.freq === 'fixo') {
            if(a.tipo === 'lucro') rF += a.valor; else gF += a.valor;
        } else {
            const wrap = document.createElement('div');
            wrap.className = "wrap-lua";
            wrap.style.width = (a.dist * 2) + "px"; wrap.style.height = (a.dist * 2) + "px";
            wrap.style.setProperty('--vel', a.vel);

            const lua = document.createElement('div');
            lua.className = `corpo-celeste lua-item ${a.tipo === 'gasto' ? 'gasto' : ''}`;
            lua.style.top = "0"; 
            
            wrap.appendChild(lua);
            (a.tipo === 'lucro' ? cLucro : cGasto).appendChild(wrap);
        }

        lista.innerHTML += `<div style="padding:10px; border-bottom:1px solid #333; display:flex; justify-content:space-between">
            <span>${a.nome}<br><small>${formatar(a.valor)}</small></span>
            <button onclick="remover(${a.id})" style="color:#ff4444; background:none; border:none; cursor:pointer">X</button>
        </div>`;
    });

    document.getElementById('val-lucro').innerText = formatar(rF);
    document.getElementById('val-gasto').innerText = formatar(gF);
    document.getElementById('valor-sol').innerText = formatar(total);

    const sol = document.getElementById('sol-central');
    if(total < 0) sol.classList.add('modo-buraco-negro'); else sol.classList.remove('modo-buraco-negro');
}
renderizar();
