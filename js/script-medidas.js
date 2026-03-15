/* script-medidas.js */

// --- INICIALIZAÇÃO ---
window.onload = () => {
    renderizarHistoricoMedidas();
};

// --- FUNÇÃO PRINCIPAL DE CONVERSÃO ---
function converterMedidas() {
    const valor = parseFloat(document.getElementById("valorMedida").value);
    const de = document.getElementById("unidadeDe").value;
    const para = document.getElementById("unidadePara").value;
    const displayMain = document.getElementById("resultadoMedida");
    const displayUpper = document.getElementById("infoMedida");

    if (isNaN(valor)) {
        alert("Por favor, insira um valor numérico válido.");
        return;
    }

    // Tabela de conversão tendo o METRO (m) como base
    const fatores = {
        'm': 1,
        'km': 1000,
        'cm': 0.01,
        'mm': 0.001
    };

    // Lógica: Converte o valor de origem para metros, depois de metros para o destino
    const valorEmMetros = valor * fatores[de];
    const resultado = valorEmMetros / fatores[para];

    // Formatação: Se o número for muito pequeno ou grande, limita as casas decimais
    const resultadoFormatado = Number.isInteger(resultado) ? resultado : resultado.toFixed(4).replace(/\.?0+$/, "");

    // Atualiza o visor
    displayMain.innerText = resultadoFormatado;
    displayUpper.innerText = `${valor}${de} equivalem a:`;

    // Salva no histórico
    salvarHistoricoMedidas(`${valor}${de} ➔ ${para}`, `${resultadoFormatado}${para}`);
}

// --- HISTÓRICO (LOCAL STORAGE) ---
function salvarHistoricoMedidas(operacao, resultado) {
    let historico = JSON.parse(localStorage.getItem("procalc_medidas")) || [];

    // Adiciona no topo
    historico.unshift({ operacao, resultado });

    // Mantém apenas as últimas 5
    if (historico.length > 5) historico.pop();

    localStorage.setItem("procalc_medidas", JSON.stringify(historico));
    renderizarHistoricoMedidas();
}

function renderizarHistoricoMedidas() {
    const lista = document.getElementById("listaHistoricoMedidas");
    if (!lista) return;

    const historico = JSON.parse(localStorage.getItem("procalc_medidas")) || [];

    lista.innerHTML = historico.map(item => `
        <li class="animate-in">
            <span>${item.op || item.operacao}</span>
            <strong style="color: #00adb5">${item.res || item.resultado}</strong>
        </li>
    `).join("");
}

function limparHistoricoMedidas() {
    localStorage.removeItem("procalc_medidas");
    renderizarHistoricoMedidas();
    document.getElementById("resultadoMedida").innerText = "0";
    document.getElementById("infoMedida").innerText = "Histórico limpo";
}