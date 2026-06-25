// ===================== CONFIGURAÇÕES GERAIS =====================
let valorDado = 0;
let jogadorAtual = 0; // 0 = Vermelho, 1 = Azul, 2 = Amarelo, 3 = Verde
const listaJogadores = [
    { nome: "Vermelho", classe: "vermelho", cor: "vermelha", pecasConcluidas: 0 },
    { nome: "Azul", classe: "azul", cor: "azul", pecasConcluidas: 0 },
    { nome: "Amarelo", classe: "amarelo", cor: "amarela", pecasConcluidas: 0 },
    { nome: "Verde", classe: "verde", cor: "verde", pecasConcluidas: 0 }
];

// Caminho principal com 52 casas
const caminhoPrincipal = [
    {linha: 6, coluna: 1}, {linha: 6, coluna: 2}, {linha: 6, coluna: 3}, {linha: 6, coluna: 4}, {linha: 6, coluna: 5},
    {linha: 5, coluna: 6}, {linha: 4, coluna: 6}, {linha: 3, coluna: 6}, {linha: 2, coluna: 6}, {linha: 1, coluna: 6},
    {linha: 0, coluna: 6}, {linha: 0, coluna: 7}, {linha: 0, coluna: 8}, {linha: 1, coluna: 8}, {linha: 2, coluna: 8},
    {linha: 3, coluna: 8}, {linha: 4, coluna: 8}, {linha: 5, coluna: 8}, {linha: 6, coluna: 9}, {linha: 6, coluna: 10},
    {linha: 6, coluna: 11}, {linha: 6, coluna: 12}, {linha: 6, coluna: 13}, {linha: 6, coluna: 14}, {linha: 7, coluna: 14},
    {linha: 8, coluna: 14}, {linha: 8, coluna: 13}, {linha: 8, coluna: 12}, {linha: 8, coluna: 11}, {linha: 8, coluna: 10},
    {linha: 9, coluna: 8}, {linha: 10, coluna: 8}, {linha: 11, coluna: 8}, {linha: 12, coluna: 8}, {linha: 13, coluna: 8},
    {linha: 14, coluna: 8}, {linha: 14, coluna: 7}, {linha: 14, coluna: 6}, {linha: 13, coluna: 6}, {linha: 12, coluna: 6},
    {linha: 11, coluna: 6}, {linha: 10, coluna: 6}, {linha: 9, coluna: 6}, {linha: 8, coluna: 5}, {linha: 8, coluna: 4},
    {linha: 8, coluna: 3}, {linha: 8, coluna: 2}, {linha: 8, coluna: 1}, {linha: 8, coluna: 0}, {linha: 7, coluna: 0},
    {linha: 7, coluna: 1}
];

// Índices das casas seguras
const casasSeguras = [0, 8, 13, 21, 26, 34, 39, 47];

// Posições de saída de cada jogador
const posicoesSaida = { 0: 0, 1: 13, 2: 26, 3: 39 };

// Caminhos finais até o centro
const caminhosFinais = [
    [{linha:7,coluna:2}, {linha:7,coluna:3}, {linha:7,coluna:4}, {linha:7,coluna:5}, {linha:7,coluna:7}], // Vermelho
    [{linha:2,coluna:7}, {linha:3,coluna:7}, {linha:4,coluna:7}, {linha:5,coluna:7}, {linha:7,coluna:7}], // Azul
    [{linha:7,coluna:12}, {linha:7,coluna:11}, {linha:7,coluna:10}, {linha:7,coluna:9}, {linha:7,coluna:7}], // Amarelo
    [{linha:12,coluna:7}, {linha:11,coluna:7}, {linha:10,coluna:7}, {linha:9,coluna:7}, {linha:7,coluna:7}]  // Verde
];

let pecas = [];
let jogoFinalizado = false;
let movimentoRealizado = false; // Controle para saber se já moveu

// Elementos da tela
const tabuleiro = document.getElementById('tabuleiro');
const btnDado = document.getElementById('btnDado');
const btnReiniciar = document.getElementById('btnReiniciar');
const spanValorDado = document.getElementById('valorDado');
const spanJogadorAtual = document.getElementById('jogadorAtual');
const mensagemVitoria = document.getElementById('mensagemVitoria');

