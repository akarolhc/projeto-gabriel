const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();

// Middleware para analisar os dados do corpo da requisição
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Caso envie dados no formato JSON

// Definir a pasta dos arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Chave pública e privada para criptografia
const publicKey = `-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----`;

const privateKey = `-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----`;

// Rota para criptografar a mensagem
app.post('/encrypt', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).send('Mensagem não enviada corretamente.');
    }

    const buffer = Buffer.from(message, 'utf8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    res.send(encrypted.toString('base64'));
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
