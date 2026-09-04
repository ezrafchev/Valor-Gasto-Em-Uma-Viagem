#!/usr/bin/env node
'use strict';

/**
 * Calculadora de custos de viagem de carro.
 * Pode ser usada como módulo ou diretamente no terminal.
 */

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function assertPositiveNumber(value, label, { allowZero = false } = {}) {
  const number = Number(value);
  const isValid = Number.isFinite(number) && (allowZero ? number >= 0 : number > 0);

  if (!isValid) {
    throw new RangeError(`${label} deve ser um número ${allowZero ? 'maior ou igual a zero' : 'maior que zero'}.`);
  }

  return number;
}

/**
 * Calcula combustível, custos adicionais e divisão por passageiro.
 * @param {object} options Dados da viagem.
 * @returns {object} Resumo financeiro pronto para ser exibido ou reutilizado.
 */
function calcularViagem({
  distanciaKm,
  consumoKmPorLitro,
  precoCombustivel,
  pedagios = 0,
  estacionamento = 0,
  passageiros = 1,
  idaEVolta = false,
  reservaPercentual = 0,
}) {
  const distanciaBase = assertPositiveNumber(distanciaKm, 'A distância');
  const consumo = assertPositiveNumber(consumoKmPorLitro, 'O consumo');
  const preco = assertPositiveNumber(precoCombustivel, 'O preço do combustível', { allowZero: true });
  const custoPedagios = assertPositiveNumber(pedagios, 'Os pedágios', { allowZero: true });
  const custoEstacionamento = assertPositiveNumber(estacionamento, 'O estacionamento', { allowZero: true });
  const quantidadePassageiros = assertPositiveNumber(passageiros, 'A quantidade de passageiros');
  const reserva = assertPositiveNumber(reservaPercentual, 'A reserva percentual', { allowZero: true });

  if (!Number.isInteger(quantidadePassageiros)) {
    throw new RangeError('A quantidade de passageiros deve ser um número inteiro.');
  }

  const distanciaTotalKm = distanciaBase * (idaEVolta ? 2 : 1);
  const litrosNecessarios = distanciaTotalKm / consumo;
  const custoCombustivel = litrosNecessarios * preco;
  const subtotal = custoCombustivel + custoPedagios + custoEstacionamento;
  const valorReserva = subtotal * (reserva / 100);
  const total = subtotal + valorReserva;

  return {
    distanciaTotalKm,
    litrosNecessarios,
    custoCombustivel,
    custoPedagios,
    custoEstacionamento,
    subtotal,
    reservaPercentual: reserva,
    valorReserva,
    total,
    custoPorPassageiro: total / quantidadePassageiros,
    passageiros: quantidadePassageiros,
  };
}

function formatarResumo(resultado) {
  const numero = (valor, casas = 2) => valor.toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });

  return [
    '\n╭──────────────── RESUMO DA VIAGEM ────────────────╮',
    `│ Distância total:       ${numero(resultado.distanciaTotalKm)} km`,
    `│ Combustível necessário: ${numero(resultado.litrosNecessarios)} L`,
    `│ Custo do combustível:  ${BRL.format(resultado.custoCombustivel)}`,
    `│ Pedágios:              ${BRL.format(resultado.custoPedagios)}`,
    `│ Estacionamento:        ${BRL.format(resultado.custoEstacionamento)}`,
    `│ Reserva (${numero(resultado.reservaPercentual, 0)}%):          ${BRL.format(resultado.valorReserva)}`,
    '├──────────────────────────────────────────────────┤',
    `│ TOTAL ESTIMADO:        ${BRL.format(resultado.total)}`,
    `│ Por passageiro (${resultado.passageiros}):     ${BRL.format(resultado.custoPorPassageiro)}`,
    '╰──────────────────────────────────────────────────╯',
  ].join('\n');
}

function mostrarAjuda() {
  console.log(`\nUso: node aula1.js --distancia 540 --consumo 12 --preco 5.39 [opções]

Opções:
  -d, --distancia <km>       Distância de ida em quilômetros (obrigatório)
  -c, --consumo <km/l>       Consumo médio do veículo (obrigatório)
  -p, --preco <R$/l>         Preço por litro (obrigatório)
      --pedagios <R$>        Total de pedágios (padrão: 0)
      --estacionamento <R$>  Custo de estacionamento (padrão: 0)
      --passageiros <n>      Pessoas que dividirão o custo (padrão: 1)
      --ida-volta            Dobra a distância para calcular o retorno
      --reserva <percentual> Margem adicional para imprevistos (padrão: 0)
  -h, --ajuda                Exibe esta ajuda\n`);
}

function lerArgumentos(argumentos) {
  const aliases = { '-d': 'distanciaKm', '--distancia': 'distanciaKm', '-c': 'consumoKmPorLitro', '--consumo': 'consumoKmPorLitro', '-p': 'precoCombustivel', '--preco': 'precoCombustivel', '--pedagios': 'pedagios', '--estacionamento': 'estacionamento', '--passageiros': 'passageiros', '--reserva': 'reservaPercentual' };
  const options = {};

  for (let index = 0; index < argumentos.length; index += 1) {
    const arg = argumentos[index];
    if (arg === '--ida-volta') options.idaEVolta = true;
    else if (arg === '-h' || arg === '--ajuda') options.ajuda = true;
    else if (aliases[arg]) {
      const value = argumentos[index + 1];
      if (!value || aliases[value] || value === '--ida-volta' || value === '-h' || value === '--ajuda') {
        throw new Error(`Informe um valor para ${arg}.`);
      }
      options[aliases[arg]] = value.replace(',', '.');
      index += 1;
    }
  }
  return options;
}

function executarCli(argumentos = process.argv.slice(2)) {
  try {
    const options = lerArgumentos(argumentos);
    if (options.ajuda || argumentos.length === 0) {
      mostrarAjuda();
      return 0;
    }
    console.log(formatarResumo(calcularViagem(options)));
    return 0;
  } catch (error) {
    console.error(`\nErro: ${error.message}`);
    console.error('Use --ajuda para ver como executar o cálculo.');
    return 1;
  }
}

if (require.main === module) process.exitCode = executarCli();

module.exports = { calcularViagem, formatarResumo, lerArgumentos, executarCli };
