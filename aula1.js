/*
Este é um desafio de projeto para declarar o valor gasto em uma viagem. Existem três variáveis a serem consideradas: distância percorrida, consumo de combustível do carro e preço do combustível.
o preço do combustível será declarado como uma constante, pois não irá mudar durante a execução do programa. a distância percorrida e o consumo de combustível serão declarados como variáveis, pois poderão mudar durante a execução do programa.
*/



const preço_combustivel = 5.39; // R$ por litro

let distancia_km = 540; // km

let gasto_medio_combustivel = 7.5;   // km/l 

let valor_gasto = (distancia_km / gasto_medio_combustivel) * preço_combustivel;

console.log("O valor gasto para percorrer 540km é: " + valor_gasto);




/* Por exemplo: O gps cria um desvio e você percorre 100km a mais.
*/




distancia_km = distancia_km + 100;
let valor_gasto_2 = (distancia_km / gasto_medio_combustivel) * preço_combustivel;
console.log("O valor gasto para percorrer 640km é: " + valor_gasto_2);

/* Suponhamos que o carro tenha um consumo de combustível maior que o esperado, por exemplo, 5km/l.*/

gasto_medio_combustivel = 5;
let valor_gasto_3 = (distancia_km / gasto_medio_combustivel) * preço_combustivel;
console.log("O valor gasto para percorrer 640km é: " + valor_gasto_3);

/*Um exemplo simples de como utilzar a linguagem javascript para calcular o valor gasto em uma viagem.*/