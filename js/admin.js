import { db, ref, set, update, runTransaction, get } from './firebase-config.js';
import { FEATURES_FULL, CALENDARIO_CAMPAIGN } from './game-data.js';

// Carrega times do LocalStorage ou inicia vazio
let timesCadastrados = JSON.parse(localStorage.getItem('scrum_teams')) || [];

// --- UI Functions ---
function log(msg) {
    const el = document.getElementById('log');
    if(el) el.innerHTML = `> [${new Date().toLocaleTimeString()}] ${msg}<br>` + el.innerHTML;
}

function renderizarTimes() {
    const container = document.getElementById('teams-container');
    container.innerHTML = "";
    
    if (timesCadastrados.length === 0) {
        container.innerHTML = "<div style='color:#666; font-style:italic; padding:10px;'>Nenhum time cadastrado.</div>";
    }

    timesCadastrados.forEach(t => {
        const div = document.createElement('div');
        div.className = 'team-tag';
        div.innerHTML = `
            <strong>${t.nome}</strong> 
            <div>
                <button class="btn-copy" data-id="${t.id}" title="Copiar Link" style="background:none; border:none; cursor:pointer; font-size:1.1em; margin-right:5px;">🔗</button>
                <button class="btn-delete" data-id="${t.id}" title="Remover Time" style="background:none; border:none; cursor:pointer; font-size:1.1em; color:#ef4444;">🗑️</button>
            </div>
        `;
        container.appendChild(div);
    });
    
    const box = document.getElementById('command-box');
    if(box) {
        box.style.opacity = timesCadastrados.length > 0 ? 1 : 0.5;
        box.style.pointerEvents = timesCadastrados.length > 0 ? 'all' : 'none';
    }
}

// --- Event Listeners ---
const btnAdd = document.getElementById('btn-add-team');
if(btnAdd) {
    btnAdd.addEventListener('click', () => {
        const input = document.getElementById('new-team-input');
        const nome = input.value.trim();
        if (!nome) return;
        
        const id = nome.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        if (timesCadastrados.some(t => t.id === id)) return alert("Time já existe!");
        
        timesCadastrados.push({ id, nome });
        localStorage.setItem('scrum_teams', JSON.stringify(timesCadastrados));
        renderizarTimes();
        input.value = "";
    });
}

const container = document.getElementById('teams-container');
if(container) {
    container.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.getAttribute('data-id');

        if(target.classList.contains('btn-copy')) {
            const url = window.location.href.replace('admin.html', `index.html?sala=${id}`);
            navigator.clipboard.writeText(url).then(() => alert("Link copiado: " + url));
        }

        if(target.classList.contains('btn-delete')) {
            if(confirm("Tem certeza que deseja remover este time da lista?")) {
                timesCadastrados = timesCadastrados.filter(t => t.id !== id);
                localStorage.setItem('scrum_teams', JSON.stringify(timesCadastrados));
                renderizarTimes();
            }
        }
    });
}

const btnReset = document.getElementById('btn-reset-teams');
if(btnReset) {
    btnReset.addEventListener('click', () => {
        if(confirm("⚠️ Tem certeza? Isso apagará a lista de times do seu navegador (não apaga dados do Firebase).")) {
            timesCadastrados = [];
            localStorage.removeItem('scrum_teams');
            renderizarTimes();
        }
    });
}

// --- Lógica do Jogo (Comandos Globais) ---

function calcularEnergiaDoDia(diaIndex, upgrades) {
    const safeIndex = diaIndex < CALENDARIO_CAMPAIGN.length ? diaIndex : CALENDARIO_CAMPAIGN.length - 1;
    const info = CALENDARIO_CAMPAIGN[safeIndex] || {d:5, q:3, m:"Dia Extra"};

    let bDev = 0, bQA = 0;
    if(upgrades?.dev_boost_1) bDev += 2;
    if(upgrades?.dev_boost_2) bDev += 3;
    if(upgrades?.dev_boost_small) bDev += 1;
    if(upgrades?.qa_boost_1) bQA += 2;
    if(upgrades?.burocracia) { bDev -= 1; bQA -= 1; }

    return {
        dia: diaIndex,
        energyDev: Math.max(0, info.d + bDev),
        energyQA: Math.max(0, info.q + bQA),
        msg: info.m
    };
}

