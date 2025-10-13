import express from "express";
import dotenv from "dotenv";
import error_handler from "./middleware/errorMiddle.js";


const PORT = process.env.PORT || 3000;
dotenv.config();

const app = express();

app.use("/users")
app.use(express.json());

app.use(error_handler);

app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});
