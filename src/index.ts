import express, { json, urlencoded } from 'express'
import authRouter from './routes/auth'
import cookieParser from 'cookie-parser'

const app = express()

const port = 3000


app.use(urlencoded({ extended: false }))
app.use(json())
app.use(cookieParser())
app.get('/api/v1/', (req, res) => {
  res.send('Hello World!')
  console.log(req.cookies.token)
})

app.use('/api/v1/auth', authRouter)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})