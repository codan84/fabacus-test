import { readEvent } from '../io/redis.js'

export const getEvent = async (eventId) => {
  return await readEvent(eventId)
}
