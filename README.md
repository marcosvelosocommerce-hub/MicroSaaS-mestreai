# Mestre IA - MicroSaaS

Uma aplicação web que transforma áudios de aulas em resumos inteligentes usando IA.

## 🚀 Deploy em Produção

### Opção 1: Deploy Fácil (Recomendado)

#### Backend (Railway)
1. Acesse [Railway.app](https://railway.app)
2. Conecte seu GitHub
3. Selecione este repositório
4. Configure as variáveis de ambiente:
   - `GOOGLE_API_KEY`: Sua chave da API do Google Gemini
5. Deploy automático!

#### Frontend (Vercel)
1. Acesse [Vercel.com](https://vercel.com)
2. Conecte seu GitHub
3. Selecione a pasta `frontend`
4. Configure a variável de ambiente:
   - `VITE_API_URL`: URL do seu backend (ex: `https://your-backend.railway.app`)
5. Deploy automático!

### Opção 2: Deploy Manual

#### Backend
```bash
# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com sua GOOGLE_API_KEY

# Rodar localmente
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Preview local
npm run preview
```

## 🔧 Configuração

### Variáveis de Ambiente

#### Backend (.env)
```
GOOGLE_API_KEY=your_google_api_key_here
```

#### Frontend
```
VITE_API_URL=https://your-backend-url.com
```

## 📋 Funcionalidades

- ✅ Upload de arquivos de áudio (MP3, WAV, M4A)
- ✅ Processamento com Google Gemini AI
- ✅ Geração de resumos inteligentes
- ✅ Interface responsiva e moderna
- ✅ Drag & drop para upload
- ✅ Copiar resumo para clipboard

## 🛠️ Tecnologias

- **Backend**: FastAPI, Python, Google Gemini AI
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Deploy**: Railway/Vercel

## 📄 Licença

MIT