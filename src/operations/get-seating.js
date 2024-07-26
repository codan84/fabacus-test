import R from '../io/redis.js'

export const getSeating = async (eventId) => {
  const event = await R.readEvent(eventId)
  const holds = await R.getAllHeldSeats(eventId)

  if (event) {
    return event.availableSeats.map(seat => ({
      id: seat,
      available: holds.includes(seat) ? false : true
    }))
  }
  return { error: 'Event not found' }
}
