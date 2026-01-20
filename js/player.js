import { db, ref, onValue, runTransaction } from './firebase-config.js';

let gameRef = null;

// --- Sistema de Login ---
function iniciarJogo(sala) {
    // 1. Troca a tela
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'flex';
    document.getElementById('room-display').innerText = sala;

    // 2. Conecta ao Firebase
    gameRef = ref(db, `partidas/${sala}`);
    onValue(gameRef, (snap) => atualizarInterface(snap.val()));
}

// Botão Entrar
document.getElementById('btn-login').addEventListener('click', () => {
    const val = document.getElementById('input-sala').value;
    if(val) {
        const clean = val.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        // Atualiza URL sem recarregar
        window.history.pushState({}, "", `?sala=${clean}`);
        iniciarJogo(clean);
    }
});

// Auto-login pela URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('sala')) {
    iniciarJogo(urlParams.get('sala'));
}

// --- Renderização ---
function atualizarInterface(dados) {
    if (!dados) return;
    
    // 1. Atualiza Textos do Topo
    document.getElementById('fase-tag').innerText = dados.fase === 'planning' ? "PLANNING" : `Dia ${dados.dia}`;
    
    const eDev = dados.energyDev || 0;
    const eQA = dados.energyQA || 0;

    // 2. Atualiza Textos de Energia
    document.getElementById('text-dev').innerText = eDev;
    document.getElementById('text-qa').innerText = eQA;

    // 3. Atualiza BARRAS VISUAIS de Energia
    // Base de cálculo: 8 para Dev e 5 para QA (máximos estimados para a barra ficar cheia)
    const pctDev = Math.min(100, (eDev / 8) * 100);
    const pctQA = Math.min(100, (eQA / 5) * 100);

    const barDev = document.getElementById('bar-dev');
    const barQA = document.getElementById('bar-qa');
    
    if(barDev) barDev.style.width = `${pctDev}%`;
    if(barQA) barQA.style.width = `${pctQA}%`;

    // 4. Renderiza Colunas (Mantém igual)
    ['backlog', 'todo', 'doing', 'testing', 'deploy'].forEach(c => {
        const el = document.getElementById(`list-${c}`);
        if(el) el.innerHTML = '';
    });

    if (dados.cartas) {
        Object.entries(dados.cartas).forEach(([id, carta]) => {
            const cardEl = criarElementoCarta(id, carta, dados.fase, dados.upgrades);
            const container = document.getElementById(`list-${carta.status}`);
            if(container) container.appendChild(cardEl);
        });
    }
}

// --- Criação do HTML do Card (Visual Rico) ---
function criarElementoCarta(id, carta, fase, upgrades) {
    const div = document.createElement('div');
    
    // === TIPO 1: FEATURE (Backlog) ===
    if (carta.tipo === 'feature') {
        div.className = 'card feature-card';
        div.style.borderLeftColor = carta.cor;
        
        const isTech = carta.efeito ? true : false;
        
        div.innerHTML = `
            <div class="${isTech ? 'tech-badge' : 'feature-badge'}">${isTech ? 'TECH' : 'FEATURE'}</div>
            <strong>${carta.titulo}</strong>
            <div class="card-value">${isTech ? 'Gera Upgrade' : 'Valor: $' + carta.valor_entregavel}</div>
        `;
    } 
    // === TIPO 2: TASK (Sprint) ===
    else {
        div.className = `card ${carta.is_tech ? 'tech-card' : ''}`;
        
        // Cores da borda por status
        if(carta.status === 'doing') div.style.borderLeftColor = '#3b82f6';   
        else if(carta.status === 'testing') div.style.borderLeftColor = '#d946ef'; 
        else if(carta.status === 'deploy') div.style.borderLeftColor = '#f97316';  
        else if(carta.status === 'done') div.style.borderLeftColor = '#10b981';    
        else div.style.borderLeftColor = '#ccc'; 

        // HTML Base da Task
        let html = `
            <div>${carta.titulo}</div>
            <div class="card-origin">📦 ${carta.feature_pai_nome}</div>
            <div class="info-row">
                <span>Dev: <b>${carta.prog_dev}/${carta.esforco_dev}</b></span>
                <span>QA: <b>${carta.prog_qa}/${carta.esforco_qa}</b></span>
            </div>
        `;
        
        // Barras de Progresso (Só na Sprint e fora do ToDo)
        if(fase === 'sprint' && carta.status !== 'todo') {
             const pDev = Math.min(100, (carta.prog_dev/carta.esforco_dev)*100);
             const pQA = Math.min(100, (carta.prog_qa/carta.esforco_qa)*100);
             
             html += `
                <div class="progress-row">
                    <div class="p-track"><div class="p-fill bg-dev" style="width:${pDev}%"></div></div>
                </div>
             `;
             
             if(carta.status !== 'doing') {
                 html += `
                    <div class="progress-row">
                        <div class="p-track"><div class="p-fill bg-qa" style="width:${pQA}%"></div></div>
                    </div>
                 `;
             }
        }
        
        // Botão de Deploy
        if(carta.status === 'deploy') {
            let custoDeploy = (upgrades && upgrades.deploy_gratis) ? 0 : 4;
            if (upgrades && upgrades.complexidade_alta && custoDeploy > 0) custoDeploy += 2;
            
            html += `<div class="deploy-btn-hint ${custoDeploy===0?'free':''}">CLIQUE P/ DEPLOY (-${custoDeploy} Dev)</div>`;
        }

        // Check de Done
        if(carta.status === 'done') {
            html += `<div style="text-align:center;color:#10b981;font-weight:bold;font-size:0.8em;margin-top:5px;">✅ DONE</div>`;
        }

        div.innerHTML = html;
    }

    div.onclick = () => lidarComClique(id, carta, fase);
    return div;
}

