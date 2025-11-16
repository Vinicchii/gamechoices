// Estado do jogo
let gameState = {
    balance: 1600,
    day: 1,
    maxDays: 7,
    minBalance: 300,
    currentScenarioIndex: 0,
    usedScenarios: new Set()
};

// Cenários do jogo
const scenarios = [
    {
        id: 'grocery',
        title: 'Compra do Mês',
        description: 'Você precisa fazer a compra do mês. É obrigatório!',
        cost: 350,
        type: 'mandatory'
    },
    {
        id: 'water_electric',
        title: 'Água e Luz',
        description: 'Conta de água e luz chegou. Precisa ser paga.',
        cost: 180,
        type: 'mandatory'
    },
    {
        id: 'internet',
        title: 'Internet e Telefone',
        description: 'Sua conta de internet e telefone venceu.',
        cost: 120,
        type: 'mandatory'
    },
    {
        id: 'rent',
        title: 'Aluguel',
        description: 'O aluguel do mês venceu. É obrigatório pagar.',
        cost: 500,
        type: 'mandatory'
    },
    {
        id: 'shoes',
        title: 'Tênis Nova Coleção',
        description: 'Tênis que você queria está em promoção! De R$ 1300 por apenas R$ 800.',
        cost: 800,
        type: 'choice',
        originalPrice: 1300
    },
    {
        id: 'game',
        title: 'Novo jogo lançou!',
        description: 'Seu game favorito saiu! Custa R$ 350. Você quer comprar?',
        cost: 350,
        type: 'choice'
    },
    {
        id: 'streaming',
        title: 'Assinatura Streaming',
        description: 'Assinatura anual de streaming por R$ 180. Vale a pena?',
        cost: 180,
        type: 'choice'
    },
    {
        id: 'lunch',
        title: 'Almoço com Amigos',
        description: 'Seus amigos convidaram para almoçar em um restaurante. Custo: R$ 90.',
        cost: 90,
        type: 'choice'
    },
    {
        id: 'umbrella',
        title: 'Guarda-chuva Novo',
        description: 'Seu guarda-chuva não aguentou os ventos fortes. Precisa comprar um novo por R$ 50.',
        cost: 50,
        type: 'mandatory'
    },
    {
        id: 'haircut',
        title: 'Corte de Cabelo',
        description: 'Hora do corte de cabelo! Custa R$ 80. Quer ir?',
        cost: 80,
        type: 'choice'
    },
    {
        id: 'movie',
        title: 'Cinema com Namorado(a)',
        description: 'Convite para cinema. Gastará R$ 60 por pessoa (2 ingressos).',
        cost: 100,
        type: 'choice'
    },
    {
        id: 'medicine',
        title: 'Medicamento',
        description: 'Precisa comprar medicamento que custa R$ 150.',
        cost: 150,
        type: 'mandatory'
    },
    {
        id: 'clothes',
        title: 'Roupa Nova',
        description: 'Blusa legal na promoção por R$ 120. Interessado?',
        cost: 120,
        type: 'choice'
    },
    {
        id: 'coffee',
        title: 'Café e Lanches',
        description: 'Cafe com os amigos. Custo: R$ 45.',
        cost: 45,
        type: 'choice'
    },
    {
        id: 'pizza',
        title: 'Pizza no Fim de Semana',
        description: 'Uma pizza deliciosa para o fim de semana. R$ 70.',
        cost: 70,
        type: 'choice'
    },
    {
        id: 'credit_card_payment',
        title: 'Pagamento do Cartão de Crédito',
        description: 'Sua fatura do cartão de crédito venceu. Precisa pagar R$ 500.',
        cost: 500,
        type: 'mandatory',
    }
];

// Inicializar o jogo
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar o modal inicial
    document.getElementById('modalIntro').style.display = 'block';
});

// Iniciar o jogo
function startGame() {
    document.getElementById('modalIntro').style.display = 'none';
    document.getElementById('gameInfo').style.display = 'grid';
    document.getElementById('footer').style.display = 'block';
    displayScenario();
}

