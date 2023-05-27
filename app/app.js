const express = require('express')
const app = express()
const http = require('http').Server(app)
const port = process.env.PORT || 5000
const host = require('ip').address();
const morgan = require('morgan')
const cors = require('cors')
const io = require('./socket').connection(http)

app.use(cors())
app.use(express.urlencoded({ extended: false, limit: (52428800) }))
app.use(morgan('dev'))

//routes
app.use('/', require('./routes/index.route'))

http.listen(port, host, (error) => {
    if (error) {
        console.log(`An error has occurred: ${error}`)
    } else {
        console.log(`Server is running on http://${host}:${port}`)
    }
});