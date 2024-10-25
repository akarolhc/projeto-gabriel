const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', 
{
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
    },
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Chave pública gerada a partir da chave privada

app.get('/encrypt', (req, res) => {
    res.status(405).send('Método GET não suportado para esta rota.');
});

app.post('/encrypt', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).send('Mensagem não fornecida.');
    }

    try {
        const encrypted = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            Buffer.from(message)
        );
        res.status(200).json({ encrypted: encrypted.toString('base64') });
    } catch (error) {
        console.error('Erro ao criptografar a mensagem:', error);
        res.status(500).send('Erro ao criptografar a mensagem.');
    }
});

app.get('/decrypt', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'decrypt.html'));
});

app.post('/decrypt', (req, res) => {
    const { message } = req.body;
    if (!message) {
      return res.status(400).send("Mensagem criptografada não fornecida.");
    }

    try {
        const decrypted = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            Buffer.from(message, 'base64')
        );
        res.status(200).json({ decrypted: decrypted.toString() });
    } catch (error) {
        console.error('Erro ao descriptografar a mensagem:', error);
        res.status(500).send('Erro ao descriptografar a mensagem.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
