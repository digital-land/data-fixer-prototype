const Ajv = require('ajv')
const csv = require('csvtojson')
const fs = require('fs')
const jsoncsv = require('json-2-csv')

const ajv = new Ajv({
  coerceTypes: true
})

async function validate () {
  const json = await csv().fromFile('./concat.csv')
  const compiled = ajv.compile(require('./schema.json'))

  const parsedByRow = json.map(function (row) {
    const validated = compiled(row)

    row.validator = {
      isRowValid: validated,
      rowErrors: compiled.errors || []
    }

    return row
  })

  const conv = await jsoncsv.json2csvAsync(parsedByRow, { emptyFieldValue: '' })
  return fs.writeFileSync('./validated.csv', conv, 'utf8')
}

validate()
