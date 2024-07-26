import R from '../io/redis.js'

const isSeatHeldByUser = async (eventId, seatId, userId) => {
  const userIdForSeat = await R.getUserIdForSeat(eventId, seatId)

  if (userIdForSeat === userId) {
    return true
  }
}

export const bookSeat = async (eventId, seatId, userId) => {
  const event = await R.readEvent(eventId)
  if (!event) {
    return { error: 'Event not found', type: 'resource_not_found' }
  }
  if(!event.availableSeats.includes(seatId)) {
    return { error: 'Seat not found', type: 'resource_not_found' }
  }
  if (!await isSeatHeldByUser(eventId, seatId, userId)) {
    return { error: 'Seat not held by user', type: 'seat_unavailable' }
  }
  if ((await R.getSeatAvailabilityStatus(eventId, seatId)) === 'book') {
    return { error: 'Seat already booked', type: 'seat_unavailable' }
  }
  await R.bookSeat(eventId, seatId, userId)
}
