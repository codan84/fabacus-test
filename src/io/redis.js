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
  const response = await client.HSETNX(`event::${eventId}::unavailable_seats`, seatId, `${userId}::hold`)
  if (response) {
    await client.sendCommand(['HEXPIRE', `event::${eventId}::unavailable_seats`, `${SEAT_HOLD_TTL_SECONDS}`, 'FIELDS', '1', seatId])
    return
  } else {
    return { error: 'Seat already booked', type: 'seat_unavailable' }
  }
}

export const getAllHeldSeats = async (eventId) => {
  await ensureClientConnected()
  return await client.HKEYS(`event::${eventId}::unavailable_seats`)
}

export const getUserIdForSeat = async (eventId, seatId) => {
  await ensureClientConnected()
  const response = await client.HGET(`event::${eventId}::unavailable_seats`, seatId)
  if (response) {
    return response.split('::')[0]
  }
  return null
}

export const getSeatAvailabilityStatus = async (eventId, seatId) => {
  await ensureClientConnected()
  const response = await client.HGET(`event::${eventId}::unavailable_seats`, seatId)
  if (response) {
    return response.split('::')[1]
  }
  return null
}

export const bookSeat = async (eventId, seatId, userId) => {
  await ensureClientConnected()
  await client.HSET(`event::${eventId}::unavailable_seats`, seatId, `${userId}::book`)
  // Booked seat doesn't expire
  await client.sendCommand(['HPERSIST', `event::${eventId}::unavailable_seats`, 'FIELDS', '1', seatId])
}

export default {
  saveEvent,
  readEvent,
  listEvents,
  holdSeat,
  getAllHeldSeats,
  getUserIdForSeat,
  bookSeat,
  getSeatAvailabilityStatus
}
