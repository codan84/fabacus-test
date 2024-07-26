import express from 'express'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'

import { schema } from './schemas/api.js'
import { createEvent } from './operations/create-event.js'
import { getEvent } from './operations/get-event.js'
import { listEvents } from './operations/list-events.js'
import { getSeating } from './operations/get-seating.js'
import { holdSeat } from './operations/hold-seat.js'

const app = express()
app.use(bodyParser.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(schema))

app.get('/event', async (req, res) => {
  const events = await listEvents()
  return res.status(200).json(events)
})

app.put('/event', async (req, res) => {
  const result = await createEvent(req.body)
  if (result.error) {
    return res.status(400).json(result)
  }
  return res.status(201).json(result)
})

app.get('/event/:eventId', async (req, res) => {
  const event = await getEvent(req.params.eventId)
  if (event) {
    return res.status(200).json(event)
  }
  return res.status(404).json({ error: 'Event not found' })
})

app.get('/event/:eventId/seating', async (req, res) => {
  const seating = await getSeating(req.params.eventId)
  if (seating.error) {
    return res.status(404).json({ error: seating.error })
  }
  return res.status(200).json(seating)
})

app.post('/event/:eventId/seating/:seatId/hold/:userId', async (req, res) => {
  const eventId = req.params.eventId
  const seatId = req.params.seatId
  const userId = req.params.userId

  const result = await holdSeat(eventId, seatId, userId)
  if (result && result.error) {
    if (result.type === 'resource_not_found') {
      return res.status(404).send()
    }
    if (result.type === 'seat_unavailable') {
      return res.status(409).send()
    }
    return res.status(400).send()
  }
  return res.status(200).send()
})

const server = app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

process.once('SIGTERM', () => {
  server.close()
})
