// Các hàm dùng chung trong mọi file .ejs, gọi qua biến `helpers`
export const helpers = {
  formatDateTime: (iso: string) =>
    new Date(iso).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
};
