# Gemini API Server

Простой и мощный Node.js сервер для работы с Google Generative AI. Поддерживает одиночные запросы и чат с историей сообщений.

## Описание

Сервер предоставляет два POST эндпоинта:
- <code>/api/gemini/single</code> — для генерации текста по одному промпту.
- <code>/api/gemini/chat</code> — для генерации текста с учетом истории сообщений.

## Установка

1. Склонируйте репозиторий:
   <code>git clone <repository-url></code>
   <code>cd <repository-directory></code>

2. Установите зависимости:
   <code>npm install</code>

3. Настройте переменные окружения:
   Создайте файл <code>.env</code> в корневой директории:
   <code>PORT=3000</code>
   Порт можно изменить по желанию.

4. Запустите сервер:
   <code>node index.js</code>
   Сервер будет доступен на <code>http://localhost:3000</code>.

## API Инструкция

### 1. POST /api/gemini/single

Генерация текста по одиночному промпту.

**Тело запроса:**

- <code>apiKey</code> (string, обязательно): Ваш API ключ Google Generative AI.
- <code>prompt</code> (string, обязательно): Промпт для генерации текста.
- <code>model</code> (string, опционально): Модель для использования. По умолчанию "gemini-2.0-flash".

**Пример запроса:**

<code>curl -X POST http://localhost:3000/api/gemini/single \
-H "Content-Type: application/json" \
-d '{
  "apiKey": "YOUR_API_KEY",
  "prompt": "Привет, как дела?",
  "model": "gemini-2.0-flash"
}'</code>

**Ответ:**

- <code>200 OK</code>: JSON с сгенерированным текстом.
  <code>{
    "text": "Привет! У меня все отлично, спасибо!"
  }</code>

### 2. POST /api/gemini/chat

Генерация текста с учетом истории сообщений.

**Тело запроса:**

- <code>apiKey</code> (string, обязательно): Ваш API ключ Google Generative AI.
- <code>message</code> (string, обязательно): Новое сообщение пользователя.
- <code>history</code> (array, опционально): История сообщений в формате массива объектов:
  - <code>role</code> (string): "Пользователь" или "Ассистент".
  - <code>content</code> (string): Текст сообщения.
- <code>model</code> (string, опционально): Модель для использования. По умолчанию "gemini-2.0-flash".

**Пример запроса:**

<code>curl -X POST http://localhost:3000/api/gemini/chat \
-H "Content-Type: application/json" \
-d '{
  "apiKey": "YOUR_API_KEY",
  "message": "А как у тебя дела?",
  "history": [
    {"role": "Пользователь", "content": "Привет, как дела?"},
    {"role": "Ассистент", "content": "Привет! У меня все отлично, спасибо!"}
  ],
  "model": "gemini-2.0-flash"
}'</code>

**Ответ:**

- <code>200 OK</code>: JSON с сгенерированным текстом.
  <code>{
    "text": "У меня все хорошо, а у тебя как?"
  }</code>

### Ошибки (для обоих эндпоинтов)

- <code>400 Bad Request</code>: Некорректный запрос.
  <code>{
    "error": "apiKey и prompt/message должны быть непустыми строками"
  }</code>
  или
  <code>{
    "error": "history должен быть массивом"
  }</code>
  или
  <code>{
    "error": "Каждый элемент истории должен иметь role и content типа string"
  }</code>

- <code>400 Bad Request</code>: Проблемы с API ключом или моделью.
  <code>{
    "error": "Недействительный API ключ"
  }</code>
  или
  <code>{
    "error": "Недействительная модель"
  }</code>

- <code>500 Internal Server Error</code>: Непредвиденная ошибка.
  <code>{
    "error": "Произошла непредвиденная ошибка"
  }</code>

## Заметки

- **История сообщений**: Клиент должен сам управлять массивом <code>history</code>, добавляя в него предыдущие сообщения. Сервер не хранит состояние.