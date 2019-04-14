const got = require('got')
const cliProgress = require('cli-progress')
const through2 = require('through2')
const url = require('url')
const bar = new cliProgress.Bar({}, cliProgress.Presets.shades_classic)
const headers = {
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
}

function logThenNext(err, currentLine, next) {
  if (err) {
    console.log(`ERR : ${currentLine.toString()}`)
  }
  next()
}

module.exports = ({
  client_id,
  client_secret,
  refresh_token,
  drive_folder_id
}) => {
  const blobs = require('google-drive-blobs')({
    client_id,
    client_secret,
    refresh_token
  })

  return through2((line, enc, next) => {
    const [remote, size] = line.toString().split(',')
    console.log(`\nuploading ${remote}`)
    const filename = url
      .parse(remote)
      .pathname.split('/')
      .pop()

    const upload = blobs.createWriteStream(
      {
        filename,
        parent: drive_folder_id
      },
      err => logThenNext(err, line, next)
    )

    const download = got.stream(remote, {
      headers: headers
    })

    bar.start(100, 0)

    return download
      .on('error', err => logThenNext(err, line, next))
      .on('downloadProgress', progress => {
        bar.update(progress.percent * 100)
      })
      .pipe(upload)
  })
}
