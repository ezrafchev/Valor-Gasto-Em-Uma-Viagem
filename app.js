const form = document.querySelector('#trip-form');
const fields = Object.fromEntries(['distance', 'efficiency', 'fuel-price', 'passengers', 'tolls', 'parking', 'round-trip', 'reserve'].map((id) => [id, document.querySelector(`#${id}`)]));
const output = Object.fromEntries(['total', 'total-description', 'fuel-cost', 'extras-cost', 'reserve-cost', 'reserve-percent', 'per-person', 'reserve-value', 'liters-needed', 'cost-per-km', 'form-error'].map((id) => [id, document.querySelector(`#${id}`)]));
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
    const liters = distance / trip.efficiency;
    const fuel = liters * trip.price;
    const extras = trip.tolls + trip.parking;
    const reserve = (fuel + extras) * (trip.reserve / 100);
    const total = fuel + extras + reserve;
    output.total.textContent = money.format(total);
    output['fuel-cost'].textContent = money.format(fuel);
    output['extras-cost'].textContent = money.format(extras);
    output['reserve-cost'].textContent = money.format(reserve);
    output['per-person'].textContent = money.format(total / trip.passengers);
    output['liters-needed'].textContent = `${liters.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} L`;
    output['cost-per-km'].textContent = money.format(total / distance);
    output['total-description'].textContent = `${distance.toLocaleString('pt-BR')} km · ${trip.roundTrip ? 'ida e volta' : 'só ida'}`;
    output['form-error'].textContent = '';
    localStorage.setItem('rota-trip', JSON.stringify({
      distance: fields.distance.value, efficiency: fields.efficiency.value, price: fields['fuel-price'].value,
      passengers: fields.passengers.value, tolls: fields.tolls.value, parking: fields.parking.value,
      reserve: fields.reserve.value, roundTrip: fields['round-trip'].checked,
    }));
    return { ...trip, distance, liters, fuel, extras, reserveCost: reserve, total };
  } catch (error) {
    output['form-error'].textContent = error.message;
    return null;
  }
}

function restoreTrip() {
  try {
    const savedTrip = JSON.parse(localStorage.getItem('rota-trip'));
    if (!savedTrip) return;
    fields.distance.value = savedTrip.distance;
    fields.efficiency.value = savedTrip.efficiency;
    fields['fuel-price'].value = savedTrip.price;
    fields.passengers.value = savedTrip.passengers;
    fields.tolls.value = savedTrip.tolls;
    fields.parking.value = savedTrip.parking;
    fields.reserve.value = savedTrip.reserve;
    fields['round-trip'].checked = savedTrip.roundTrip;
  } catch { localStorage.removeItem('rota-trip'); }
}

form.addEventListener('input', calculate);
form.addEventListener('change', calculate);
document.querySelector('#reset-button').addEventListener('click', () => { localStorage.removeItem('rota-trip'); form.reset(); calculate(); });
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
restoreTrip();
calculate();
