const express = require('express')
const multer = require('multer')
const path = require('path')
const ws = require('ws')
const app = express()

var selected = false 

const server = app.listen(7978, () => {
  console.log('App available on port: 7978')
})

const wss = new ws.Server({ noServer: true })

const storageEngine = multer.diskStorage({
  destination: './static/images/',
  filename: (_req, _file, cb) => {
      cb(null, selected ? 'image.png' : 'image2.png')
  },
})

const upload = multer({
  storage: storageEngine,
})

app.use(express.static('./static/images/'))
app.use(express.static('./static/js/'))

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, './templates/index.html'))
})

app.post('/setImage', upload.single('image'), (req, res) => {
  if (req.file) {
    selected = !selected
    let selString = selected.toString()
    wss.clients.forEach((client) => {
        client.send(selString)
    })

    res.send('File uploaded successfully')
  } else {
    res.status(400).send('Not an image')
  }
})

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request)
  })
})
