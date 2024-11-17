const express = require('express');
const cors = require('cors');
const passport = require('passport')
const UserRouter = require('./app/routers/userRouters');
const APIRouter = require('./app/routers/APIRouters');
const ItineraryRouter = require('./app/routers/ItineraryRouters')
const authenticationMiddleware = require('./app/middlewares/authMiddleware')

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
app.use('/api', APIRouter);
app.use('/itinerary', ItineraryRouter);

passport.use('jwt', authenticationMiddleware.jwtStrategy);
app.use('/userpage', authenticationMiddleware.authenticateRequest, (req, res) => {
  res.json({ message: 'You have access to the protected route' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
