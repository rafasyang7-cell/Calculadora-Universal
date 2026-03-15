/* script-moeda.js */

window.onload = () => {
    renderizarHistoricoMoeda();
};

async function converterMoeda() {
    const valor = document.getElementById("valorInput").value;
    const de = document.getElementById("moedaOrigem").value;
    const para = document.getElementById("moedaDestino").value;
    const displayMain = document.getElementById("resultadoMoeda");
    const displayUpper = document.getElementById("historicoMoeda");

    if (!valor || valor <= 0) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    displayMain.innerText = "Convertendo...";

    try {
        // Busca a cotação na AwesomeAPI
        let url = `https://economia.awesomeapi.com.br/last/${de}-${para}`;
        let response = await fetch(url);
        let data = await response.json();

        let cotacao;
        let par = `${de}${para}`;

        if (data[par]) {
            cotacao = parseFloat(data[par].bid);
        } else {
            // Caso o par direto não exista (ex: CNY-BRL), tenta o inverso
            url = `https://economia.awesomeapi.com.br/last/${para}-${de}`;
            response = await fetch(url);
            data = await response.json();
            let parInverso = `${para}${de}`;

            if (data[parInverso]) {
                cotacao = 1 / parseFloat(data[parInverso].bid);
            } else {
                throw new Error("Par não suportado");
            }
        }

        const resultado = valor * cotacao;

        // Formatação para Real, Dólar, Euro ou Yuan
        const formatado = resultado.toLocaleString('pt-BR', {
            style: 'currency',
            currency: para
        });

        displayMain.innerText = formatado;
        displayUpper.innerText = `1 ${de} = ${cotacao.toFixed(4)} ${para}`;

        salvarNoHistoricoMoeda(`${valor} ${de} ➔ ${para}`, formatado);

    } catch (error) {
        console.error("Erro:", error);
        displayMain.innerText = "Erro";
        displayUpper.innerText = "Cotação indisponível";
    }
}

function salvarNoHistoricoMoeda(operacao, resultado) {
    let historico = JSON.parse(localStorage.getItem("procalc_moedas")) || [];
    historico.unshift({ operacao, resultado });
    if (historico.length > 5) historico.pop();
    localStorage.setItem("procalc_moedas", JSON.stringify(historico));
    renderizarHistoricoMoeda();
}

function renderizarHistoricoMoeda() {
    const lista = document.getElementById("listaHistoricoMoeda");
    if (!lista) return;
    const historico = JSON.parse(localStorage.getItem("procalc_moedas")) || [];
    lista.innerHTML = historico.map(item => `
        <li class="animate-in">
            <span>${item.operacao}</span>
            <strong style="color: #00adb5">${item.resultado}</strong>
        </li>
    `).join("");
}

function limparHistoricoMoeda() {
    localStorage.removeItem("procalc_moedas");
    renderizarHistoricoMoeda();
}