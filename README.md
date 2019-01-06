# Índice

- [**`Requisitos previos`**]("requisitos-previos")
- [**`Paso 1`**]("paso-1-create-it")
- [**`Paso 2`**]("paso-2-build-it")
- [**`Paso 3`**]("paso-3-deploy-it")
- [**`FAQ`**]("faq")

# Requisitos previos

- Una cuenta en [**`IBM Cloud`**](https://cloud.ibm.com/registration/)
- [**`IBM Cloud CLI`**](https://console.bluemix.net/docs/cli/reference/ibmcloud/download_cli.html#install_use)
- [**`Node.js`**](https://nodejs.org/en/) >= v8.10.0 `(*)`
- (Opcional) [**`Yarn`**](https://yarnpkg.com/)

`(*)` Recomendado para probar localmente; no es necesario para deployar a IBM Cloud

# Paso 1 - Create it

Empecemos sin dolores de cabeza: con [**`create-react-app`**](https://github.com/facebook/create-react-app):

```
$ npx create-react-app platzi-react-ibmcloud
```

En caso de que tengas `npm <= 5.2` probá con esto:

```
$ npm i -g create-react-app
$ create-react-app platzi-react-ibmcloud
```

También vamos a necesitar [**`express`**](https://github.com/expressjs/express) para este proceso.

```
$ npm i -S express
```

Y para consumir menos memoria en IBM Cloud, necesitaremos un paquete más... Ya vas a ver por qué

```
$ yarn add if-env
o
$ npm i if-env
```

# Paso 2 - Build it

Tenemos que crear un archivo para que se encargue del "lado de servidor `(*)`" que React no se ocupa (yo lo llamé **`server.js`** pero, hey, es un mundo libre, nombralo como quieras). Después, modificar el **`package.json`** (a ese no le podemos cambiar el nombre, _sorry_) y agregarle el comando que deployará hacia IBM Cloud.

**`server.js`**

```javascript
const express = require("express")
const http = require("http")
const path = require("path")
const app = express()

app.use(express.static(path.join(__dirname, "build")))

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"))
})

const server = http.createServer(app)
const PORT = process.env.port || 3000

server.listen(PORT)
server.on("listening", () => {
	console.log(`Servidor escuchando en el puerto: ${PORT}`)
})
```

¿Te acordás de `if-env` que te dije de instalar? Bueno, acá lo usamos:

**`package.json`**

```diff
{
	"name": "platzi-react-ibmcloud",
	"version": "0.1.0",
	"private": true,
	"dependencies": {
		"express": "^4.16.4",
		"if-env": "^1.0.4",
		"react": "^16.7.0",
		"react-dom": "^16.7.0",
		"react-scripts": "2.1.3"
	},
	"scripts": {
		"start": "react-scripts start",
		"build": "react-scripts build",
+		"postinstall": "if-env NODE_ENV=production && npm run build || echo Avoiding post install",
+		"deploy": "npm run build && node index.js",
		"test": "react-scripts test",
		"eject": "react-scripts eject"
	},
	"eslintConfig": {
		"extends": "react-app"
	},
	"browserslist": [
		">0.2%",
		"not dead",
		"not ie <= 11",
		"not op_mini all"
	]
}
```

¡Y probá si funciona!

```
$ npm run build
$ npm run deploy
or
$ yarn build
$ yarn deploy
```

Y si no funciona, cloná este repositorio `¯\_(ツ)\_/¯`

`(*)` Si querés aprender más de Express.js [hay un curso en Platzi](https://platzi.com/clases/express-js/)

# Paso 3 - Push it!

Primero debemos iniciar sesión con `ibmcloud login`. **Recomiendo** que antes entren en su explorador a [**`IBM Cloud`**](https://cloud.ibm.com) e inicien sesión antes de ejecutar estos comandos.

```
$ ibmcloud login
API endpount: https://api.ng.bluemix.net	// Recomendado

Email>
Password>					// No aparece nada a proposito
Authenticating...
OK

$ ibmcloud target --cf
Targeted Cloud Foundry (https://api.ng.bluemix.net)
Targeted org <tu-mail>
Targeted space dev
```

Y ahora estamos listos para hacer deploy de nuestra aplicación. Acá hay dos maneras:

## Opción #1 (Recomendada)

Crear un archivo **`manifest.yml`** en el cual especificaremos todos los detalles para que IBM Cloud entienda qué le estamos dando:

**`manifest.yml`**

```yml
---
applications:
  - name: platzi-react-ibmcloud
    memory: 256M
    command: npm run deploy
```

También vamos a crear un **`.cfignore`** (similar a `.gitignore`) para que no se pusheen nuestras dependencias a Cloud.

**`.cfignore`**

```
node_modules
build
```

¡Y ahora por fin!

```
ibmcloud app push
```

Este comand busca un archivo `manifest.yml` en el directorio. Y si lo encuentra, lo lee y procede a subir nuestros archivos y compilarlos hacia Cloud.

## Opción #2 ("_Rápida_")

```
ibmcloud app push <nombre-de-app>
```

Tengan paciencia, y esperen a un mensaje así (como mucho, tarda 5 minutos):

```
name:              platzi-react-ibmcloud
requested state:   started
instances:         1/1
usage:             128M x 1 instances
routes:            platzi-react-ibmcloud.mybluemix.net
last uploaded:     Sun 06 Jan 03:23:57 -03 2019
stack:             cflinuxfs2
buildpack:         SDK for Node.js(TM) (ibm-node.js-6.14.4, buildpack-v3.24-20181128-1339)
start command:     npm run deploy

     state     since                  cpu    memory      disk      details
#0   running   2019-01-06T06:26:19Z   0.0%   0 of 128M   0 of 1G
```

Si no aparece, bueno... Cloná el repositorio y reintentalo con otro nombre, o creá un Issue.

# FAQ

## "¿Es necesario un tutorial para esto?"

Obvio que hay muchas guias ya hechas ([acá](https://dev.to/loujaybee/using-create-react-app-with-express) hay una, [acá](https://medium.freecodecamp.org/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0) otra...) pero esta es **una solución** que quise compartirles. Son libres de probras otras, según a gusto de cada uno, o jugar con algún framework que les ayude mejor (como [Next.js](https://nextjs.org/), [GatsbyJS](https://www.gatsbyjs.org/), etc.)

## "En now.sh o Heroku puedo hacerlo fácil"

Totalmente de acuerdo, y podés seguir tu vida con esas plataformas si querés.

Pero si buscás escalar tu desarrollo (integrando servicios varios, como una [base de datos](https://cloud.ibm.com/catalog?category=databases) o [Inteligencia Artificial](https://cloud.ibm.com/catalog?category=ai) de manera "más seria" o eficiente), hacer tu aplicación más segura o simplemente para probar algo distinto, **este es el camino adecuado** para hacerlo.

## "Me parece demasiado complicado IBM Cloud para un simple `create-react-app`"

_I've been there_. Todo tiene una razón de ser, y no es distinto en el mundo de la tecnología. Y aunque asuste al principio todo esto, a medida que aprendas y te metas en Cloud, vas a notar las grandes virtudes y por qué tantas empresas eligen IBM Cloud.

`create-react-app` ya lo conocemos, pero lo que **no** conocemos es [**`Cloud Foundry`**](https://docs.cloudfoundry.org/) y sus ventajas/desventajas, [Docker](https://www.docker.com/) en la nube... Necesitamos ampliar nuestro conocimiento, y este es un buen punto de partida.
