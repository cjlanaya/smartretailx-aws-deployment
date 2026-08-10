require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const { initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Swagger docs
const swaggerDoc = YAML.load('./src/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-service', timestamp: new Date() });
});

// Start server after DB is ready
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });
}).catch(err => {
  console.error('Failed to connect to DB:', err);
  process.exit(1);
});
