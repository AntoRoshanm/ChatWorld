const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const socketIo = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

const accountSid = "AC2a5e34b90c769664d1563dcb904b2511";
const authToken = "5e2d45f558ce467368ae52da6bc21be8";
const verifySid = "VA8808068d0f9dce266c2be112d9ae9ca9";
const client = twilio(accountSid, authToken);

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('endCall', () => {
    console.log('Received endCall event');
    // Broadcast the event to all connected clients to notify them about the end of the call
    io.emit('endCall');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.post('/send-sms', async (req, res) => {
  const { Password } = req.body;

  try {
    const verification = await client.verify.services(verifySid)
      .verifications.create({ to: `${Password}`, channel: "sms" });

    console.log(verification.status);

    if (verification.status === 'pending') {
      res.json({ otpStatus: verification.status });
    } else {
      res.status(400).json({ error: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/verify', async (req, res) => {
  const { Password, otpCode } = req.body;

  try {
    const verification_check = await client.verify.services(verifySid)
      .verificationChecks.create({ to: `${Password}`, code: otpCode });

    console.log(verification_check.status);

    if (verification_check.status === 'approved') {
      res.json({ otpStatus: verification_check.status });
    } else {
      res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => console.log('Server listening on port 3000'));



