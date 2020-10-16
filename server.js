const express = require('express')
const app = express()
const https = require('https')
const fs = require('fs')
const port = 8000

app.get('/', (req, res) => {
    app.use(express.static('static'))
    res.sendFile('C:/Users/Клярский/Desktop/backend/index3.html');
})

const httpsOptions = {
    key: fs.readFileSync('./security/cert.key'),
    cert: fs.readFileSync('./security/cert.pem')
}
const server = https.createServer(httpsOptions, app)
    .listen(port, () => {
        console.log('server running at ' + port)
    })