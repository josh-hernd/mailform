import { invalid } from "@sveltejs/kit";
import type { Action, Actions } from "./$types";

// Nodemailer import
import nodemailer from 'nodemailer';

const contact: Action = async ({ request, url }) => {
    const headerCaptcha = request.headers.get("gotCha")

    // Fomr data
    const form = await request.formData()
    const clientName = form.get('First Last')
    const phone = form.get('Phone')
    const email = form.get('Email')
    const captcha = form.get('_gotcha')

    // Simple validations
    if (captcha != headerCaptcha ||
        !captcha
    ) {
        return invalid(403, { error: 'Not Accepted!' })
    }

    if (
        typeof clientName !== 'string' ||
        !clientName ||
        typeof phone !== 'string' ||
        !phone ||
        typeof email !== 'string' ||
        !email
    ) {
        return invalid(403, { error: 'You provided something wrong.' })
    }

    // pase form input in li
    function parseForm(form: FormData) {
        let htmlForm = ''
        for (const pair of form.entries()) {
            if (!pair[0] || pair[0] != '_gotcha' || !pair[1]) {
                htmlForm += `<li><strong>${pair[0]}:</strong> ${pair[1]}</li>`
            }
        }
        return htmlForm
    }
    if (import.meta.env.VITE_CONFIG_ENV === 'dev') {
        const testAccount = await nodemailer.createTestAccount();
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass  // generated ethereal password
            }
        })
        const info = await transporter.sendMail({
            date: new Date(),
            from: import.meta.env.VITE_AWS_VERIFIED_ENTITY,
            to: import.meta.env.VITE_AWS_VERIFIED_ENTITY,
            replyTo: email,
            subject: `${url.host}: contact request`,
            html: `<ul style="list-style:none;">${parseForm(form)}</ul>`,
        })

        return { success: true, msg: 'Form was sent!', ethUrl: nodemailer.getTestMessageUrl(info) }
    } else {
        // nodemailer init
        const transporter = nodemailer.createTransport({
            host: import.meta.env.VITE_AWS_SMTP_HOST,
            port: import.meta.env.VITE_AWS_PORT,
            secure: true, // upgrade later with STARTTLS
            auth: {
                user: `${import.meta.env.VITE_AWS_ACCESS_KEY_ID}`,
                pass: `${import.meta.env.VITE_AWS_SECRET_ACCESS_KEY}`
            }
        })

        await transporter.sendMail({
            date: new Date(),
            from: import.meta.env.VITE_AWS_VERIFIED_ENTITY,
            to: import.meta.env.VITE_AWS_VERIFIED_ENTITY,
            replyTo: email,
            subject: `${url.host}: contact request`,
            html: `<ul style="list-style:none;">${parseForm(form)}</ul>`,
        })
        return { success: true, msg: 'Form was sent!' }
    }

}

export const actions: Actions = { contact }