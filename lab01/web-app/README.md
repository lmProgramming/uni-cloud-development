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
npm run offline
```

### Docker Build

```sh
docker build -t jantar/node-web-app -f .dockerfile .
docker run -p 8080:8080 jantar/node-web-app
```

You can replace "jantar" with other username in both commands.

### Vercel

If you don't have vercel, install it

```sh
npm install -g vercel
```

and then to update vercel serverless version

```sh
vercel
```

And to deploy to production

```sh
vercel --prod
```
