import Event from './event.json' assert { type: 'json' }
import NewEvent from './new-event.json' assert { type: 'json' }

export const schema = {
  openapi: '3.1.0',
  info: {
    title: 'Events API',
    version: '1.0.0',
    description:
      'Service to manage everything related to Events and available seating'
  },
  paths: {
    '/event': {
      get: {
        description: 'Returns a list of all available event IDs',
        operationId: 'getEvents',
        responses: {
          200: {
            description: 'Successfully returned list of events',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      },
      put: {
        description: 'Creates a new event',
        operationId: 'createEvent',
        parameters: [
          {
            name: 'newEvent',
            in: 'body',
            required: true,
            schema: {
              $ref: '#/components/schemas/NewEvent'
            }
          }
        ],
        responses: {
          201: {
            description: 'Returns details about newly created event and available seating',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Event'
                }
              }
            }
          }
        }
      }
    },
    '/event/{eventId}': {
      get: {
        description: 'Returns details about a specific event',
        operationId: 'getEventDetailsById',
        parameters: [
          {
            name: 'eventId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid'
            }
          }
        ],
        responses: {
          200: {
            description: 'Successfully returned event details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Event'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      NewEvent,
      Event
    }
  }
}
