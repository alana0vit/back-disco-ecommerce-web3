import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const emailPort = parseInt(process.env.EMAIL_PORT || '587');
    const emailUser = process.env.EMAIL_USER || '';
    const emailPassword = process.env.EMAIL_PASSWORD || '';

    this.transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('Conexão com servidor de email estabelecida com sucesso');
    } catch (error) {
      this.logger.warn(
        'Não foi possível conectar ao servidor de email:',
        error.message,
      );
    }
  }

  async sendPasswordResetEmail(
    to: string,
    userName: string,
    resetUrl: string,
  ): Promise<void> {
    const emailFrom =
      process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@discool.com';
    const emailFromName = process.env.EMAIL_FROM_NAME || 'Discool';

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${emailFromName}" <${emailFrom}>`,
      to,
      subject: 'Recuperação de Senha',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Olá, ${userName}!</h2>
          <p>Recebemos uma solicitação para redefinir sua senha.</p>
          <p>Clique no botão abaixo para criar uma nova senha:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; font-weight: bold;">
              Redefinir Senha
            </a>
          </div>
          <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
          <p style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; 
                    word-break: break-all;">
            ${resetUrl}
          </p>
          <p><strong>Este link expira em 1 hora.</strong></p>
          <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #777; font-size: 12px;">
            Esta é uma mensagem automática, por favor não responda.
          </p>
        </div>
      `,
      text: `Olá ${userName}!\n\nRecebemos uma solicitação para redefinir sua senha.\nAcesse este link para criar uma nova senha: ${resetUrl}\n\nEste link expira em 1 hora.\n\nSe você não solicitou a recuperação de senha, ignore este email.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email de recuperação enviado para: ${to}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email para ${to}:`, error.message);
    }
  }

  async sendPasswordChangedConfirmation(
    to: string,
    userName: string,
  ): Promise<void> {
    const emailFrom =
      process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@discool.com';
    const emailFromName = process.env.EMAIL_FROM_NAME || 'Discool';

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${emailFromName}" <${emailFrom}>`,
      to,
      subject: 'Senha Alterada com Sucesso',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Olá, ${userName}!</h2>
          <p>Sua senha foi alterada com sucesso.</p>
          <p>Se você não realizou esta alteração, entre em contato com nosso suporte imediatamente.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #777; font-size: 12px;">
            Esta é uma mensagem automática, por favor não responda.
          </p>
        </div>
      `,
      text: `Olá ${userName}!\n\nSua senha foi alterada com sucesso.\n\nSe você não realizou esta alteração, entre em contato com nosso suporte imediatamente.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email de confirmação enviado para: ${to}`);
    } catch (error) {
      this.logger.error(
        `Erro ao enviar email de confirmação para ${to}:`,
        error.message,
      );
    }
  }
}
