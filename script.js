window.game = {
    turn: 0,
    players: [
        { id: 0, pos: 0, name: "", color: "#58a6ff" },
        { id: 1, pos: 0, name: "", color: "#f1e05a" }
    ],
    
    temaLabels: ["PARADIGMA INICIAL", "Ciência Normal", "Anomalias", "Crise", "Revolução", "NOVO PARADIGMA"],

    questions: {
        1: [
            { q: "Qual a atividade principal na Ciência Normal?", options: ["Resolver puzzles/enigmas", "Derrubar o paradigma", "Ignorar as regras", "Criar crises"], a: "Resolver puzzles/enigmas" },
            { q: "O paradigma fornece ao cientista:", options: ["Modelos e diretrizes", "Apenas dúvidas", "Liberdade total", "Fama instantânea"], a: "Modelos e diretrizes" },
            { q: "Os manuais científicos na fase normal servem para:", options: ["Transmitir o paradigma", "Incentivar a rebeldia", "Contestar factos", "Esconder segredos"], a: "Transmitir o paradigma" }
        ],
        2: [
            { q: "O que caracteriza uma anomalia?", options: ["Violação das expectativas", "Sucesso constante", "Uma nova lei aceite", "Uso de telescópios"], a: "Violação das expectativas" },
            { q: "Como o cientista reage inicialmente à anomalia?", options: ["Tenta ajustá-la ao paradigma", "Abandona a ciência", "Faz uma festa", "Cria uma revolução"], a: "Tenta ajustá-la ao paradigma" },
            { q: "Anomalias graves atacam:", options: ["Os fundamentos do paradigma", "O salário do cientista", "Apenas detalhes", "Livros antigos"], a: "Os fundamentos do paradigma" }
        ],
        3: [
            { q: "O que marca o período de Crise?", options: ["Perda de confiança no paradigma", "Ciência Normal estável", "Excesso de verbas", "Fim das perguntas"], a: "Perda de confiança no paradigma" },
            { q: "Na fase de crise, os cientistas recorrem à:", options: ["Filosofia e debate de bases", "Magia", "Aposentadoria", "Televisão"], a: "Filosofia e debate de bases" },
            { q: "A crise gera um sentimento de:", options: ["Insegurança profissional", "Alegria extrema", "Tédio", "Poder total"], a: "Insegurança profissional" }
        ],
        4: [
            { q: "Uma Revolução Científica é uma mudança:", options: ["Não-cumulativa", "Lenta e gradual", "Baseada em factos antigos", "Irrelevante"], a: "Não-cumulativa" },
            { q: "O termo 'Incomensurabilidade' significa que:", options: ["Paradigmas não são comparáveis", "Tudo pode ser medido", "A ciência é exata", "Cientistas concordam"], a: "Paradigmas não são comparáveis" },
            { q: "A escolha entre paradigmas rivais é como:", options: ["Uma conversão ou Gestalt", "Uma conta de somar", "Um sorteio", "Um contrato formal"], a: "Uma conversão ou Gestalt" }
        ]
    },

    start() {
        this.players[0].name = document.getElementById('p1-name').value || "Equipa Azul";
        this.players[1].name = document.getElementById('p2-name').value || "Equipa Amarela";
        this.generateBoard();
        this.createTokens();
        document.getElementById('setup-modal').style.display = 'none';
        this.updateUI();
    },

    generateBoard() {
        const board = document.getElementById('board');
        const coords = [
            [0,0], [0,1], [0,2], [0,3], [0,4], [0,5], 
            [1,5], [2,5], [3,5], [4,5],               
            [5,5], [5,4], [5,3], [5,2], [5,1], [5,0], 
            [4,0], [3,0], [2,0], [1,0]                
        ];

        coords.forEach((c, i) => {
            const div = document.createElement('div');
            div.id = `cell-${i}`;
            div.style.gridRow = c[0] + 1;
            div.style.gridColumn = c[1] + 1;
            
            let label = "";
            if (i === 0) { 
                div.className = "cell special-start"; 
                label = "PARADIGMA INICIAL"; 
            }
            else if (i === 19) { 
                div.className = "cell special-end"; 
                label = "NOVO PARADIGMA"; 
            }
            else {
                const temaIdx = ((i - 1) % 4) + 1;
                div.className = `cell tema-${temaIdx}`;
                label = this.temaLabels[temaIdx];
            }
            div.innerHTML = `<span>${label}</span>`;
            board.appendChild(div);
        });
    },

    createTokens() {
        this.players.forEach(p => {
            const token = document.createElement('div');
            token.id = `token-${p.id}`;
            token.className = 'token';
            token.style.backgroundColor = p.color;
            document.getElementById('board').appendChild(token);
            this.moveToken(p.id, 0);
        });
    },

    moveToken(playerId, pos) {
        const token = document.getElementById(`token-${playerId}`);
        const cell = document.getElementById(`cell-${pos}`);
        if (token && cell) {
            const offset = playerId === 0 ? 10 : 50; 
            token.style.left = (cell.offsetLeft + offset) + "px";
            token.style.top = (cell.offsetTop + 32) + "px";
        }
    },

    requestMove() {
        const p = this.players[this.turn];
        const nextPos = p.pos + 1;
        // Se a próxima casa for a 19 (Novo Paradigma), usa o tema Revolução (4)
        let tema = nextPos >= 19 ? 4 : ((nextPos - 1) % 4) + 1;
        this.showQuestion(tema);
    },

    showQuestion(tema) {
        const qList = this.questions[tema];
        const qData = qList[Math.floor(Math.random() * qList.length)];
        
        // Embaralha opções para cada jogada de cada jogador
        const shuffled = [...qData.options].sort(() => Math.random() - 0.5);
        this.currentCorrectText = qData.a;

        document.getElementById('q-category').innerText = this.temaLabels[tema];
        document.getElementById('q-text').innerText = qData.q;
        const container = document.getElementById('options-container');
        container.innerHTML = '';
        
        shuffled.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'opt-btn';
            btn.innerText = opt;
            btn.onclick = () => this.checkAnswer(opt);
            container.appendChild(btn);
        });
        document.getElementById('q-modal').style.display = 'flex';
    },

    checkAnswer(selected) {
        document.getElementById('q-modal').style.display = 'none';
        const p = this.players[this.turn];

        if (selected === this.currentCorrectText) {
            p.pos++;
            this.moveToken(p.id, p.pos);
            if (p.pos === 19) {
                document.getElementById('winner-text').innerText = `${p.name.toUpperCase()} estabeleceu o Novo Paradigma!`;
                document.getElementById('win-modal').style.display = 'flex';
                return;
            }
            this.turn = (this.turn + 1) % 2;
            this.updateUI();
        } else {
            this.showFeedback("FALHA NA EXPERIÊNCIA", `A equipa ${p.name} não conseguiu provar sua tese.`);
        }
    },

    showFeedback(title, msg) {
        document.getElementById('feedback-title').innerText = title;
        document.getElementById('feedback-message').innerText = msg;
        document.getElementById('feedback-modal').style.display = 'flex';
    },

    closeFeedback() {
        document.getElementById('feedback-modal').style.display = 'none';
        this.turn = (this.turn + 1) % 2;
        this.updateUI();
    },

    updateUI() {
        const p = this.players[this.turn];
        document.getElementById('current-team').innerText = p.name;
        document.getElementById('current-team').style.color = p.color;
    }
};