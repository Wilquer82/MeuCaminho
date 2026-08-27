const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();
const { auth } = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const User = require('../models/User');

// Configurar transporte de email (Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// 1. Enviar feedback / pesquisa de satisfação
router.post('/', auth, async (req, res) => {
  try {
    const { rating, category, message, featureRequest } = req.body;
    const user = await User.findById(req.user._id);

    // Salvar no banco
    const feedback = await Feedback.create({
      user: req.user._id,
      rating,
      category,
      message,
      featureRequest
    });

    // Enviar email para o desenvolvedor
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.DEV_EMAIL,
      replyTo: user.email,
      subject: `📊 Feedback VerboVivo - ${category} - Nota: ${rating}/5`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #297a2e;">Novo Feedback Recebido!</h2>
          <p><strong>Usuário:</strong> ${user.name} (${user.email})</p>
          <p><strong>Nota:</strong> ${'⭐'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)</p>
          <p><strong>Categoria:</strong> ${category}</p>
          <hr/>
          <h3>Mensagem:</h3>
          <p style="background: #f8fafb; padding: 15px; border-radius: 8px;">
            ${message || '(sem mensagem)'}
          </p>
          ${featureRequest ? `
            <h3>Sugestão de funcionalidade:</h3>
            <p style="background: #fff8e1; padding: 15px; border-radius: 8px;">
              ${featureRequest}
            </p>
          ` : ''}
          <hr/>
          <p style="color: #64748b; font-size: 12px;">
            Enviado em: ${new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    // Email de confirmação para o usuário
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Obrigado pelo seu feedback! 🙏',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 30px; text-align: center;">
          <h2 style="color: #297a2e;">Obrigado, ${user.name.split(' ')[0]}!</h2>
          <p>Seu feedback foi recebido e é muito importante para nós.</p>
          <p>Lemos cada mensagem pessoalmente.</p>
          <p style="margin-top: 30px; color: #64748b; font-size: 12px;">
            Equipe VerboVivo
          </p>
        </div>
      `
    });

    res.json({
      success: true,
      message: 'Feedback enviado com sucesso!',
      feedbackId: feedback._id
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Obter estatísticas de feedback (admin)
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
