// --- CALENDÁRIO DA CAMPANHA (36 Dias) ---
export const CALENDARIO_CAMPAIGN = [
    {d:5, q:3, m:"Sprint 1: Onboarding."}, // Dia 0 (Placeholder)
    {d:5, q:3, m:"Sprint 1: Começo tranquilo."}, 
    {d:6, q:3, m:"Sprint 1: Time focado."}, 
    {d:5, q:2, m:"Sprint 1: QA gargalo."}, 
    {d:4, q:2, m:"Sprint 1: Reuniões excessivas."}, 
    {d:5, q:3, m:"Sprint 1: Review day."}, // Fim Sprint 1 (Dia 5)

    {d:4, q:2, m:"Sprint 2: Feriado na terça."}, 
    {d:5, q:3, m:"Sprint 2: Ritmo normal."}, 
    {d:6, q:4, m:"Sprint 2: Alta produtividade."}, 
    {d:5, q:2, m:"Sprint 2: QA sumiu (Doente)."}, 
    {d:5, q:3, m:"Sprint 2: Recuperação."},
    {d:5, q:3, m:"Sprint 2: Fechamento."}, // Fim Sprint 2 (Dia 11)

    {d:2, q:1, m:"🔥 SERVIDOR CAIU! (Crise)"}, 
    {d:3, q:2, m:"Sprint 3: Resolvendo legado."}, 
    {d:6, q:4, m:"Sprint 3: Recuperação pós-crise."}, 
    {d:7, q:3, m:"Sprint 3: Devs voando (Flow)."}, 
    {d:5, q:3, m:"Sprint 3: Estabilidade."},
    {d:5, q:3, m:"Sprint 3: Review."}, // Fim Sprint 3 (Dia 17)

    {d:5, q:3, m:"Sprint 4: Estabilidade total."}, 
    {d:5, q:3, m:"Sprint 4: Foco em Features."}, 
    {d:5, q:3, m:"Sprint 4: Normal."}, 
    {d:5, q:3, m:"Sprint 4: Normal."}, 
    {d:5, q:3, m:"Sprint 4: Normal."},
    {d:5, q:3, m:"Sprint 4: Entrega Contínua."}, // Fim Sprint 4 (Dia 23)

    {d:5, q:3, m:"Sprint 5: Reta Final."}, 
    {d:5, q:3, m:"Sprint 5: Pressão do Cliente."}, 
    {d:5, q:3, m:"Sprint 5: Normal."}, 
    {d:5, q:3, m:"Sprint 5: Normal."}, 
    {d:5, q:3, m:"Sprint 5: Tech Debt aparecendo."},
    {d:5, q:3, m:"Sprint 5: Fechamento tenso."}, // Fim Sprint 5 (Dia 29)

    {d:5, q:3, m:"Sprint 6: Última chance."}, 
    {d:4, q:2, m:"Sprint 6: Cansaço acumulado."}, 
    {d:6, q:4, m:"Sprint 6: Gás final (Hackathon)."}, 
    {d:5, q:3, m:"Sprint 6: Últimos ajustes."}, 
    {d:5, q:3, m:"Sprint 6: Code Freeze."},
    {d:5, q:3, m:"🚀 DEPLOY EM PRODUÇÃO (FIM)."} // Fim Sprint 6 (Dia 35/36)
];

