import app from './app';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 4444;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
