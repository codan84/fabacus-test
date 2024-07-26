import R from '../io/redis.js'

export const holdSeat = async (eventId, seatId, userId) => {
  return await R.holdSeat(eventId, seatId, userId)
}
