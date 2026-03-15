/* script-juros.js */

window.onload = () => {
    renderizarHistoricoJuros();
};

function calcularJuros() {
    const capital = parseFloat(document.getElementById("capital").value);
    const taxa = parseFloat(document.getElementById("taxa").value) / 100;
    const tempo = parseFloat(document.getElementById("tempo").value);

    const displayMain = document.getElementById("resultadoJuros");
    const displayInfo = document.getElementById("infoJuros");
    const detalhes = document.getElementById("detalhesJuros");

    if (isNaN(capital) || isNaN(taxa) || isNaN(tempo)) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    // Fórmula: M = C * (1 + i)^t
    const montante = capital * Math.pow((1 + taxa), tempo);
    const jurosGanhos = montante - capital;

    // Atualiza Visor
    displayMain.innerText = montante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    displayInfo.innerText = `Total após ${tempo} meses`;

    // Atualiza Detalhamento na Sidebar
    detalhes.innerHTML = `
        <p>Investimento: <strong>${capital.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
        <p>Juros Totais: <strong style="color: #00adb5">${jurosGanhos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
        <p>Rendimento: <strong>${((jurosGanhos / capital) * 100).toFixed(2)}%</strong></p>
    `;

    salvarHistoricoJuros(capital, montante);
}

function salvarHistoricoJuros(cap, mon) {
    let hist = JSON.parse(localStorage.getItem("procalc_juros")) || [];
    hist.unshift({ cap, mon, data: new Date().toLocaleDateString() });
    if (hist.length > 5) hist.pop();
    localStorage.setItem("procalc_juros", JSON.stringify(hist));
    renderizarHistoricoJuros();
}

function renderizarHistoricoJuros() {
    const lista = document.getElementById("listaHistoricoJuros");
    if (!lista) return;
    const hist = JSON.parse(localStorage.getItem("procalc_juros")) || [];
    lista.innerHTML = hist.map(item => `
        <li class="animate-in" style="display:flex; flex-direction:column; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">
            <small style="color:#555">${item.data}</small>
            <span>Cap: ${item.cap.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <strong style="color:#00adb5">Total: ${item.mon.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
        </li>
    `).join("");
}

function limparHistoricoJuros() {
    localStorage.removeItem("procalc_juros");
    renderizarHistoricoJuros();
    document.getElementById("detalhesJuros").innerText = "Aguardando cálculo...";
}