import React, { Component } from "react"
import logo from "./logo.svg"
import "./App.css"

class App extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p>¡Felicitaciones! Tu aplicación funciona bien</p>
					<a
						className="App-link"
						href="https://platzi.com/cursos/react/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Aprendé React.js
					</a>
					<a
						className="App-link"
						href="https://platzi.com/cursos/express-js/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Aprendé Express.js
					</a>
					<a
						className="App-link"
						href="https://developer.ibm.com/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Visitá IBM Developer
					</a>
				</header>
			</div>
		)
	}
}

export default App
