import express, { Application } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { siteRoutes } from './routes/siteRoutes';

const app: Application = express();
const port = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/api/sites', siteRoutes);

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