// Exibir um cenário aleatório
function displayScenario() {
    // Verificar se o jogo acabou
    if (gameState.day > gameState.maxDays) {
        endGame();
        return;
    }

    // Atualizar a interface
    document.getElementById('day').textContent = gameState.day;
    document.getElementById('balance').textContent = gameState.balance.toFixed(2);

    // Obter um cenário aleatório que ainda não foi usado
    let scenario = getRandomScenario();
    
    // Renderizar o cenário
    renderScenario(scenario);
}

// Obter um cenário aleatório não utilizado
function getRandomScenario() {
    let availableScenarios = scenarios.filter(
        s => !gameState.usedScenarios.has(s.id)
    );

    // Se todos os cenários foram usados, resetar a lista
    if (availableScenarios.length === 0) {
        gameState.usedScenarios.clear();
        availableScenarios = scenarios;
    }

    const randomIndex = Math.floor(Math.random() * availableScenarios.length);
    const scenario = availableScenarios[randomIndex];
    gameState.usedScenarios.add(scenario.id);
    
    return scenario;
}

// Renderizar o cenário na tela
function renderScenario(scenario) {
    const container = document.getElementById('scenarioContainer');
    container.innerHTML = '';

    const scenarioDiv = document.createElement('div');
    scenarioDiv.className = `scenario ${scenario.type}`;

    const typeLabel = scenario.type === 'mandatory' ? 'OBRIGATÓRIO' : 'ESCOLHA';
    const typeClass = scenario.type === 'mandatory' ? 'mandatory' : 'choice';

    let descriptionHTML = `<p class="scenario-description">${scenario.description}</p>`;
    
    if (scenario.originalPrice) {
        descriptionHTML += `<p class="scenario-description"><strong>Economia: R$ ${(scenario.originalPrice - scenario.cost).toFixed(2)}</strong></p>`;
    }

    scenarioDiv.innerHTML = `
        <span class="scenario-type">${typeLabel}</span>
        <h2 class="scenario-title">${scenario.title}</h2>
        ${descriptionHTML}
        <div class="scenario-buttons">
            ${scenario.type === 'mandatory' ? 
                `<button class="btn btn-mandatory" onclick="handleScenario('${scenario.id}', true)">Confirmar (-R$ ${scenario.cost.toFixed(2)})</button>` :
                `<button class="btn btn-accept" onclick="handleScenario('${scenario.id}', true)">Comprar (-R$ ${scenario.cost.toFixed(2)})</button>
                 <button class="btn btn-decline" onclick="handleScenario('${scenario.id}', false)">Recusar</button>`
            }
        </div>
    `;

    container.appendChild(scenarioDiv);
}

// Lidar com a resposta do usuário
function handleScenario(scenarioId, accepted) {
    const scenario = scenarios.find(s => s.id === scenarioId);

    if (accepted) {
        gameState.balance -= scenario.cost;
    }

    // Verificar se o saldo ficou negativo
    if (gameState.balance < 0) {
        gameState.balance = 0;
    }

    // Próximo dia
    gameState.day++;

    // Verificar se o jogo acabou
    if (gameState.day > gameState.maxDays) {
        endGame();
    } else {
        displayScenario();
    }
}

// Encerrar o jogo
function endGame() {
    const gameOverContainer = document.getElementById('gameOverContainer');
    const gameOverTitle = document.getElementById('gameOverTitle');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const gameOverBalance = document.getElementById('gameOverBalance');

    gameOverBalance.textContent = `Saldo final: R$ ${gameState.balance.toFixed(2)}`;

    if (gameState.balance >= gameState.minBalance) {
        gameOverTitle.textContent = '🎉 Parabéns!';
        gameOverTitle.style.color = '#27ae60';
        gameOverMessage.textContent = `Você conseguiu alcançar a meta de R$ ${gameState.minBalance.toFixed(2)}!`;
        gameOverMessage.style.color = '#27ae60';
    } else {
        gameOverTitle.textContent = '😢 Game Over!';
        gameOverTitle.style.color = '#e74c3c';
        gameOverMessage.textContent = `Você não conseguiu alcançar a meta. Ficou com apenas R$ ${gameState.balance.toFixed(2)}.`;
        gameOverMessage.style.color = '#e74c3c';
    }

    gameOverContainer.style.display = 'flex';
}
