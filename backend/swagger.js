const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Dokumentacija',
      version: '1.0.0',
    },
  },
  apis: ['./routes/proizvodi.js', './routes/user.js'],  
};

const swaggerSpec = require('swagger-jsdoc')(options);

module.exports = swaggerSpec;
