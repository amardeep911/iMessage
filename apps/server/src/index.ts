import cors from 'cors';
import express from 'express';

const app = express();
const port = 8080;
app.use(cors());
app.get('/', (req, res) => {
  res.json('hello there kuldeep');
});
app.get('/post', (req, res) => {
  res.json({ name: 'kuldeep ranjan ssr' });
});
app.listen(port, () => {
  console.log('server started');
});