// ===================== FUNÇÕES DE CRIAÇÃO =====================
function criarTabuleiro() {
    tabuleiro.innerHTML = '';
    pecas = [];
    jogoFinalizado = false;
    valorDado = 0;
    movimentoRealizado = false;
    mensagemVitoria.classList.remove('ativa');
    listaJogadores.forEach(j => j.pecasConcluidas = 0);

    for (let linha = 0; linha < 15; linha++) {
        for (let coluna = 0; coluna < 15; coluna++) {
            const casa = document.createElement('div');
            casa.classList.add('casa');
            casa.dataset.linha = linha;
            casa.dataset.coluna = coluna;

            if (linha < 6 && coluna < 6) {
                casa.classList.add('area-inicio-vermelha');
            } else if (linha < 6 && coluna > 8) {
                casa.classList.add('area-inicio-azul');
            } else if (linha > 8 && coluna < 6) {
                casa.classList.add('area-inicio-amarela');
            } else if (linha > 8 && coluna > 8) {
                casa.classList.add('area-inicio-verde');
            } else if (linha === 7 && coluna === 7) {
                casa.classList.add('casa-centro');
            } else {
                const idx = caminhoPrincipal.findIndex(p => p.linha === linha && p.coluna === coluna);
                if (idx !== -1) {
                    if (casasSeguras.includes(idx)) casa.classList.add('segura');
                    if (idx >= 0 && idx <= 5) casa.classList.add('vermelha');
                    else if (idx >= 13 && idx <= 18) casa.classList.add('azul');
                    else if (idx >= 26 && idx <= 31) casa.classList.add('amarela');
                    else if (idx >= 39 && idx <= 44) casa.classList.add('verde');
                }
            }

            tabuleiro.appendChild(casa);
        }
    }

    criarPecas();
    atualizarInfoVez();
    spanValorDado.textContent = valorDado;
}

function criarPecas() {
    const posicoesInicio = [
        [{linha:1,coluna:1}, {linha:1,coluna:3}, {linha:3,coluna:1}, {linha:3,coluna:3}],
        [{linha:1,coluna:11}, {linha:1,coluna:13}, {linha:3,coluna:11}, {linha:3,coluna:13}],
        [{linha:11,coluna:1}, {linha:11,coluna:3}, {linha:13,coluna:1}, {linha:13,coluna:3}],
        [{linha:11,coluna:11}, {linha:11,coluna:13}, {linha:13,coluna:11}, {linha:13,coluna:13}]
    ];

    for (let jog = 0; jog < 4; jog++) {
        for (let id = 0; id < 4; id++) {
            const peca = document.createElement('div');
            peca.classList.add('peca', listaJogadores[jog].cor);
            peca.dataset.jogador = jog;
            peca.dataset.id = id;
            peca.dataset.tipo = 'inicio';
            peca.dataset.posicao = -1;

            const pos = posicoesInicio[jog][id];
            posicionarPeca(peca, pos.linha, pos.coluna);
            peca.addEventListener('click', () => selecionarPeca(peca));
            tabuleiro.appendChild(peca);
            pecas.push(peca);
        }
    }
}

function posicionarPeca(peca, linha, coluna) {
    const tamanhoCasa = 520 / 15;
    peca.style.left = `${coluna * tamanhoCasa + (tamanhoCasa - 26) / 2}px`;
    peca.style.top = `${linha * tamanhoCasa + (tamanhoCasa - 32) / 2}px`;
}

// ===================== REGRAS DE JOGO =====================
function retornarParaInicio(peca) {
    const jog = Number(peca.dataset.jogador);
    const id = Number(peca.dataset.id);
    const posicoesInicio = [
        [{linha:1,coluna:1}, {linha:1,coluna:3}, {linha:3,coluna:1}, {linha:3,coluna:3}],
        [{linha:1,coluna:11}, {linha:1,coluna:13}, {linha:3,coluna:11}, {linha:3,coluna:13}],
        [{linha:11,coluna:1}, {linha:11,coluna:3}, {linha:13,coluna:1}, {linha:13,coluna:3}],
        [{linha:11,coluna:11}, {linha:11,coluna:13}, {linha:13,coluna:11}, {linha:13,coluna:13}]
    ];

    peca.dataset.tipo = 'inicio';
    peca.dataset.posicao = -1;
    delete peca.dataset.posFinal;
    posicionarPeca(peca, posicoesInicio[jog][id].linha, posicoesInicio[jog][id].coluna);
}

function verificarCaptura(posicao, jogadorMovendo) {
    if (casasSeguras.includes(posicao)) return;

    const adversarios = pecas.filter(p =>
        p.dataset.tipo === 'caminho' &&
        Number(p.dataset.jogador) !== jogadorMovendo &&
        Number(p.dataset.posicao) === posicao
    );

    adversarios.forEach(peca => retornarParaInicio(peca));
}

function verificarVitoria() {
    if (listaJogadores[jogadorAtual].pecasConcluidas === 4) {
        jogoFinalizado = true;
        mensagemVitoria.textContent = `🎉 ${listaJogadores[jogadorAtual].nome} VENCEU! 🎉`;
        mensagemVitoria.classList.add('ativa');
    }
}

// ===================== LÓGICA DE MOVIMENTO =====================
function atualizarInfoVez() {
    spanJogadorAtual.textContent = listaJogadores[jogadorAtual].nome;
    spanJogadorAtual.classList.remove('vermelho', 'azul', 'amarelo', 'verde');
    spanJogadorAtual.classList.add(listaJogadores[jogadorAtual].classe);
}

