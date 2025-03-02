import * as Sentry from '@sentry/node';
import express, { Request, Response } from 'express';
import { connectRabbitMQ } from './config/rabbitmq';
import messageRoutes from './routes/messageRoutes'; 

Sentry.init({
  dsn: process.env.SENTRY_DSN || 'https://1f1182d71d932e249aa6db32de1caaa7@o4508909151649792.ingest.us.sentry.io/4508909318373376',
  tracesSampleRate: 1.0, // ajuste conforme necessário
});

const app = express();
const PORT = process.env.PORT || 3000;

// Capture todas as requisições
// @ts-ignore
app.use(Sentry.Handlers.requestHandler());

// Middleware para interpretar JSON
app.use(express.json());

// Utiliza o router que já define a rota /send-message com rate limiting
app.use('/', messageRoutes);

// Rota de teste
app.get('/', (req: Request, res: Response) => {
  res.send('Servidor rodando corretamente!');
});

// Capture erros no final
// @ts-ignore
app.use(Sentry.Handlers.errorHandler());

// Inicializa a conexão com o RabbitMQ antes de iniciar o servidor
connectRabbitMQ()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
    });    
  })
  .catch((error) => {
    console.error('Erro ao conectar no RabbitMQ:', error);
  });
