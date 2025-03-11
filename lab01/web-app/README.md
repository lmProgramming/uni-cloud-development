# web app

simple personal portfolio site

## Setup and Development

### Installation

```sh
npm install
```

### Build (Compile TypeScript)

```sh
npm run build
```

### Running

```sh
npm start
```

### Development Mode

For development with automatic recompilation and server restart:

```sh
npm run dev
```

### Docker Build

```sh
docker build -t jantar/node-web-app -f .dockerfile .
docker run -p 8080:8080 jantar/node-web-app
```

You can replace "jantar" with other username in both commands.
