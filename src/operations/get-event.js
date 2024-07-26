import R from '../io/redis.js'

export const getEvent = async (eventId) => {
  return await R.readEvent(eventId)
}
