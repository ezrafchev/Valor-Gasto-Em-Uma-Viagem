const form = document.querySelector('#trip-form');
const fields = Object.fromEntries(['distance', 'efficiency', 'fuel-price', 'passengers', 'tolls', 'parking', 'round-trip', 'reserve'].map((id) => [id, document.querySelector(`#${id}`)]));
const output = Object.fromEntries(['total', 'total-description', 'fuel-cost', 'extras-cost', 'reserve-cost', 'reserve-percent', 'per-person', 'reserve-value', 'form-error'].map((id) => [id, document.querySelector(`#${id}`)]));
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function numberFrom(input) {
  return Number(String(input.value).trim().replace(',', '.'));
}

function readTrip() {
  const trip = {
    distance: numberFrom(fields.distance), efficiency: numberFrom(fields.efficiency), price: numberFrom(fields['fuel-price']),
    passengers: numberFrom(fields.passengers), tolls: numberFrom(fields.tolls), parking: numberFrom(fields.parking),
    reserve: numberFrom(fields.reserve), roundTrip: fields['round-trip'].checked,
  };
  const validNumbers = [trip.distance, trip.efficiency, trip.price, trip.passengers, trip.tolls, trip.parking, trip.reserve].every(Number.isFinite);
  if (!validNumbers || trip.distance <= 0 || trip.efficiency <= 0 || trip.price < 0 || trip.tolls < 0 || trip.parking < 0 || trip.reserve < 0) throw new Error('Revise os valores informados. Use números maiores ou iguais a zero.');
  if (!Number.isInteger(trip.passengers) || trip.passengers < 1) throw new Error('O número de viajantes deve ser um número inteiro maior que zero.');
  return trip;
}

function calculate() {
  output['reserve-value'].textContent = `${fields.reserve.value}%`;
  output['reserve-percent'].textContent = `${fields.reserve.value}%`;
  try {
    const trip = readTrip();
    const distance = trip.distance * (trip.roundTrip ? 2 : 1);
    const fuel = (distance / trip.efficiency) * trip.price;
    const extras = trip.tolls + trip.parking;
    const reserve = (fuel + extras) * (trip.reserve / 100);
    const total = fuel + extras + reserve;
    output.total.textContent = money.format(total);
    output['fuel-cost'].textContent = money.format(fuel);
    output['extras-cost'].textContent = money.format(extras);
    output['reserve-cost'].textContent = money.format(reserve);
    output['per-person'].textContent = money.format(total / trip.passengers);
    output['total-description'].textContent = `${distance.toLocaleString('pt-BR')} km · ${trip.roundTrip ? 'ida e volta' : 'só ida'}`;
    output['form-error'].textContent = '';
    return { ...trip, distance, fuel, extras, reserveCost: reserve, total };
  } catch (error) {
    output['form-error'].textContent = error.message;
    return null;
  }
}

form.addEventListener('input', calculate);
form.addEventListener('change', calculate);
document.querySelector('#reset-button').addEventListener('click', () => { form.reset(); calculate(); });
document.querySelector('#copy-button').addEventListener('click', async (event) => {
  const trip = calculate();
  if (!trip) return;
  const summary = `Rota da viagem\nTotal: ${money.format(trip.total)}\nPor pessoa: ${money.format(trip.total / trip.passengers)}\nDistância: ${trip.distance.toLocaleString('pt-BR')} km`;
  try {
    await navigator.clipboard.writeText(summary);
    event.currentTarget.innerHTML = 'Resumo copiado <span aria-hidden="true">✓</span>';
    setTimeout(() => { event.currentTarget.innerHTML = 'Copiar resumo <span aria-hidden="true">↗</span>'; }, 1800);
  } catch { output['form-error'].textContent = 'Não foi possível copiar. Selecione os valores para compartilhar.'; }
});
calculate();
