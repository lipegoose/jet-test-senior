import * as Sentry from '@sentry/node';
import express, { Request, Response, NextFunction } from 'express';
import { connectRabbitMQ } from './config/rabbitmq';
import messageRoutes from './routes/messageRoutes';
import { logError, logInfo } from './services/loggerService';

Sentry.init({
  dsn: process.env.SENTRY_DSN || 'https://1f1182d71d932e249aa6db32de1caaa7@o4508909151649792.ingest.us.sentry.io/4508909318373376',
  tracesSampleRate: 1.0, // ajuste conforme necessário
});

const app = express();
const PORT = process.env.PORT || 3000;

// Novo middleware do Sentry para capturar requisições
app.use(Sentry.Handlers.requestHandler());

// Middleware para interpretar JSON
app.use(express.json());

// Utiliza o router que já define a rota /send-message com rate limiting
app.use('/', messageRoutes);

// Rota de teste
app.get('/', (req: Request, res: Response) => {
  res.send('Servidor rodando corretamente!');
});

// Novo middleware do Sentry para capturar erros
app.use(Sentry.Handlers.errorHandler());

// Captura erros gerais
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logError('Erro inesperado no servidor', { error: err.message });
  res.status(500).json({ error: 'Erro interno no servidor' });
});

// log de inicialização
logInfo('Servidor iniciado', { port: PORT });

// Inicializa a conexão com o RabbitMQ antes de iniciar o servidor
connectRabbitMQ()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    logError('Erro ao conectar no RabbitMQ', { error });
    console.error('Erro ao conectar no RabbitMQ:', error);
  });
