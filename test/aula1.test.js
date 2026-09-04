const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularViagem, lerArgumentos, formatarResumo } = require('../aula1');

test('calcula todos os custos de uma viagem de ida e volta', () => {
  const resultado = calcularViagem({
    distanciaKm: 100, consumoKmPorLitro: 10, precoCombustivel: 5,
    pedagios: 12, estacionamento: 8, passageiros: 2, idaEVolta: true, reservaPercentual: 10,
  });

  assert.equal(resultado.distanciaTotalKm, 200);
  assert.equal(resultado.litrosNecessarios, 20);
  assert.equal(resultado.custoCombustivel, 100);
  assert.equal(resultado.total, 132);
  assert.equal(resultado.custoPorPassageiro, 66);
});

test('rejeita valores inválidos', () => {
  assert.throws(() => calcularViagem({ distanciaKm: 0, consumoKmPorLitro: 10, precoCombustivel: 5 }), /distância/);
  assert.throws(() => calcularViagem({ distanciaKm: 10, consumoKmPorLitro: 2, precoCombustivel: 5, passageiros: 1.5 }), /inteiro/);
});

test('aceita vírgula decimal nos argumentos do terminal', () => {
  assert.deepEqual(lerArgumentos(['-d', '50', '-c', '10,5', '-p', '6,29']), {
    distanciaKm: '50', consumoKmPorLitro: '10.5', precoCombustivel: '6.29',
  });
});

test('formata um resumo legível em reais', () => {
  const texto = formatarResumo(calcularViagem({ distanciaKm: 10, consumoKmPorLitro: 10, precoCombustivel: 5 }));
  assert.match(texto, /TOTAL ESTIMADO:.*R\$\s?5,00/);
});
