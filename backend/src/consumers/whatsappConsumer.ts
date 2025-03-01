import { messageQueue } from '../queues/messageQueue';
import { startWhatsApp, sendMessage } from '../services/whatsappService';

async function startConsumer() {
  // Inicia a sessão do WhatsApp
  const whatsappSocket = await startWhatsApp();
  console.log("WhatsApp consumer initialized.");

  // Processa os jobs da fila do Bull
  messageQueue.process(async (job) => {
    const { phone, message } = job.data;
    try {
      console.log("Processing job:", job.data);
      await sendMessage(whatsappSocket, phone, message);
      console.log(`Mensagem enviada para ${phone}`);
    } catch (error) {
      console.error("Erro ao enviar mensagem via WhatsApp:", error);
      // Lança o erro para que o Bull possa reprocessar conforme configurado
      throw error;
    }
  });
}

// Inicia o consumidor
startConsumer().catch((error) => {
  console.error("Erro ao iniciar o consumidor do WhatsApp:", error);
});
