const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const port = 5000;


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('API radi! Idi na /api-docs za Swagger ili /api/proizvodi za proizvode.');
});


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const proizvodiRoutes = require('./routes/proizvodi');
app.use('/api/proizvodi', proizvodiRoutes);

const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);




app.get('/api/podaci', (req, res) => {
  res.json([
    { id: 1, naziv: 'Prvi podatak' },
    { id: 2, naziv: 'Drugi podatak' },
    { id: 3, naziv: 'Treći podatak' }
  ]);
});


app.listen(port, () => {
  console.log(`Server radi na http://localhost:${port}`);
  console.log(`Swagger dokumentacija dostupna na http://localhost:${port}/api-docs`);
});

