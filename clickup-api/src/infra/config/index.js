import dotenv from 'dotenv';

dotenv.config();

export const config = {
  api: {
    port: process.env.PORT || 3000,
  },
  clickup: {
    personalToken: process.env.PERSONAL_TOKEN,
    apiUrl: process.env.API_URL,
    listId: process.env.LIST_ID,
  },
};

// Validar variáveis de ambiente
const { personalToken, apiUrl, listId } = config.clickup;

if (!personalToken || !apiUrl || !listId) {
  console.error("ERRO FATAL: Variáveis de ambiente do ClickUp não definidas.");
  console.error("Verifique o arquivo .env e as variáveis PERSONAL_TOKEN, API_URL e LIST_ID.");
  process.exit(1);
}
