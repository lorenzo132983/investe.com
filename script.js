document.getElementById('formSimulacao').addEventListener('submit', function(e) {
    e.preventDefault();

    const valorInicial = parseFloat(document.getElementById('valorInicial').value);
    const aporteMensal = parseFloat(document.getElementById('aporteMensal').value);
    const anos = parseInt(document.getElementById('anos').value);
    const taxaAnual = parseFloat(document.getElementById('taxaJuros').value) / 100;

    const meses = anos * 12;
    const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1;

    let saldoComJuros = [];
    let saldoSemJuros = [];
    let acumulado = valorInicial;
    let acumuladoSemJuros = valorInicial;

    for (let i = 0; i <= meses; i++) {
        saldoComJuros.push(acumulado);
        saldoSemJuros.push(acumuladoSemJuros);

        acumulado = acumulado * (1 + taxaMensal) + aporteMensal;
        acumuladoSemJuros += aporteMensal;
    }

    const totalFinal = saldoComJuros[meses];
    const totalInvestido = valorInicial + aporteMensal * meses;
    const totalJuros = totalFinal - totalInvestido;

    const formatar = valor => valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    document.getElementById('resultado').innerHTML = `
        Total final: <strong>${formatar(totalFinal)}</strong><br>
        Investido: ${formatar(totalInvestido)}<br>
        Juros ganhos: ${formatar(totalJuros)}
    `;

    const ctx = document.getElementById('graficoInvestimento').getContext('2d');
    if (window.grafico) window.grafico.destroy();

    window.grafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: meses + 1 }, (_, i) => `Mês ${i}`),
            datasets: [
                {
                    label: 'Com Juros Compostos',
                    data: saldoComJuros,
                    borderColor: '#00796b',
                    backgroundColor: 'rgba(0,121,107,0.2)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Aportes Sem Juros',
                    data: saldoSemJuros,
                    borderColor: '#bdbdbd',
                    backgroundColor: 'rgba(189,189,189,0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: ${formatar(ctx.parsed.y)}`
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Tempo (meses)' }
                },
                y: {
                    title: { display: true, text: 'Valor acumulado (R$)' },
                    beginAtZero: true
                }
            }
        }
    });
});

