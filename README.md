# Calculadora de custo de viagem 🚗

Uma calculadora de terminal para planejar viagens de carro com mais segurança. Além do combustível, ela considera pedágios, estacionamento, margem para imprevistos, ida e volta e divisão do total entre passageiros.

## Começar

O projeto não possui dependências externas. É necessário apenas o [Node.js](https://nodejs.org/) 18 ou superior.

```bash
npm start -- --distancia 540 --consumo 12 --preco 5.39
```

> Os dois `--` separam os comandos do npm dos argumentos enviados para a calculadora.

## Exemplo completo

```bash
node aula1.js --distancia 540 --consumo 12 --preco 5,39 \
  --pedagios 38.50 --estacionamento 25 --passageiros 3 \
  --ida-volta --reserva 10
```

O resultado mostra a distância total, litros necessários, detalhamento dos custos, total estimado e valor por passageiro — todos formatados em real brasileiro.

## Opções

| Opção | Descrição | Padrão |
| --- | --- | --- |
| `-d`, `--distancia <km>` | Distância apenas de ida em quilômetros. | Obrigatório |
| `-c`, `--consumo <km/l>` | Consumo médio do veículo. | Obrigatório |
| `-p`, `--preco <R$/l>` | Preço do litro do combustível. | Obrigatório |
| `--pedagios <R$>` | Soma dos pedágios. | `0` |
| `--estacionamento <R$>` | Custo de estacionamento. | `0` |
| `--passageiros <n>` | Pessoas que dividirão os custos. | `1` |
| `--ida-volta` | Dobra a distância para incluir o retorno. | Desligado |
| `--reserva <percentual>` | Margem para imprevistos. | `0` |
| `-h`, `--ajuda` | Exibe o guia no terminal. | — |

Valores decimais aceitam ponto ou vírgula, por exemplo `5.39` ou `5,39`.

## Desenvolvimento

```bash
npm test
node aula1.js --ajuda
```

As funções também podem ser importadas em outro projeto:

```js
const { calcularViagem } = require('./aula1');
const resumo = calcularViagem({ distanciaKm: 100, consumoKmPorLitro: 10, precoCombustivel: 5.5 });
console.log(resumo.total);
```
