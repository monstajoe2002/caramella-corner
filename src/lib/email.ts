import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
const domain = process.env.VITE_PUBLIC_APP_URL
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/verify?token=${token}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Confirm your email',
    html: `<p>Please click <a href="${confirmLink}">here</a> to confirm your email address.</p>`,
  })
}
export const sendConfirmationEmail = async (
  email: string,
  orderNumber: string,
) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Order Confirmation',
    html: `<h1>Your order has been confirmed! ✅</h1> 
    <p>Your order number is: <b>#${orderNumber}</b>. It should be expected to arrive within 2-3 business days.</p>
    `,
  })
}
