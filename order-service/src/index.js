require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const orderRoutes = require('./routes/orders');
const { initDB } = require('./db');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3003;

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later' }
});

app.use('/api/', limiter);

const swaggerDoc = YAML.load('./src/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('/api/v1/orders', orderRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'order-service', timestamp: new Date() });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });
}).catch(err => {
  console.error('Failed to connect to DB:', err);
  process.exit(1);
});
