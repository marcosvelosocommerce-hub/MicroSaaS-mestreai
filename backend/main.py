import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Carrega a chave de API do arquivo .env
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("ERRO: A chave GOOGLE_API_KEY não foi encontrada no arquivo .env")

# 2. Configura o Google Gemini
genai.configure(api_key=api_key)

# 3. Inicia o App FastAPI
app = FastAPI(title="Mestre IA - Backend")

# 4. Configura o CORS (Isso permite que o Frontend acesse este Backend)
# Se não fizer isso, o navegador bloqueia a conexão.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Em produção, configure URLs específicas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"mensagem": "API do Mestre IA está rodando!"}

@app.post("/transcrever-audio")
async def processar_audio(arquivo: UploadFile = File(...)):
    """
    Recebe um arquivo de áudio, envia para o Google Gemini e retorna o resumo.
    """
    print(f"Recebendo arquivo: {arquivo.filename}")
    
    # Nome temporário para salvar o arquivo no servidor antes de mandar pro Google
    caminho_temp = f"temp_{arquivo.filename}"

    try:
        # A. Salva o arquivo que chegou do frontend no disco do servidor
        with open(caminho_temp, "wb") as buffer:
            shutil.copyfileobj(arquivo.file, buffer)

        # B. Faz upload para o Google AI Studio (File API)
        print("Enviando áudio para o Google...")
        arquivo_google = genai.upload_file(path=caminho_temp)
        print(f"Upload concluído: {arquivo_google.uri}")

        # C. Configura o Modelo (Gemini 1.5 Flash é rápido e grátis)
        model = genai.GenerativeModel('gemini-1.5-flash')

        # D. Define o Prompt (O que a IA deve fazer)
        prompt = """
        Atue como um professor universitário assistente.
        Escute este áudio da aula com atenção.
        
        1. Resuma o conteúdo principal em parágrafos claros.
        2. Liste os 'Conceitos-Chave' em bullet points.
        3. Se houver menção a datas, provas ou trabalhos, crie uma seção 'Importante'.
        
        Formate a resposta em Markdown.
        """

        # E. Gera o conteúdo
        print("Gerando resumo...")
        response = model.generate_content([prompt, arquivo_google])

        # F. Limpeza (Apaga o arquivo do servidor local para não encher o disco)
        os.remove(caminho_temp)
        
        # Retorna o texto da IA
        return {
            "sucesso": True, 
            "resumo": response.text
        }

    except Exception as e:
        # Se der erro, tenta apagar o arquivo temporário mesmo assim
        if os.path.exists(caminho_temp):
            os.remove(caminho_temp)
        
        print(f"Erro: {e}")
        return {"sucesso": False, "erro": str(e)}

# Código para rodar direto pelo play do VS Code se quiser, 
# mas recomendo rodar pelo terminal
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)