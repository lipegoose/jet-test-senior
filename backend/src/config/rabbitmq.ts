import amqp, { Connection, Channel } from 'amqplib';

let connection: Connection;
let channel: Channel;
const QUEUE_NAME = 'messageQueue';

export const connectRabbitMQ = async (): Promise<void> => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq');
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log('Conectado ao RabbitMQ');
  } catch (error) {
    console.error('Erro ao conectar no RabbitMQ:', error);
    process.exit(1);
  }
};

export const publishMessageEvent = async (data: any): Promise<void> => {
  if (!channel) {
    throw new Error('Canal RabbitMQ não está inicializado');
  }
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(data)), { persistent: true });
};
