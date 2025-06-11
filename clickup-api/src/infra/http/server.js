import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import YAML from 'yamljs';
import { ApplicationError } from '../../core/errors/ApplicationError.js';

export function startServer(port, routes) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const swaggerDocument = YAML.load('./openapi.yaml');
  const swaggerUiOptions = {
    customSiteTitle: "ClickUp - API",
    docExpansion: 'none',
  };

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

  if (routes?.taskRouter) {
    app.use('/api/tasks', routes.taskRouter);
  }

  if (routes?.storageRouter) {
    app.use('/api/storage', routes.storageRouter);
  }

  // Tratamento de erros 
  app.use((error, req, res, next) => {
    console.error("ERRO:", error.message);

    if (error instanceof ApplicationError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Ocorreu um erro interno inesperado no servidor."
    });
  });

  app.listen(port, () => {
    console.log(`🚀 API Server rodando em http://localhost:${port}`);
    console.log(`📄 Documentação Swagger disponível em http://localhost:${port}/api-docs`);
  });

  return app;
}
