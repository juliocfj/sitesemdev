function showSection(sectionId) {
    const sections = document.querySelectorAll('main section');
    sections.forEach((section) => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

async function searchFlights() {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const departureDate = document.getElementById('date').value;
    const returnDate = document.getElementById('return-date').value;

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '<p>Buscando voos...</p>';

    try {
        const response = await fetch('http://localhost:3000/search-flights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ origin, destination, departureDate, returnDate }),
        });

        const data = await response.json();
        resultsContainer.innerHTML = '';
        data.data.forEach((flight) => {
            const flightInfo = document.createElement('div');
            flightInfo.innerHTML = `
                <p><strong>Origem:</strong> ${flight.itineraries[0].segments[0].departure.iataCode}</p>
                <p><strong>Destino:</strong> ${flight.itineraries[0].segments[0].arrival.iataCode}</p>
                <p><strong>Preço:</strong> $${flight.price.total}</p>
                <hr>
            `;
            resultsContainer.appendChild(flightInfo);
        });
    } catch (error) {
        console.error(error);
        resultsContainer.innerHTML = '<p>Erro ao buscar voos.</p>';
    }
}
