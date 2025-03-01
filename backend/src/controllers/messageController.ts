import { Request, Response } from 'express';
import { addMessageJob } from '../queues/messageQueue';
import { publishMessageEvent } from '../config/rabbitmq';

export const sendMessageController = async (req: Request, res: Response): Promise<void> => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    res.status(400).json({ error: 'Os campos "phone" e "message" são obrigatórios.' });
    return;
  }

  try {
    // Enfileira o job para processamento assíncrono
    await addMessageJob({ phone, message });
    // Publica um evento no RabbitMQ indicando que a mensagem está pronta para envio
    await publishMessageEvent({ phone, message, timestamp: new Date().toISOString() });

    res.status(202).json({
      status: 'Mensagem recebida e enfileirada para processamento.',
      phone,
      message,
    });
    return;
  } catch (error) {
    console.error('Erro ao enfileirar mensagem:', error);
    res.status(500).json({ error: 'Erro ao enfileirar mensagem.' });
    return;
  }
};
