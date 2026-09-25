import nodemailer from "nodemailer";

/**
 * Envio de e-mail transacional (código de confirmação de cadastro, código
 * de redefinição de senha) via SMTP. As credenciais vêm das variáveis de
 * ambiente SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD / SMTP_FROM
 * (ver .env.example) — sem elas configuradas, o envio falha com um erro
 * claro em vez de silenciosamente não enviar nada.
 */

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const port = Number(process.env.SMTP_PORT ?? 587);

  if (!host || !user || !password) {
    throw new Error(
      "SMTP não configurado. Preencha SMTP_HOST, SMTP_USER e SMTP_PASSWORD no arquivo .env (e na Vercel)."
    );
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 usa SSL direto; 587 usa STARTTLS (padrão)
    auth: { user, pass: password },
  });

  return transporter;
}

export async function sendMail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const from = process.env.SMTP_FROM || "Aero Imports <contato@aeroimports.com.br>";
  await getTransporter().sendMail({ from, to, subject, html, text });
}

/**
 * Template de e-mail com o código de 6 dígitos, no visual "Flight Trace"
 * do site (cores inline, já que e-mails não carregam Tailwind).
 */
export function verificationCodeEmailHtml(params: {
  heading: string;
  intro: string;
  code: string;
  footerNote: string;
}): string {
  const { heading, intro, code, footerNote } = params;
  const codeSpaced = code.split("").join(" ");

  return `
  <div style="background-color:#F5F6F7;padding:40px 16px;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;">
      <div style="background-color:#0B1220;padding:28px 32px;">
        <p style="margin:0;font-size:18px;font-weight:600;color:#ffffff;letter-spacing:0.02em;">
          AERO<span style="color:#FF5A1F;">IMPORTS</span>
        </p>
      </div>
      <div style="padding:32px;">
        <h1 style="margin:0 0 12px;font-size:20px;color:#0B1220;">${heading}</h1>
        <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#4B5563;">${intro}</p>
        <div style="text-align:center;margin:0 0 24px;">
          <span style="display:inline-block;padding:16px 28px;border-radius:12px;background-color:#F5F6F7;font-size:28px;font-weight:700;letter-spacing:0.3em;color:#0B1220;">
            ${codeSpaced}
          </span>
        </div>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#6B7280;">${footerNote}</p>
      </div>
      <div style="padding:20px 32px;border-top:1px solid #EEF0F2;">
        <p style="margin:0;font-size:12px;color:#9CA3AF;">
          Se você não fez essa solicitação, pode ignorar este e-mail com segurança.
        </p>
      </div>
    </div>
  </div>`;
}
