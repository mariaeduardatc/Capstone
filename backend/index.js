const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const OpenAI = require('openai');
const { TRIP_PROMPT } = require('./app/utils/constants');
const UserRouter = require('./app/routers/userRouters');
const APIRouter = require('./app/routers/APIRouters');

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST',
    credentials: true
}));

app.use('/user', UserRouter);

app.use('/api/maps', APIRouter);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/itinerary', async (req, res) => {
  const { city, duration } = req.body; 
  const tripPrompt = TRIP_PROMPT
        .replace("{city}", city)
        .replace("{numberDays}", duration);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: tripPrompt,
        },
      ],
    });

    const itinerary = completion.choices[0].message.content;
    res.json({ itinerary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
