import Bull from 'bull';

interface MessageJobData {
  phone: string;
  message: string;
}

const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';

export const messageQueue = new Bull<MessageJobData>('messageQueue', redisUrl);

messageQueue.process(async (job) => {
  console.log('Processando job:', job.data);
  // Aqui, futuramente, implementaremos o envio da mensagem via Baileys.
  return Promise.resolve();
});

export const addMessageJob = async (data: MessageJobData): Promise<void> => {
  await messageQueue.add(data, {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  });
};