// --- LISTA COMPLETA DE CARTAS ---
export const FEATURES_FULL = {
    // --- NEGÓCIO (F1 a F15) ---
    f1: { titulo: "Login Social (Google)", valor_entregavel: 300, cor: "#8b5cf6", status: 'backlog', tipo: 'feature',
        tarefas_ocultas: [{ titulo: "Config OAuth", dev: 3, qa: 2 }, { titulo: "Frontend Botões", dev: 2, qa: 1 }, { titulo: "Token Seguro", dev: 4, qa: 3 }] },
    
    f2: { titulo: "Carrinho de Compras", valor_entregavel: 500, cor: "#ec4899", status: 'backlog', tipo: 'feature',
        tarefas_ocultas: [{ titulo: "API Sessão", dev: 5, qa: 3 }, { titulo: "Lógica State", dev: 5, qa: 2 }, { titulo: "Cálculo Totais", dev: 3, qa: 2 }] },
    
    f3: { titulo: "Filtros de Busca", valor_entregavel: 250, cor: "#3b82f6", status: 'backlog', tipo: 'feature',
        tarefas_ocultas: [{ titulo: "Indexação Elastic", dev: 6, qa: 2 }, { titulo: "UI Filtros", dev: 4, qa: 4 }] },
    
    f4: { titulo: "Gateway Pagamento", valor_entregavel: 800, cor: "#f59e0b", status: 'backlog', tipo: 'feature',
        tarefas_ocultas: [{ titulo: "API Gateway", dev: 8, qa: 4 }, { titulo: "Webhooks", dev: 6, qa: 5 }, { titulo: "UI Checkout", dev: 5, qa: 3 }, { titulo: "Logs Erro", dev: 3, qa: 2 }] },
    
    f5: { titulo: "Refatorar Legado", valor_entregavel: 0, cor: "#64748b", status: 'backlog', tipo: 'feature',
        tarefas_ocultas: [{ titulo: "Remover jQuery", dev: 8, qa: 6 }, { titulo: "Atualizar React", dev: 4, qa: 2 }] },
    
    f6: { titulo: "Sistema Avaliações", valor_entregavel: 200, cor: "#10b981", status: 'backlog', tipo: 'feature',
        tarefas_ocultas: [{ titulo: "Componente Estrelas", dev: 2, qa: 1 }, { titulo: "API Reviews", dev: 3, qa: 2 }, { titulo: "Moderação", dev: 4, qa: 1 }] },
    
    f7: { titulo: "Notificações Push", valor_entregavel: 400, cor: "#f43f5e", status: 'backlog', tipo: 'feature',
        tarefas_ocultas: [{ titulo: "Config Firebase", dev: 4, qa: 2 }, { titulo: "Service Worker", dev: 6, qa: 4 }] },
    
    f8: { titulo: "Dashboard Admin", valor_entregavel: 350, cor: "#8b5cf6", status: 'backlog', tipo: 'feature',
        tarefas_ocultas: [{ titulo: "Gráficos ChartJS", dev: 5, qa: 2 }, { titulo: "Exportar CSV", dev: 3, qa: 1 }, { titulo: "Logs Audit", dev: 2, qa: 1 }] },
    
    f9: { titulo: "Perfil Usuário", valor_entregavel: 150, cor: "#ec4899", status: 'backlog', tipo: 'feature',
        tarefas_ocultas: [{ titulo: "Upload Avatar", dev: 4, qa: 3 }, { titulo: "Form Edição", dev: 3, qa: 1 }] },
    
    f10: { titulo: "Otimização SEO", valor_entregavel: 100, cor: "#3b82f6", status: 'backlog', tipo: 'feature',
        tarefas_ocultas: [{ titulo: "SSR Setup", dev: 7, qa: 2 }, { titulo: "Meta Tags", dev: 2, qa: 1 }] },
    
    f11: { titulo: "Dark Mode", valor_entregavel: 50, cor: "#1e293b", status: 'backlog', tipo: 'feature',
        tarefas_ocultas: [{ titulo: "Vars CSS", dev: 3, qa: 4 }, { titulo: "Toggle", dev: 1, qa: 1 }] },
    
    f12: { titulo: "Chat Suporte", valor_entregavel: 600, cor: "#f59e0b", status: 'backlog', tipo: 'feature',
        tarefas_ocultas: [{ titulo: "WebSocket", dev: 9, qa: 5 }, { titulo: "Janela Chat", dev: 5, qa: 3 }, { titulo: "Histórico", dev: 4, qa: 2 }] },
    
    f13: { titulo: "Dockerização", valor_entregavel: 0, cor: "#64748b", status: 'backlog', tipo: 'feature',
        tarefas_ocultas: [{ titulo: "Docker App", dev: 6, qa: 2 }, { titulo: "Script CI/CD", dev: 8, qa: 3 }] },
    
    f14: { titulo: "Recuperar Senha", valor_entregavel: 120, cor: "#10b981", status: 'backlog', tipo: 'feature',
        tarefas_ocultas: [{ titulo: "Envio Email", dev: 3, qa: 2 }, { titulo: "Token Hash", dev: 4, qa: 1 }] },
    
    f15: { titulo: "Cupons Desconto", valor_entregavel: 180, cor: "#f43f5e", status: 'backlog', tipo: 'feature',
        tarefas_ocultas: [{ titulo: "Lógica Validação", dev: 4, qa: 5 }, { titulo: "Input Checkout", dev: 2, qa: 1 }] },

    // --- TÉCNICAS (UPGRADES, TRAPS E COMPLEXIDADE) ---
    t1: { titulo: "🚀 CI/CD Automatizado", valor_entregavel: 0, cor: "#334155", status: 'backlog', tipo: 'feature', 
            efeito: 'deploy_gratis', descricao: "IMPACTO ALTO: Custo de Deploy vira 0.",
            tarefas_ocultas: [{ titulo: "Script Build", dev: 6, qa: 1 }, { titulo: "Config Runner", dev: 4, qa: 1 }] },
    
    t2: { titulo: "☕ Máquina de Café Pro", valor_entregavel: 0, cor: "#334155", status: 'backlog', tipo: 'feature', 
            efeito: 'dev_boost_1', descricao: "IMPACTO MÉDIO: +2 Energia Dev/dia.",
            tarefas_ocultas: [{ titulo: "Comprar Máquina", dev: 2, qa: 0 }, { titulo: "Instalar na Copa", dev: 1, qa: 0 }] },

    t3: { titulo: "🤖 Automação de QA", valor_entregavel: 0, cor: "#334155", status: 'backlog', tipo: 'feature', 
            efeito: 'qa_boost_1', descricao: "IMPACTO MÉDIO: +2 Energia QA/dia.",
            tarefas_ocultas: [{ titulo: "Setup Cypress", dev: 3, qa: 5 }, { titulo: "Cobrir Fluxos", dev: 2, qa: 6 }] },

    t4: { titulo: "💻 Monitores 4K Ultrawide", valor_entregavel: 0, cor: "#334155", status: 'backlog', tipo: 'feature', 
            efeito: 'dev_boost_2', descricao: "IMPACTO ALTO: +3 Energia Dev/dia.",
            tarefas_ocultas: [{ titulo: "Orçamento", dev: 1, qa: 0 }, { titulo: "Setup Mesas", dev: 4, qa: 0 }] },

    t5: { titulo: "🏓 Mesa de Ping Pong", valor_entregavel: 0, cor: "#475569", status: 'backlog', tipo: 'feature', 
            efeito: 'useless_toy', descricao: "Melhora a cultura? (Investimento Duvidoso)",
            tarefas_ocultas: [{ titulo: "Montar Mesa", dev: 2, qa: 0 }, { titulo: "Campeonato Interno", dev: 2, qa: 2 }] },

    t6: { titulo: "♻️ Refatorar para Framework Novo", valor_entregavel: 0, cor: "#475569", status: 'backlog', tipo: 'feature', 
            efeito: 'dev_boost_small', descricao: "O código vai ficar lindo! (Mas demora...)",
            tarefas_ocultas: [{ titulo: "Reescrever Core", dev: 12, qa: 8 }, { titulo: "Migrar Componentes", dev: 10, qa: 5 }] },

    t7: { titulo: "📚 Documentação Técnica", valor_entregavel: 0, cor: "#334155", status: 'backlog', tipo: 'feature', 
            efeito: 'qa_boost_2', descricao: "QA entende melhor o sistema (+2 Energia QA).",
            tarefas_ocultas: [{ titulo: "Escrever Wiki", dev: 5, qa: 1 }, { titulo: "Diagramas", dev: 3, qa: 0 }] },

    t8: { titulo: "🕸️ Migrar para Microservices", valor_entregavel: 0, cor: "#475569", status: 'backlog', tipo: 'feature', 
            efeito: 'complexidade_alta', descricao: "Escalabilidade infinita! (Alta complexidade)",
            tarefas_ocultas: [{ titulo: "Quebrar Monolito", dev: 15, qa: 10 }, { titulo: "Orquestração", dev: 8, qa: 5 }] },

    t9: { titulo: "🎓 Workshop de Agile", valor_entregavel: 0, cor: "#334155", status: 'backlog', tipo: 'feature', 
            efeito: 'team_synergy', descricao: "Melhora comunicação (+1 Dev, +1 QA).",
            tarefas_ocultas: [{ titulo: "Dinâmicas", dev: 2, qa: 2 }] },

    t10: { titulo: "🗣️ Nova Metodologia de Reunião", valor_entregavel: 0, cor: "#475569", status: 'backlog', tipo: 'feature', 
            efeito: 'burocracia', descricao: "Mais alinhamento, menos código.",
            tarefas_ocultas: [{ titulo: "Definir Processo", dev: 2, qa: 2 }] }
};