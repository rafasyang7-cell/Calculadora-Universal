/* script-calcula.js */

let expressao = "";
let shiftAtivo = false;

// --- INICIALIZAÇÃO ---
window.onload = () => {
    renderizarHistorico();
    const notasSalvas = localStorage.getItem("procalc_notas");
    if (notasSalvas) {
        document.getElementById("blocoNotas").value = notasSalvas;
    }
};

// --- FUNÇÕES BÁSICAS ---
function inserir(char) {
    const ultimoChar = expressao.slice(-1);
    const operadores = ['+', '-', '*', '/', '%'];

    // Evita começar com operador ou repetir operadores
    if (expressao === "" && operadores.includes(char) && char !== '-') return;
    if (operadores.includes(ultimoChar) && operadores.includes(char)) return;

    expressao += char;
    atualizarVisor();
}

function atualizarVisor() {
    const display = document.getElementById("resultado");
    display.innerText = expressao || "0";
}

function limparTudo() {
    expressao = "";
    document.getElementById("resultado").innerText = "0";
    document.getElementById("historico").innerText = "";
}

// CONSERTO: Função para o botão "C" (Apagar último dígito)
function apagarUltimo() {
    // Se a expressão termina com uma função científica, apaga a palavra toda
    if (expressao.endsWith("sin(") || expressao.endsWith("cos(")) {
        expressao = expressao.slice(0, -4);
    } else if (expressao.endsWith("sqrt(")) {
        expressao = expressao.slice(0, -5);
    } else {
        expressao = expressao.slice(0, -1);
    }
    atualizarVisor();
}

// --- CÁLCULO CIENTÍFICO ---
function prepararFuncao(tipo) {
    expressao += tipo + "(";
    atualizarVisor();
}

function finalizarCalculo() {
    if (!expressao) return;

    try {
        let conta = expressao;

        // 1. CONSERTO DOS PARÊNTESES AUTOMÁTICO
        const abertos = (conta.match(/\(/g) || []).length;
        const fechados = (conta.match(/\)/g) || []).length;
        if (abertos > fechados) conta += ")".repeat(abertos - fechados);

        // 2. TRADUÇÃO PARA O MOTOR DO JS (REGEX GLOBAL)
        let expressaoProcessada = conta
            .replace(/sin\(/g, 'Math.sin(Math.PI/180*')
            .replace(/cos\(/g, 'Math.cos(Math.PI/180*')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/x/g, '*')
            .replace(/÷/g, '/');

        const resultado = eval(expressaoProcessada);

        // Formatação do resultado
        const resultadoFinal = Number.isInteger(resultado) ?
            resultado : parseFloat(resultado.toFixed(4));

        salvarNoHistorico(conta, resultadoFinal);

        document.getElementById("historico").innerText = conta + " =";
        expressao = resultadoFinal.toString();
        atualizarVisor();

    } catch (e) {
        document.getElementById("resultado").innerText = "Erro";
        setTimeout(limparTudo, 1500);
    }
}

// --- HISTÓRICO (LOCALSTORAGE) ---
function salvarNoHistorico(op, res) {
    let historico = JSON.parse(localStorage.getItem("procalc_historico")) || [];
    historico.unshift({ op, res });

    if (historico.length > 10) historico.pop();

    localStorage.setItem("procalc_historico", JSON.stringify(historico));
    renderizarHistorico();
}

function renderizarHistorico() {
    const lista = document.getElementById("listaHistorico");
    if (!lista) return;
    const historico = JSON.parse(localStorage.getItem("procalc_historico")) || [];

    lista.innerHTML = historico.map(item => `
        <li class="animate-in">
            <span>${item.op}</span> = <strong style="color: #00adb5">${item.res}</strong>
        </li>
    `).join("");
}

function limparHistorico() {
    localStorage.removeItem("procalc_historico");
    renderizarHistorico();
}

// --- BLOCO DE NOTAS ---
const campoNotas = document.getElementById("blocoNotas");
if (campoNotas) {
    campoNotas.addEventListener("input", () => {
        localStorage.setItem("procalc_notas", campoNotas.value);
    });
}

function compartilharNotas() {
    const texto = campoNotas.value;
    if (!texto) return alert("O bloco está vazio!");

    if (navigator.share) {
        navigator.share({ title: 'ProCalc Notas', text: texto });
    } else {
        navigator.clipboard.writeText(texto);
        alert("Copiado para a área de transferência!");
    }
}

// --- INTERFACE ---
function toggleShift() {
    shiftAtivo = !shiftAtivo;
    const btn = document.querySelector(".btn-shift");
    if (btn) {
        btn.style.backgroundColor = shiftAtivo ? "#00adb5" : "#444";
        btn.style.color = shiftAtivo ? "#121212" : "#eee";
    }
}

function trocarModo() {
    alert("Modo científico ativado!");
}