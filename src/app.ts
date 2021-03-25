const StreamArray = require('stream-json/streamers/StreamArray')
import { Writable } from 'stream'
import * as fs from 'fs'

import ElaDIDBlock from './model/block'

if (process.argv.length < 3) {
  console.info(
    'This script expects a JSON string or filepath as its only input arg'
  )
  process.exit(-1)
}

/*
 ***********************************************************************************************
 * Check to ensure ENV vars are set
 ***********************************************************************************************
 */
if (!process.env.ELASTOS_DID_RPC) {
  console.info('This script requires ENV var ELASTOS_DID_RPC')
  process.exit(-1)
}

new Promise((resolve) => {
  // if it's a string passed, just parse it and shortcut
  if (process.argv[2].substring(0, 1) === '[') {
    // this is a passed in JSON string
    resolve(JSON.parse(process.argv[2]))
    return
  }

  // this is required to handle large JSON files (over 2.5mb breaks a regular require)
  if (fs.existsSync(process.argv[2])) {
    const jsonData = []
    const filePath = process.argv[2]

    const fileStream = fs.createReadStream(filePath)
    const jsonStream = StreamArray.withParser()

    const processingStream = new Writable({
      write({ key, value }, encoding, callback) {
        setTimeout(() => {
          jsonData.push(value)
          callback()
        }, 50)
      },
      //Don't skip this, as we need to operate with objects, not buffers
      objectMode: true,
    })

    //Pipe the streams as follows
    fileStream.pipe(jsonStream.input)
    jsonStream.pipe(processingStream)

    processingStream.on('finish', () => {
      resolve(jsonData)
    })
    return
  }

  throw new Error(`file: ${process.argv[2]} not found`)
})
  .then(async (jsonData: Array<any>) => {
    // console.log(jsonData)

    const finalBlocks = []

    for (let i = 0, numBlocks = jsonData.length; i < numBlocks; i++) {
      // this is a bit misleading, output also does an external call out to the RPC port to get the outputs that led to each input
      finalBlocks.push(await new ElaDIDBlock(jsonData[i]).output())
    }

    console.log(
      JSON.stringify(
        finalBlocks,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
        2
      )
    )
  })
  .catch((err) => {
    console.error(err)

    process.exit(0)
  })
