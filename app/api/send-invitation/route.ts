import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, gender, country } = body;

    // Validate required fields
    if (!fullName || !email || !gender || !country) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'noreply@resend.dev', // Using Resend's default domain
      to: ['artheistlabs.osogbo@gmail.com'],
      subject: 'New Gentlemen Roundtable Invitation Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #d97706; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">
            New Invitation Request - The Gentlemen Roundtable
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Applicant Details:</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">Full Name:</td>
                <td style="padding: 8px 0; color: #333;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px 0; color: #333;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Gender:</td>
                <td style="padding: 8px 0; color: #333;">${gender}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Country:</td>
                <td style="padding: 8px 0; color: #333;">${country}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #fbbf24;">
            <p style="margin: 0; color: #92400e;">
              <strong>Submitted:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              This email was automatically generated from The Gentlemen Roundtable invitation form.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Invitation request sent successfully', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}