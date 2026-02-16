const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'API for managing users',
    },
    // 1. DATA MODELS (SCHEMAS)
    components: {
      schemas: {
        UserInput: {
          type: 'object',
          required: ['email', 'name'],
          properties: {
            email: { type: 'string', format: 'email', example: 'js@test.com' },
            name: { type: 'string', example: 'JS Dev' }
          }
        },
        UserResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string' },
            name: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    // 2. API ROUTES (PATHS) - Defined in JS to avoid indentation errors
    paths: {
      '/api/users': {
        post: {
          summary: 'Create a new user',
          tags: ['Users'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserInput' }
              }
            }
          },
          responses: {
            201: {
              description: 'Created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UserResponse' }
                }
              }
            }
          }
        },
        get: {
          summary: 'Get all users',
          tags: ['Users'],
          responses: {
            200: {
              description: 'List of users',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/UserResponse' }
                  }
                }
              }
            }
          }
        }
      },
      '/api/users/{id}': {
        get: {
          summary: 'Get user by ID',
          tags: ['Users'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: { type: 'string', format: 'uuid' },
              required: true,
              description: 'The user ID'
            }
          ],
          responses: {
            200: {
              description: 'User found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UserResponse' }
                }
              }
            },
            404: { description: 'User not found' }
          }
        }
      }
    }
  },
  // We don't need to scan files anymore because we defined everything above
  apis: [] 
};

module.exports = swaggerJsdoc(options);