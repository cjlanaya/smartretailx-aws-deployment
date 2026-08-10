require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const inventoryRoutes = require('./routes/inventory');
const { initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

const swaggerDoc = YAML.load('./src/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('/api/v1/inventory', inventoryRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'inventory-service', timestamp: new Date() });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Inventory Service running on port ${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });
}).catch(err => {
  console.error('Failed to connect to DB:', err);
  process.exit(1);
});