async function executarComando(acao) {
    if (timesCadastrados.length === 0) return;
    if (acao === 'setup' && !confirm("⚠️ RESETAR O JOGO PARA TODOS OS TIMES?")) return;
    if (acao === 'deploy' && !confirm("⚠️ FINALIZAR SPRINT?\nIsso limpará as tarefas DONE.")) return;

    let msgLog = "";

    const promises = timesCadastrados.map(async (time) => {
        const gameRef = ref(db, `partidas/${time.id}`);

        // === 1. SETUP (Reset Total) ===
        if (acao === 'setup') {
            await set(gameRef, {
                fase: 'planning', dia: 0, sprint: 1, energyDev: 5, energyQA: 3, valor_acumulado: 0,
                upgrades: {}, cartas: JSON.parse(JSON.stringify(FEATURES_FULL))
            });
            msgLog = "Setup Realizado (Reset).";
        } 
        
        // === 2. INICIAR SPRINT ===
        else if (acao === 'start') {
            try {
                const snap = await get(gameRef);
                const jogo = snap.val();
                if(!jogo) return;

                // Lógica de Continuidade: Pega o dia atual do banco e soma 1.
                // Se no banco está dia 5, o próximo será dia 6.
                const diaAtualNoBanco = jogo.dia || 0;
                const proximoDia = diaAtualNoBanco + 1;
                
                const calculo = calcularEnergiaDoDia(proximoDia, jogo.upgrades);

                await update(gameRef, { 
                    fase: 'sprint', 
                    dia: proximoDia, 
                    energyDev: calculo.energyDev, 
                    energyQA: calculo.energyQA 
                });
                msgLog = `Sprint Iniciada (Dia ${proximoDia}).`;
            } catch (e) { console.error(e); }
        }

        // === 3. AVANÇAR DIA ===
        else if (acao === 'day') {
             try {
                const snap = await get(gameRef);
                const jogo = snap.val();
                if (!jogo) return;

                const diaAtual = (jogo.dia || 0);
                const novoDia = diaAtual + 1;
                
                const calculo = calcularEnergiaDoDia(novoDia, jogo.upgrades);

                const updates = {
                    dia: novoDia,
                    energyDev: calculo.energyDev,
                    energyQA: calculo.energyQA
                };

                if (jogo.fase !== 'sprint') {
                    updates.fase = 'sprint';
                }

                await update(gameRef, updates);
                msgLog = `Dia avançado para ${novoDia}.`;

            } catch (err) { console.error(err); }
        }

        // === 4. BUG ===
        else if (acao === 'bug') {
            const idBug = "bug_" + Date.now();
            await update(ref(db, `partidas/${time.id}/cartas/${idBug}`), {
                titulo: "🔥 BUG CRÍTICO", valor: 0, esforco_dev: 10, prog_dev: 0, esforco_qa: 5, prog_qa: 0, status: 'todo', tipo: 'task'
            });
            msgLog = "Bug Injetado.";
        }

        // === 5. FINALIZAR SPRINT (CORREÇÃO AQUI) ===
        else if (acao === 'deploy') {
            await get(gameRef).then((snap) => {
                const jogo = snap.val();
                if(!jogo) return;
                
                let valorSprint = 0;
                const updates = {};
                let novosUpgrades = {...jogo.upgrades};
                
                if(jogo.cartas) {
                    Object.entries(jogo.cartas).forEach(([k, card]) => {
                        if(card.status === 'done' && card.tipo === 'task') {
                            valorSprint += parseInt(card.valor_individual || 0);
                            if(card.efeito_tech) novosUpgrades[card.efeito_tech] = true;
                            updates[`cartas/${k}`] = null; 
                        }
                    });
                }
                
                updates['valor_acumulado'] = (jogo.valor_acumulado || 0) + valorSprint;
                updates['upgrades'] = novosUpgrades;
                updates['fase'] = 'planning';
                updates['sprint'] = (jogo.sprint || 1) + 1;
                
                // --- CRÍTICO: NÃO ALTERAMOS O 'dia' ---
                // O dia permanece o mesmo (ex: 5) para que o start inicie no 6.
                // Não adicione updates['dia'] = 0 aqui!

                // Calculamos energia visual apenas para o Planning (Dia 0 é dummy, só pra pegar a base 5/3)
                const calculoPlanning = calcularEnergiaDoDia(0, novosUpgrades); 
                updates['energyDev'] = 5 + (calculoPlanning.energyDev - 5); 
                updates['energyQA'] = 3 + (calculoPlanning.energyQA - 3);
                
                update(gameRef, updates);
            });
            msgLog = "Sprint Encerrada.";
        }
    });

    await Promise.all(promises);
    log(msgLog);
}

document.getElementById('cmd-setup').onclick = () => executarComando('setup');
document.getElementById('cmd-start').onclick = () => executarComando('start');
document.getElementById('cmd-day').onclick = () => executarComando('day');
document.getElementById('cmd-deploy').onclick = () => executarComando('deploy');
document.getElementById('cmd-bug').onclick = () => executarComando('bug');

renderizarTimes();