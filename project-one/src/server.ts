import PostRouter from "./routes/post.route";
import express from 'express';
// Create an Express application
const app = express();
// Set the port number for the server
const port = 8000;
// Define a route for the root path ('/')
app.get('/', (req, res) => {
// Send a response to the client
res.send('Hello, TypeScript + Node.js + Express!');
});



app.use("/api/post", PostRouter);