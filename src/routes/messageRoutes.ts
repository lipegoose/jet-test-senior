import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { sendMessageController } from '../controllers/messageController';

const router = Router();

// Middleware de rate-limiting para evitar abusos na rota de envio de mensagens
const sendMessageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto de janela
  max: 10,           // máximo de 10 requisições por IP por minuto
  message: 'Muitas requisições deste IP, por favor tente novamente após um minuto.'
});

// Rota POST /send-message com rate-limiting aplicado
router.post('/send-message', sendMessageLimiter, sendMessageController);

export default router;
