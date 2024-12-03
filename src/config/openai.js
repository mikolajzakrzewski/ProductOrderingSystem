const { Configuration, OpenAIApi } = require('openai');

// Pobieranie klucza API z pliku `.env`
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = openai;
