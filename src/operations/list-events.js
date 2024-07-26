import DB from '../io/redis.js'

export const listEvents = async () => {
  return await DB.listEvents()
}
