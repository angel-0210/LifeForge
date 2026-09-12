import dotenv from 'dotenv';
import path from 'path';
import { app } from './app';

dotenv.config({ path: path.resolve(__dirname, './.env') });
dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(` LifeForge RPG Engine API server running on http://localhost:${PORT}`);
});
