import path from 'node:path';
import ejs from 'ejs';
import { isProd } from '@/config/env';
import type {
  EmailTemplateName,
  EmailTemplates,
  RenderedEmail,
} from '../email.types';
import { helpers } from './helpers';

const VIEWS_DIR = path.join(__dirname, 'views');

type TemplateDefinition<K extends EmailTemplateName> = {
  view: string;
  subject: (data: EmailTemplates[K]) => string;
};

const definitions: { [K in EmailTemplateName]: TemplateDefinition<K> } = {
  RESET_PASSWORD_OTP: {
    view: 'reset-password-otp',
    subject: () => 'Mã OTP đặt lại mật khẩu',
  },
  RESET_PASSWORD_SUCCESS: {
    view: 'reset-password-success',
    subject: () => 'Đổi mật khẩu thành công',
  },
};

const render = (file: string, locals: object) =>
  ejs.renderFile(
    path.join(VIEWS_DIR, file),
    { ...locals, helpers },
    {
      cache: isProd,
    }
  );

export const renderEmail = async <K extends EmailTemplateName>(
  name: K,
  data: EmailTemplates[K]
): Promise<RenderedEmail> => {
  const { view, subject: getSubject } = definitions[name];
  const subject = getSubject(data);

  const body = await render(`${view}.ejs`, data);
  const html = await render('layouts/base.ejs', { title: subject, body });

  return { subject, html };
};
