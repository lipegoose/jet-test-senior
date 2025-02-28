import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys';
import qrcodeTerminal from 'qrcode-terminal';

// Inicializa a sessão do WhatsApp e retorna o socket
export async function startWhatsApp(): Promise<ReturnType<typeof makeWASocket>> {
  // O diretório onde as credenciais serão armazenadas
  const authFolder = './auth_info_baileys';
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true, // Imprime o QR code no terminal para a primeira autenticação
  });

  // Atualiza as credenciais sempre que houver uma mudança
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update: any) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'open') {
      console.log('WhatsApp bot connected!');
    } else if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== 401;
      console.log('WhatsApp bot disconnected. Reconnect:', shouldReconnect);
      if (shouldReconnect) {
        startWhatsApp();
      }
    }
  });

  return sock;
}

// Função para enviar uma mensagem via WhatsApp
export async function sendMessage(
  sock: ReturnType<typeof makeWASocket>,
  phone: string,
  message: string
): Promise<void> {
  const chatId = phone.includes('@c.us') ? phone : `${phone}@c.us`;
  await sock.sendMessage(chatId, { text: message });
  console.log(`Message sent to ${phone}: ${message}`);
}
