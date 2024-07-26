import Event from './event.json' assert { type: 'json' }
import NewEvent from './new-event.json' assert { type: 'json' }
import SeatAvailability from './seat-availability.json' assert { type: 'json' }

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
    },
    '/event/{eventId}/seating': {
      get: {
        description: 'Returns all seating for a specific event',
        operationId: 'getEventSeatingById',
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
            description: 'Successfully returned event seating',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    schema: {
                      $ref: '#/components/schemas/SeatAvailability'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/event/{eventId}/seating/{seatId}/hold/{userId}': {
      post: {
        description: 'Hold a specific seat for a specific event',
        operationId: 'holdSeat',
        parameters: [
          {
            name: 'eventId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid'
            }
          },
          {
            name: 'seatId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Successfully held seat'
          },
          404: {
            description: 'Seat or event not found'
          },
          409: {
            description: 'Seat held or booked by another user'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      NewEvent,
      Event,
      SeatAvailability
    }
  }
}
