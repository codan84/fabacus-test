import express from 'express'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'

import { schema } from './schemas/api.js'
import { createEvent } from './operations/create-event.js'
import { getEvent } from './operations/get-event.js'

const app = express()
app.use(bodyParser.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(schema))

app.get('/event', (req, res) => {
  return []
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

const server = app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

process.once('SIGTERM', () => {
  server.close()
})
