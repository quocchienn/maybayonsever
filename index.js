const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const users = {}; // Dùng object lưu tạm, nên dùng MongoDB hoặc Vercel KV cho bản thật
const leaderboard = [];

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (users[username]) return res.json({ success: false, message: "Tài khoản đã tồn tại!" });
    users[username] = { password, score: 0, level: 1 };
    res.json({ success: true, message: "Đăng ký thành công!" });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!users[username] || users[username].password !== password)
        return res.json({ success: false, message: "Sai tài khoản hoặc mật khẩu!" });
    res.json({ success: true, message: "Đăng nhập thành công!" });
});

app.post('/api/score', (req, res) => {
    const { username, score, level } = req.body;
    if (!users[username]) return res.json({ success: false });
    users[username].score = Math.max(users[username].score, score);
    users[username].level = Math.max(users[username].level, level);
    leaderboard.push({ username, score, level });
    res.json({ success: true });
});

app.get('/api/leaderboard', (req, res) => {
    // Trả về top 10
    const top = Object.entries(users)
        .map(([username, u]) => ({ username, score: u.score, level: u.level }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    res.json(top);
});

module.exports = app;