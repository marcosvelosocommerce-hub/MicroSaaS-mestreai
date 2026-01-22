import { useState } from 'react';
import axios from 'axios';
import { Sparkles, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { AudioUploadZone } from '@/components/AudioUploadZone';
import { SummaryCard } from '@/components/SummaryCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const API_ENDPOINT = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/transcrever-audio`
  : 'http://127.0.0.1:8001/transcrever-audio';

const App = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'Nenhum arquivo selecionado',
        description: 'Por favor, selecione um arquivo de áudio primeiro.',
      });
      return;
    }

    setIsLoading(true);
    setSummary(null);

    try {
      const formData = new FormData();
      formData.append('arquivo', selectedFile);

      const response = await axios.post(API_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;

      if (data.sucesso && data.resumo) {
        setSummary(data.resumo);
        toast({
          title: 'Resumo gerado com sucesso!',
          description: 'Seu resumo está pronto para visualização.',
        });
      } else {
        throw new Error(data.mensagem || 'Erro ao processar o áudio');
      }
    } catch (error: any) {
      console.error('Error:', error);
      
      let errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data?.mensagem || `Erro do servidor: ${error.response.status}`;
        } else if (error.code === 'ERR_NETWORK') {
          errorMessage = 'Erro de conexão. Verifique se o backend está rodando em http://127.0.0.1:8001';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        variant: 'destructive',
        title: 'Erro ao gerar resumo',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Transforme suas aulas em resumos
            <br />
            <span className="gradient-text">inteligentes em segundos</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Envie o áudio da sua aula e deixe nossa IA criar um resumo completo e organizado para você.
          </p>
        </div>

        {/* Upload Zone */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <AudioUploadZone
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            disabled={isLoading}
          />
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Button
            size="lg"
            onClick={handleGenerateSummary}
            disabled={!selectedFile || isLoading}
            className="px-8 py-6 text-base font-medium shadow-primary hover:shadow-card-hover transition-all duration-300 disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processando áudio com IA...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Gerar Resumo da Aula
              </>
            )}
          </Button>
        </div>

        {/* Summary Result */}
        {summary && (
          <div className="mb-8">
            <SummaryCard content={summary} />
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
          <p>© 2024 Mestre IA. Potencializado por inteligência artificial.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;