import { NextResponse } from 'next/server';
import { auth } from '@/auth';

import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(String(process.env.SENDGRID_API_KEY));

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export const POST = auth(async function POST(req) {
    if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 })

    const { subject, fullname, email, message} = await req.json();

    const safeSubject = escapeHtml(subject);
    const safeFullname = escapeHtml(fullname);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    try {
        await sendgrid.send({
            to: 'easyform@gmail.com',
            from: 'easyform@ziecon.com',
            subject: `[Lead from website] : ${safeSubject}`,
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html lang="en">
                <head>
                    <meta charset="utf-8">
                
                    <title>The HTML5 Herald</title>
                    <meta name="description" content="The HTML5 Herald">
                    <meta name="author" content="SitePoint">
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                
                </head>
                
                <body>
                    <div class="img-container" style="display: flex;justify-content: center;align-items: center;border-radius: 5px;overflow: hidden; font-family: 'helvetica', 'ui-sans';">              
                        </div>
                        <div class="container" style="margin-left: 20px;margin-right: 20px;">
                        <h3>You've got a new mail from ${safeFullname}, their email is: ✉️${safeEmail} </h3>
                        <div style="font-size: 16px;">
                        <p>Message:</p>
                        <p>${safeMessage}</p>
                        </div>
                </body>
                </html>
            `,
        });

        return NextResponse.json({ message: 'Email sent' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 });
    }
})