import { createClient } from 'redis'

let client

const ensureClientConnected = async () => {
  if (!client) {
    client = await createClient({ url: 'redis://redis:6379' })
      .on('error', err => console.log('Redis Client Error', err))
      .connect()
  }
}

export const saveEvent = async (event) => {
  await ensureClientConnected()
  await client
          .multi()
          .json.set(`event::${event.id}`, '$', event)
          .sAdd('events', event.id)
          .exec()
}

export const readEvent = async (eventId) => {
  await ensureClientConnected()
  return await client.json.get(`event::${eventId}`)
}

export const listEvents = async () => {
  await ensureClientConnected()
  const events = await client.sMembers('events')
  return events
}

export default {
  saveEvent,
  readEvent,
  listEvents
}
