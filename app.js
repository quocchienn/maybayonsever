const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

let users = [];
let scores = [];

// Đăng ký
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'Tên tài khoản đã tồn tại' });
    }
    users.push({ username, password });
    res.json({ message: 'Đăng ký thành công' });
});

// Đăng nhập
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
    res.json({ message: 'Đăng nhập thành công' });
});

// Gửi điểm
app.post('/submit-score', (req, res) => {
    const { username, score, level } = req.body;
    scores.push({ username, score, level });
    res.json({ message: 'Gửi điểm thành công' });
});

// Bảng xếp hạng
app.get('/leaderboard', (req, res) => {
    const topScores = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    res.json(topScores);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));