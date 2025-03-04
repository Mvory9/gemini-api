import { GoogleGenerativeAI } from '@google/generative-ai';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Gemini API Server is running');
});

app.post('/api/gemini/single', async (req, res) => {
    try {
        const { apiKey, prompt, model = 'gemini-2.0-flash' } = req.body || {};

        if (!apiKey || !prompt || typeof apiKey !== 'string' || typeof prompt !== 'string' || apiKey.trim() === '' || prompt.trim() === '') {
            return res.status(400).json({ error: 'apiKey и prompt должны быть непустыми строками' });
        }

        console.log(`Одиночный запрос: модель: ${model}, промпт: ${prompt.substring(0, 50)}...`);

        const genAI = new GoogleGenerativeAI(apiKey);
        const selectedModel = genAI.getGenerativeModel({ model });
        const result = await selectedModel.generateContent([prompt]);
        const text = result.response.text();

        console.log(`Ответ: ${text.substring(0, 50)}...`);
        res.status(200).json({ text });
    } catch (error) {
        console.error('Ошибка в /api/gemini/single:', error);
        handleError(res, error);
    }
});

app.post('/api/gemini/chat', async (req, res) => {
    try {
        const { apiKey, message, history = [], model = 'gemini-2.0-flash' } = req.body || {};

        if (!apiKey || !message || typeof apiKey !== 'string' || typeof message !== 'string' || apiKey.trim() === '' || message.trim() === '') {
            return res.status(400).json({ error: 'apiKey и message должны быть непустыми строками' });
        }
        if (!Array.isArray(history)) {
            return res.status(400).json({ error: 'history должен быть массивом' });
        }

        console.log(`Чат-запрос: сообщение: ${message.substring(0, 50)}..., история: ${history.length} сообщений`);

        const formattedHistory = history.map(item => {
            if (!item.role || !item.content || typeof item.role !== 'string' || typeof item.content !== 'string') {
                throw new Error('Каждый элемент истории должен иметь role и content типа string');
            }
            return `${item.role}: ${item.content}`;
        }).join('\n');

        const fullPrompt = formattedHistory ? `${formattedHistory}\nПользователь: ${message}` : `Пользователь: ${message}`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const selectedModel = genAI.getGenerativeModel({ model });
        const result = await selectedModel.generateContent([fullPrompt]);
        const text = result.response.text();

        console.log(`Ответ: ${text.substring(0, 50)}...`);
        res.status(200).json({ text });
    } catch (error) {
        console.error('Ошибка в /api/gemini/chat:', error);
        handleError(res, error);
    }
});

function handleError(res, error) {
    if (error.message.includes('API key')) {
        res.status(400).json({ error: 'Недействительный API ключ' });
    } else if (error.message.includes('model')) {
        res.status(400).json({ error: 'Недействительная модель' });
    } else if (error.message.includes('history')) {
        res.status(400).json({ error: error.message });
    } else {
        res.status(500).json({ error: 'Произошла непредвиденная ошибка' });
    }
}

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});