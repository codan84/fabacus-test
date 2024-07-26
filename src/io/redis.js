import { createClient } from 'redis'

const SEAT_HOLD_TTL_SECONDS = parseInt(process.env.SEAT_HOLD_TTL_SECONDS, 10) || 60

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
  const events = await client.SMEMBERS('events')
  return events
}

export const holdSeat = async (eventId, seatId, userId) => {
  await ensureClientConnected()
  const event = await readEvent(eventId)
  console.log(event)
  if (event && event.availableSeats.includes(seatId)) {
    const response = await client.HSETNX(`event::${eventId}::holds`, seatId, userId)
    if (response) {
      await client.sendCommand(['HEXPIRE', `event::${eventId}::holds`, `${SEAT_HOLD_TTL_SECONDS}`, 'FIELDS', '1', seatId])
      return
    }
    return { error: 'Seat is already held', type: 'seat_unavailable' }
  }
  return { error: 'Seat or event does not exist', type: 'resource_not_found' }
}

export const getAllHeldSeats = async (eventId) => {
  await ensureClientConnected()
  return await client.HKEYS(`event::${eventId}::holds`)
}

export default {
  saveEvent,
  readEvent,
  listEvents,
  holdSeat,
  getAllHeldSeats
}
