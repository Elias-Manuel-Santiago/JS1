import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3002;

app.use(express.static('pages'));
app.use('/scripts', express.static('scripts'));
app.use('/styles', express.static('styles'));
app.use('/modules', express.static('modules'));
app.use('/views', express.static('views'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});