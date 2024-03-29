import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());//JSONボディのパースを有効化

app.use(express.static('public'));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MY_ADDRESS,
        pass: process.env.MY_PASS,
    },
});


app.get('/', (req, res) => {
    res.send('Hello World!');
  });

app.post('/api/send-email', async (req, res) => {
    const { email, message } = req.body;
    try {
        await transporter.sendMail({
            from: process.env.MY_ADDRESS,
            replyTo:email,
            to: process.env.MY_ADDRESS,
            subject: 'メールフォームからのメッセージ',
            text: message,
        });
        await transporter.sendMail({
            from: process.env.MY_ADDRESS,
            to: email,
            subject: '返信メッセージ',
            text: `この度はお問い合わせいただき、誠にありがとうございます。\n\n『${message}』\n\nお送りいただいた内容を確認いたしました。ご入力いただいた情報に基づき、迅速に対応させていただく予定ですので、今しばらくお待ちください。\n\n何かご不明な点がございましたら、このメールにご返信いただくか、お問い合わせフォームより再度ご連絡ください。\n\n今後ともどうぞ宜しくお願い申し上げます。`,
        });
        res.status(200).json({message: 'メールを送信しました'});
    } catch (error) {
        console.error('メール送信エラー', error);
        res.status(500).json({ message: 'メールの送信に失敗しました'});
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});