import Ajv from 'ajv'
import addFormats from 'ajv-formats'

import NewEvent from './schemas/new-event.json' assert { type: 'json' }

const ajv = new Ajv({
  allErrors: true,
  strict: true,
  schemas: [
    NewEvent
  ]
})

addFormats(ajv)
const _validateNewEvent = ajv.compile(NewEvent)

// Normally I'd use fp-ts/Either here and return the valid object (E.Right) or an error object with a list of validation failures (E.Left)
// However, since this is just a quick excercise and I am not using TypeScript, I'll just return the errors as an array of strings
export const validateNewEvent = (data) => {
  const valid = _validateNewEvent(data)
  if (!valid) {
    return _validateNewEvent.errors.map((e) => e.message)
  }
}
