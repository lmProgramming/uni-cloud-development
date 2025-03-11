import express, { Request, Response } from 'express';
import path from 'path';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Main route
app.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Strona główna', message: 'Witaj świecie!' });
});

// Start server
app.listen(port, () => {
  console.log(`Aplikacja nasłuchuje na porcie ${port}`);
});

app.post('/', (req: Request, res: Response) => {
  res.send('Got a POST request');
});

app.put('/user', (req: Request, res: Response) => {
  res.send('Got a PUT request at /user');
});

app.delete('/user', (req: Request, res: Response) => {
  res.send('Got a DELETE request at /user');
});