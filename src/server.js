import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from '../middlewares/error.js';
import notFound from '../middlewares/notFound.js';

const app = express();
const PORT = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup static folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// Error handler
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});