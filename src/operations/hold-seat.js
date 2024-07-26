import R from '../io/redis.js'

export const holdSeat = async (eventId, seatId, userId) => {
  const event = await R.readEvent(eventId)
  if (!event) {
    return { error: 'Event not found', type: 'resource_not_found' }
  }
  if(!event.availableSeats.includes(seatId)) {
    return { error: 'Seat not found', type: 'resource_not_found' }
  }
  return await R.holdSeat(eventId, seatId, userId)
}
