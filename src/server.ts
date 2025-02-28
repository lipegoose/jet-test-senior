import express, { Request, Response } from 'express';
import { connectRabbitMQ } from './config/rabbitmq';
import messageRoutes from './routes/messageRoutes'; 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Utiliza o router que já define a rota /send-message com rate limiting
app.use('/', messageRoutes);

// Rota de teste
app.get('/', (req: Request, res: Response) => {
  res.send('Servidor rodando corretamente!');
});

// Inicializa a conexão com o RabbitMQ antes de iniciar o servidor
connectRabbitMQ()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar no RabbitMQ:', error);
  });
