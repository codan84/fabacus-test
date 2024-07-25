import { v4 as uuidv4 } from 'uuid'
import { split, times, add, map, chain, take } from 'ramda'

import { validateNewEvent } from '../validate.js'
import { saveEvent } from '../io/redis.js'

// ========================================================
// For the sake of the excercise I will generate some "seat numbers" for the event
// irl I presume that'd be predetermined for each venue etc

const seatsInRow = 40
const rows = split('', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')
const seatNumbers = times(add(1), seatsInRow)

const generateSeatsForRow = letter => map(n => `${letter}${n}`, seatNumbers)
const allSeats = chain(generateSeatsForRow, rows)
// ========================================================

// Again, as with validation, this would normally be an fp-ts/Either response type,
// with any potentiall errors returned as `E.Left` or the newly created event as `E.Right`
// But for the sake of the excercise I'll just return the event or an object with an `error` property
export const createEvent = async (newEvent) => {
  const errors = validateNewEvent(newEvent)
  if (errors && errors.length > 0) {
    return { error: errors }
  }

  const event = {
    ...newEvent,
    id: uuidv4(),
    availableSeats: take(newEvent.availableSeatsCount, allSeats)
  }

  await saveEvent(event)

  return event
}
