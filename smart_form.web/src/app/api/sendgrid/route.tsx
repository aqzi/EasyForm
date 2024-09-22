import { NextResponse, NextRequest } from 'next/server';

import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(String(process.env.SENDGRID_API_KEY));

export const POST = async function POST(req: NextRequest) {
    const { subject, fullname, email, message} = await req.json();

    try {
        await sendgrid.send({
            to: 'aquila.ziedins@hotmail.com', // Your email where you'll receive emails
            from: 'aquila@ziecon.com', // your website email address here
            subject: `[Lead from website] : ${subject}`,
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html lang="en">
                <head>
                    <meta charset="utf-8">
                
                    <title>The HTML5 Herald</title>
                    <meta name="description" content="The HTML5 Herald">
                    <meta name="author" content="SitePoint">
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                
                    <link rel="stylesheet" href="css/styles.css?v=1.0">
                
                </head>
                
                <body>
                    <div class="img-container" style="display: flex;justify-content: center;align-items: center;border-radius: 5px;overflow: hidden; font-family: 'helvetica', 'ui-sans';">              
                        </div>
                        <div class="container" style="margin-left: 20px;margin-right: 20px;">
                        <h3>You've got a new mail from ${fullname}, their email is: ✉️${email} </h3>
                        <div style="font-size: 16px;">
                        <p>Message:</p>
                        <p>${message}</p>
                        </div>
                </body>
                </html>
            `,
        });

        return NextResponse.json({ message: 'Email sent' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 });
    }
}