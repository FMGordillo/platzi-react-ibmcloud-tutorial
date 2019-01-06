/**
 * @author Facundo Martin Gordillo <facundomgordillo@gmail.com>
 * @license See LICENSE.md
 */

// Curso de Express.js => https://platzi.com/cursos/express-js/
const express = require("express")
const http = require("http")
const path = require("path")
const app = express()

app.use(express.static(path.join(__dirname, "build")))

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"))
})

const server = http.createServer(app)
const PORT = process.env.PORT || 3000

server.listen(PORT)
server.on("listening", () => {
	console.log(`Servidor escuchando en el puerto: ${PORT}`)
})
