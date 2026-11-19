import nodemailer from 'nodemailer';
import { emailConfig } from './email.config';

// Chỉ file này biết về nodemailer: đổi provider (SES, Resend...) thì chỉ sửa ở đây
export const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: emailConfig.auth,
  // Tái sử dụng kết nối SMTP thay vì mỗi email mở một kết nối mới
  pool: true,
  maxConnections: emailConfig.pool.maxConnections,
  maxMessages: emailConfig.pool.maxMessages,
});

// Gọi khi worker khởi động: sai cấu hình SMTP thì biết ngay, không đợi tới lúc gửi email
export const verifyTransport = () => transporter.verify();

export const closeTransport = () => transporter.close();
