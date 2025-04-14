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

### Docker Build

```sh
docker build -t node-web-app .
docker run -p 8080:8080 -d node-web-app
```

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
