export const emailSubject = (companyName: string) =>
  `Your Sanay ROI Report - ${companyName}`

export const emailHtml = (
  recipientName: string,
  companyName: string,
  recipientEmail: string
) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Sanay ROI Report</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 20px; text-align: center; background: linear-gradient(135deg, #7839EE 0%, #5B21B6 100%);">
                <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 2px;">SANAY</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 20px; background-color: #ffffff;">
                <div style="max-width: 600px; margin: 0 auto;">
                  <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                    Hello ${recipientName || 'there'},
                  </h2>
                  
                  <p style="margin: 0 0 20px 0; color: #333; font-size: 16px; line-height: 1.6;">
                    Thank you for using Sanay's quoting tool. We've prepared a comprehensive ROI report for <strong>${companyName}</strong>.
                  </p>
                  
                  <p style="margin: 0 0 30px 0; color: #333; font-size: 16px; line-height: 1.6;">
                    Your personalized report includes:
                  </p>
                  
                  <ul style="margin: 0 0 30px 0; padding-left: 20px; color: #333; font-size: 16px; line-height: 1.8;">
                    <li>Detailed cost comparison analysis</li>
                    <li>Efficiency score and potential savings</li>
                    <li>AI-powered insights and recommendations</li>
                    <li>Strategic next steps for your business</li>
                  </ul>
                  
                  <p style="margin: 0 0 30px 0; color: #333; font-size: 16px; line-height: 1.6;">
                    Please find your complete ROI report attached as a PDF document.
                  </p>
                  
                  <div style="margin: 40px 0; padding: 30px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #7839EE;">
                    <h3 style="margin: 0 0 15px 0; color: #7839EE; font-size: 20px; font-weight: 600;">
                      Next Steps
                    </h3>
                    <p style="margin: 0 0 15px 0; color: #333; font-size: 15px; line-height: 1.6;">
                      Ready to get started? We'd love to discuss how Sanay can help streamline your financial management.
                    </p>
                    <p style="margin: 0; color: #333; font-size: 15px; line-height: 1.6;">
                      <strong>Book a consultation:</strong> Schedule a call with our team to discuss your specific needs and customize your package.
                    </p>
                  </div>
                  
                  <p style="margin: 30px 0 0 0; color: #666; font-size: 14px; line-height: 1.6;">
                    If you have any questions about this report, please don't hesitate to contact us at <a href="info@sanaybpo.com" style="color: #7839EE; text-decoration: none;">info@sanay.co.uk</a>
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px 20px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #e4e7ec;">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                  <strong>Sanay</strong> - Professional Financial Management Services
                </p>
                <p style="margin: 0; color: #999; font-size: 12px;">
                  This email was sent to ${recipientEmail}. If you have any questions, please contact us.
                </p>
                <p style="margin: 15px 0 0 0; color: #999; font-size: 12px;">
                  © ${new Date().getFullYear()} Sanay. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `
