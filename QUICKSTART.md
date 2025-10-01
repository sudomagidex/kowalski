# 🚀 Guia de Início Rápido - Kowalski

Este guia vai te ajudar a começar com o Kowalski em menos de 5 minutos!

## 📋 Pré-requisitos

- Node.js 18 ou superior
- npm ou pnpm
- Git

## ⚡ Instalação Rápida

```bash
# 1. Clone o repositório
git clone https://github.com/sudomagidex/kowalski.git
cd kowalski

# 2. Instale as dependências
npm install
# ou
pnpm install

# 3. Configure o ambiente
cp .env.example .env
```

## ⚙️ Configuração

Edite o arquivo `.env`:

```env
# Porta do servidor (padrão: 3000)
PORT=3000

# Ambiente (development/production)
NODE_ENV=development

# Chave da API - MUDE ISSO!
API_KEY=minha-chave-super-secreta

# Diretório das sessões
SESSION_DIR=./sessions

# Timeout do QR Code (60 segundos)
QR_TIMEOUT=60000

# Nível de log (trace/debug/info/warn/error/fatal)
LOG_LEVEL=info
```

## 🎯 Primeiro Uso

### 1. Inicie o servidor

```bash
npm run dev
```

Você verá:

```
[INFO] Starting Kowalski WhatsApp Bot...
[INFO] API server started on port 3000
```

### 2. Crie uma sessão

Em outro terminal:

```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "x-api-key: minha-chave-super-secreta" \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "minha-primeira-sessao"}'
```

### 3. Escaneie o QR Code

Um QR Code aparecerá no terminal onde o servidor está rodando. Escaneie com seu WhatsApp:

1. Abra o WhatsApp no celular
2. Toque em ⋮ (3 pontos) > Aparelhos conectados
3. Toque em "Conectar um aparelho"
4. Escaneie o QR Code exibido no terminal

### 4. Envie sua primeira mensagem!

Após conectar, envie uma mensagem:

```bash
curl -X POST http://localhost:3000/api/messages/send \
  -H "x-api-key: minha-chave-super-secreta" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5511999999999",
    "text": "Olá do Kowalski! 🤖"
  }'
```

**Nota**: Substitua `5511999999999` pelo número de destino (código do país + DDD + número).

## 🎨 Exemplos Práticos

### Enviar imagem

```bash
curl -X POST http://localhost:3000/api/messages/send \
  -H "x-api-key: minha-chave-super-secreta" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5511999999999",
    "type": "image",
    "mediaUrl": "https://picsum.photos/400/300",
    "caption": "Olha essa imagem legal!"
  }'
```

### Listar sessões ativas

```bash
curl http://localhost:3000/api/sessions \
  -H "x-api-key: minha-chave-super-secreta"
```

### Verificar status de uma sessão

```bash
curl http://localhost:3000/api/sessions/minha-primeira-sessao \
  -H "x-api-key: minha-chave-super-secreta"
```

### Deletar sessão

```bash
curl -X DELETE http://localhost:3000/api/sessions/minha-primeira-sessao \
  -H "x-api-key: minha-chave-super-secreta"
```

## 🧪 Testando

```bash
# Rodar todos os testes
npm test

# Testes em watch mode
npm run test:watch

# Ver coverage
npm run test:coverage
```

## 🔍 Verificando a saúde da API

```bash
curl http://localhost:3000/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "timestamp": "2025-09-30T12:00:00.000Z"
}
```

## 🐛 Problemas Comuns

### Erro: "Cannot find module"

```bash
# Reinstale as dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Unauthorized"

Verifique se você está enviando o header correto:

```
x-api-key: sua-chave-do-env
```

### QR Code não aparece

1. Verifique se o servidor está rodando
2. Aguarde alguns segundos após criar a sessão
3. Verifique os logs no terminal

### Mensagem não enviada

1. Certifique-se de que a sessão está conectada
2. Verifique se o número está no formato correto (com código do país)
3. Verifique os logs de erro no servidor

## 📖 Próximos Passos

1. **Leia a documentação completa**: [PROJECT_README.md](PROJECT_README.md)
2. **Entenda a arquitetura**: [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Explore os módulos**:
   - [API Documentation](src/api/README.md)
   - [Bot Documentation](src/bot/README.md)
   - [Shared Utils](src/shared/README.md)
4. **Deploy com Docker**: [DOCKER.md](DOCKER.md)

## 💡 Dicas

### Desenvolvimento

```bash
# Hot reload automático
npm run dev

# Lint do código
npm run lint

# Formatar código
npm run format
```

### Produção

```bash
# Build
npm run build

# Start produção
npm start
```

### Docker

```bash
# Build e start com docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f kowalski
```

## 🎓 Exemplos Avançados

### JavaScript/Node.js Client

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'x-api-key': 'minha-chave-super-secreta',
  },
});

async function sendMessage() {
  try {
    const response = await api.post('/messages/send', {
      to: '5511999999999',
      text: 'Mensagem do cliente Node.js!',
    });
    console.log('Enviado:', response.data);
  } catch (error) {
    console.error('Erro:', error.response?.data || error.message);
  }
}

sendMessage();
```

### Python Client

```python
import requests

api_url = 'http://localhost:3000/api'
headers = {
    'x-api-key': 'minha-chave-super-secreta',
    'Content-Type': 'application/json'
}

def send_message(to, text):
    response = requests.post(
        f'{api_url}/messages/send',
        headers=headers,
        json={'to': to, 'text': text}
    )
    return response.json()

result = send_message('5511999999999', 'Mensagem do Python!')
print(result)
```

## 🆘 Suporte

- **Issues**: [GitHub Issues](https://github.com/sudomagidex/kowalski/issues)
- **Documentação**: Veja os READMEs em cada pasta
- **Logs**: Sempre verifique os logs do servidor para detalhes

## ✅ Checklist de Verificação

Antes de reportar um problema, verifique:

- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado corretamente
- [ ] Servidor rodando (`npm run dev`)
- [ ] API Key correta nos requests
- [ ] Formato do número de telefone correto
- [ ] Sessão conectada antes de enviar mensagens

---

**Pronto para começar?** Execute `npm run dev` e divirta-se! 🚀
