const fs = require('fs')
const split = require('split')
const GriveUploader = require('./index')

const up = GriveUploader({
  client_id: process.env.GOOGLEAUTH_CLIENT,
  client_secret: process.env.GOOGLEAUTH_SECRET,
  refresh_token: process.env.REFRESH_TOKEN,
  drive_folder_id: process.env.DRIVE_FOLDER_ID
})

fs.createReadStream('/input.csv') // read the csv file
  .pipe(split()) // split the content into lines
  .pipe(up) // for each lines, upload to google drive
  .on('finish', process.exit)
