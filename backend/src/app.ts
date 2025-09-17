import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.get("/slide", (req, res) => {
    res.json({ status: "OK", message: "do you slide on all your nights like this?" })
});

const PORT = process.env.PORT || 1417

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`);
});


