export async function fetchEventos() {
  const response = await fetch('/mock/eventos.json');

  if (!response.ok) {
    throw new Error('Falha ao carregar eventos.');
  }

  return response.json();
}