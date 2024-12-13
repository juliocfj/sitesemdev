const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const AMADEUS_API_KEY = 'Qro4mvscQbbAGSzG8KldP0SoWAxGX6wk';
const AMADEUS_API_SECRET = 'WacUXYoEA3xJb1hh';

// Função para obter o token de acesso
async function getAccessToken() {
    const url = 'https://test.api.amadeus.com/v1/security/oauth2/token';

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', AMADEUS_API_KEY);
    params.append('client_secret', AMADEUS_API_SECRET);

    try {
        const response = await axios.post(url, params);
        return response.data.access_token;
    } catch (error) {
        console.error('Erro ao obter token:', error.response.data);
        throw new Error('Não foi possível autenticar com a API do Amadeus.');
    }
}

// Endpoint para busca de voos
app.post('/search-flights', async (req, res) => {
    const { origin, destination, departureDate, returnDate } = req.body;

    try {
        const token = await getAccessToken();
        const url = 'https://test.api.amadeus.com/v2/shopping/flight-offers';

        const params = {
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: departureDate,
            returnDate: returnDate,
            adults: 1, // Número de passageiros
            max: 5, // Número máximo de resultados
        };

        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });

        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar voos:', error.response.data);
        res.status(500).json({ error: 'Erro ao buscar voos' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
