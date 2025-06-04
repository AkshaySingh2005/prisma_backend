import express from "express";
import categoriesRouter from "./routes/categoryRoutes.js";
import productsRouter from "./routes/productsRoutes.js";

const app = express();
app.use(express.json());

app.use("/", categoriesRouter);
app.use("/", productsRouter);

app.listen(5000, () => console.log("server started on port 5000"));
