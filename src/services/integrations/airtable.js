const airtable = require('airtable')

const bulkActionRecordsLimit = 10
const bulkActionChunkDelay = 1000 // In milliseconds.
const base = baseInit()

function baseInit() {
  return new airtable({ apiKey: process.env.AIRTABLE_API_KEY })
    .base(process.env.AIRTABLE_BASE_ID)
}

async function createRecord(table, data) {
  if (!isBulkActionRecordsAboveLimit(data)) {
    return await base(table).create(data)
  }

  const chunks = bulkActionRecordsChunks(data)

  for (let i = 0; i < chunks.length; i++) {
    await base(table).create(chunks[i])

    if (chunks[i + 1]) {
      await setBulkActionChunkDelay()
    }
  }
}

function bulkActionRecordsChunks(array) {
  const chunks = []
  const chunkSize = bulkActionRecordsLimit < 1 ? 1 : bulkActionRecordsLimit

  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }

  return chunks
}

function isBulkActionRecordsAboveLimit(data) {
  return Array.isArray(data) && data.length > bulkActionRecordsLimit
}

function setBulkActionChunkDelay() {
  return new Promise(resolve => {
    setTimeout(resolve, bulkActionChunkDelay)
  })
}

module.exports = {
  createRecord
}
