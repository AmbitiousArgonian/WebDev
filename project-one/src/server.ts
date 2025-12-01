//import PostRouter from "./routes/post.route";
import scanItemRouter from './routes/scanItem';
import { PrismaClient } from "./generated/prisma/client"; 
import express from 'express';

export const prisma = new PrismaClient();
// Create an Express application
const app = express();

// Set the port number for the server
const port = 8000;

// Cors
var cors = require('cors')
app.use(cors())

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})


// Define a route for the root path ('/')
app.get('/', (req, res) => {
// Send a response to the client
res.send('Hello, TypeScript + Node.js + Express!');
});


async function main() {
  app.use(express.json());

  // Register API routes
  app.use('/api/scanItem', scanItemRouter);

  // Catch unregistered routes
  /*app.all("*", (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  }); */

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}
main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

  //Route
app.use('/api/scanItem', scanItemRouter);