function jogarDado() {
    if (jogoFinalizado) return;
    // Não deixa jogar outro dado até mover a peça
    if (valorDado !== 0 && !movimentoRealizado) return;

    valorDado = Math.floor(Math.random() * 6) + 1;
    spanValorDado.textContent = valorDado;
    movimentoRealizado = false;

    desmarcarTodasPecas();
    verificarPecasMoviveis();
}

function verificarPecasMoviveis() {
    let temMovimento = false;

    pecas.filter(p => Number(p.dataset.jogador) === jogadorAtual).forEach(peca => {
        const tipo = peca.dataset.tipo;
        const pos = Number(peca.dataset.posicao);
        const posFinal = Number(peca.dataset.posFinal || -1);

        if (tipo === 'inicio') {
            if (valorDado === 6) {
                peca.classList.add('ativa');
                temMovimento = true;
            }
        } else if (tipo === 'caminho') {
            if (pos + valorDado <= 51) {
                peca.classList.add('ativa');
                temMovimento = true;
            } else {
                const restante = 52 - pos;
                const entradaFinal = valorDado - restante;
                if (entradaFinal >= 0 && entradaFinal < 5) {
                    peca.classList.add('ativa');
                    temMovimento = true;
                }
            }
        } else if (tipo === 'final') {
            if (posFinal + valorDado < 5) {
                peca.classList.add('ativa');
                temMovimento = true;
            }
        }
    });

    // Se não tiver peça para mover, passa a vez automaticamente
    if (!temMovimento) {
        setTimeout(passarVezComReset, 1000);
    }
}

function desmarcarTodasPecas() {
    pecas.forEach(p => p.classList.remove('ativa'));
}

function selecionarPeca(peca) {
    if (!peca.classList.contains('ativa') || jogoFinalizado || movimentoRealizado) return;

    if (peca.dataset.tipo === 'inicio') {
        moverParaSaida(peca);
    } else if (peca.dataset.tipo === 'caminho') {
        moverNoCaminho(peca);
    } else if (peca.dataset.tipo === 'final') {
        moverNoFinal(peca);
    }

    movimentoRealizado = true;
    desmarcarTodasPecas();
    verificarVitoria();

    // Só reseta e passa a vez se NÃO tirou 6
    if (!jogoFinalizado && valorDado !== 6) {
        passarVezComReset();
    } else if (!jogoFinalizado && valorDado === 6) {
        // Tirou 6: continua a vez, valor do dado some até jogar novamente
        valorDado = 0;
        spanValorDado.textContent = valorDado;
    }
}

function moverParaSaida(peca) {
    const pos = posicoesSaida[jogadorAtual];
    peca.dataset.tipo = 'caminho';
    peca.dataset.posicao = pos;
    posicionarPeca(peca, caminhoPrincipal[pos].linha, caminhoPrincipal[pos].coluna);
    verificarCaptura(pos, jogadorAtual);
}

function moverNoCaminho(peca) {
    const posAtual = Number(peca.dataset.posicao);
    const novaPos = posAtual + valorDado;

    if (novaPos <= 51) {
        peca.dataset.posicao = novaPos;
        posicionarPeca(peca, caminhoPrincipal[novaPos].linha, caminhoPrincipal[novaPos].coluna);
        verificarCaptura(novaPos, jogadorAtual);
    } else {
        const restante = 52 - posAtual;
        const idxFinal = valorDado - restante;
        if (idxFinal >= 0 && idxFinal < 5) {
            peca.dataset.tipo = 'final';
            peca.dataset.posFinal = idxFinal;
            delete peca.dataset.posicao;
            posicionarPeca(peca, caminhosFinais[jogadorAtual][idxFinal].linha, caminhosFinais[jogadorAtual][idxFinal].coluna);
            if (idxFinal === 4) {
                listaJogadores[jogadorAtual].pecasConcluidas++;
            }
        }
    }
}

function moverNoFinal(peca) {
    const idxAtual = Number(peca.dataset.posFinal);
    const novoIdx = idxAtual + valorDado;
    if (novoIdx < 5) {
        peca.dataset.posFinal = novoIdx;
        posicionarPeca(peca, caminhosFinais[jogadorAtual][novoIdx].linha, caminhosFinais[jogadorAtual][novoIdx].coluna);
        if (novoIdx === 4) {
            listaJogadores[jogadorAtual].pecasConcluidas++;
        }
    }
}

function passarVezComReset() {
    valorDado = 0;
    movimentoRealizado = false;
    spanValorDado.textContent = valorDado;
    jogadorAtual = (jogadorAtual + 1) % 4;
    atualizarInfoVez();
}

// Iniciar jogo
btnDado.addEventListener('click', jogarDado);
btnReiniciar.addEventListener('click', criarTabuleiro);
criarTabuleiro();