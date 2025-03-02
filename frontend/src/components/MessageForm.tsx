import React, { useState } from 'react';
import axios from 'axios';

const MessageForm: React.FC = () => {
  // Estados para armazenar os dados do formulário e o status
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Envie os dados para o backend. Ajuste a URL se necessário.
      const response = await axios.post('http://localhost:3000/send-message', {
        phone,
        message,
      });
      console.log(response.data);
      setStatus('Mensagem enfileirada com sucesso!');
      setPhone('');
      setMessage('');
    } catch (error) {
      console.error('Erro ao enviar a mensagem:', error);
      setStatus('Erro ao enviar a mensagem.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '1rem' }}>
      <h1>Enviar Mensagem</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="phone">Número do WhatsApp:</label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ex: 5511999999999"
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="message">Mensagem:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem"
            style={{ width: '100%', padding: '0.5rem', height: '150px' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '0.75rem 1.5rem' }}>
          Enviar
        </button>
      </form>
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
};

export default MessageForm;
