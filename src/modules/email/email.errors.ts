// Lỗi gửi email mà retry cũng không thành công (địa chỉ sai, bị server từ chối...)
// Module email không phụ thuộc BullMQ: processor sẽ map lỗi này sang UnrecoverableError
export class PermanentEmailError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'PermanentEmailError';
  }
}

type SmtpError = { code?: string; responseCode?: number };

const isSmtpError = (err: unknown): err is SmtpError =>
  typeof err === 'object' && err !== null;

// - EENVELOPE: địa chỉ người nhận/người gửi không hợp lệ
// - SMTP 5xx: server từ chối vĩnh viễn (550 mailbox không tồn tại, 553...)
// Lỗi kết nối, timeout, 4xx là lỗi tạm thời → để BullMQ retry
export const isPermanentSmtpError = (err: unknown): boolean => {
  if (!isSmtpError(err)) return false;
  if (err.code === 'EENVELOPE') return true;
  const status = err.responseCode;
  // Lỗi xác thực (530/534/535) là sai cấu hình, không phải lỗi của email này → vẫn coi là tạm thời
  if (status === 530 || status === 534 || status === 535) return false;
  return typeof status === 'number' && status >= 500 && status < 600;
};