// --- Lógica de Clique (Regras do Jogo) ---
function lidarComClique(id, carta, fase) {
    runTransaction(gameRef, (jogo) => {
        if (!jogo) return;
        
        // PLANNING: Explodir Feature
        if (fase === 'planning' && carta.tipo === 'feature') {
             if(!confirm(`Iniciar "${carta.titulo}"?`)) return;

             // Regra: Apenas 1 Tech por Sprint
             if (carta.efeito) {
                const jaTemTech = Object.values(jogo.cartas).some(c => c.is_tech === true);
                if (jaTemTech) return; 
             }

             delete jogo.cartas[id];
             
             if(carta.tarefas_ocultas) {
                const valorPorTask = carta.tarefas_ocultas.length > 0 ? Math.floor(carta.valor_entregavel / carta.tarefas_ocultas.length) : 0;
                
                carta.tarefas_ocultas.forEach((task, index) => {
                    jogo.cartas[`task_${id}_${index}_${Date.now()}`] = {
                        titulo: task.titulo, 
                        feature_pai_nome: carta.titulo, 
                        valor_individual: valorPorTask,
                        is_tech: !!carta.efeito, 
                        efeito_tech: carta.efeito || null, 
                        esforco_dev: task.dev, prog_dev: 0, 
                        esforco_qa: task.qa, prog_qa: 0, 
                        status: 'todo', tipo: 'task'
                    };
                });
             }
        } 
        // SPRINT: Mover Task
        else if (fase === 'sprint' && carta.tipo === 'task') {
             const c = jogo.cartas[id]; 
             
             if(c.status === 'todo') {
                 let emDoing = 0;
                 Object.values(jogo.cartas).forEach(k => { if(k.status === 'doing') emDoing++; });
                 if(emDoing < 4) c.status = 'doing';
             }
             else if(c.status === 'doing') {
                 if (jogo.energyDev > 0) {
                     jogo.energyDev--; c.prog_dev++;
                     if(c.prog_dev >= c.esforco_dev) { c.prog_dev = c.esforco_dev; c.status = 'testing'; }
                 }
             }
             else if(c.status === 'testing') {
                 if (jogo.energyQA > 0) {
                     jogo.energyQA--; c.prog_qa++;
                     if(c.prog_qa >= c.esforco_qa) { c.prog_qa = c.esforco_qa; c.status = 'deploy'; }
                 }
             }
             else if(c.status === 'deploy') {
                 let custo = (jogo.upgrades && jogo.upgrades.deploy_gratis) ? 0 : 4;
                 if (jogo.upgrades && jogo.upgrades.complexidade_alta && custo > 0) custo += 2;

                 if (jogo.energyDev >= custo) {
                     jogo.energyDev -= custo;
                     c.status = 'done';
                 }
             }
        }
        return jogo;
    });
}