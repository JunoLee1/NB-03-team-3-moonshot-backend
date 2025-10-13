import express from "express";
import dotenv from "dotenv";
const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
// app.use("/users")
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map