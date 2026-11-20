import html
import os

import requests

BREVO_SMTP_URL = "https://api.brevo.com/v3/smtp/email"
DEFAULT_APP_URL = "https://poultra-scan.vercel.app"

# Shared Poultry Scan AgriTech brand palette (matches the frontend theme)
BRAND_PRIMARY = "#2E7D32"
BRAND_PRIMARY_HOVER = "#276C2A"
BRAND_LIGHT_GREEN = "#E8F5E9"
BRAND_CANVAS = "#F8FAF7"
BRAND_INK = "#1B1D1B"
BRAND_TEXT_MUTED = "#6B7280"
BRAND_BORDER = "#E5E7EB"


class EmailService:

    @staticmethod
    def is_configured() -> bool:
        return bool(os.getenv("BREVO_API_KEY")) and bool(os.getenv("BREVO_SENDER_EMAIL"))

    @classmethod
    def _render_shell(cls, title: str, body_html: str) -> str:
        """Wrap any email body in the shared Poultry Scan-branded layout."""
        return f"""\
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
</head>
<body style="margin:0;padding:0;background-color:{BRAND_CANVAS};-webkit-text-size-adjust:100%;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:{BRAND_CANVAS};padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header / brand -->
          <tr>
            <td align="center" style="padding:0 0 24px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" valign="middle"
                      style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,{BRAND_PRIMARY} 0%,#43A047 100%);">
                    <span style="display:block;width:44px;height:44px;line-height:44px;text-align:center;color:#ffffff;font-size:22px;font-weight:bold;">P</span>
                  </td>
                  <td style="padding-left:12px;">
                    <span style="color:{BRAND_INK};font-size:20px;font-weight:bold;letter-spacing:-0.2px;">Poultry Scan AI</span>
                    <br />
                    <span style="color:{BRAND_TEXT_MUTED};font-size:12px;">Smart Poultry Health Monitoring</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff;border:1px solid {BRAND_BORDER};border-radius:16px;padding:32px;">
              {body_html}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 0 0 0;">
              <span style="color:{BRAND_TEXT_MUTED};font-size:12px;line-height:18px;">
                Poultry Scan AI &bull; Monitor. Detect. Thrive.<br />
                If you have questions, reply to this email or reach out through the app.
              </span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    @classmethod
    def _send(cls, to_email: str, subject: str, html_content: str) -> None:
        """Send an HTML email through the Brevo REST API."""
        api_key = os.getenv("BREVO_API_KEY")
        sender_email = os.getenv("BREVO_SENDER_EMAIL")
        sender_name = os.getenv("BREVO_SENDER_NAME") or "Poultry Scan AI"

        if not api_key or not sender_email:
            missing = [name for name in ("BREVO_API_KEY", "BREVO_SENDER_EMAIL") if not os.getenv(name)]
            raise RuntimeError(f"Brevo is not configured; missing env var(s): {', '.join(missing)}")

        payload = {
            "sender": {"name": sender_name, "email": sender_email},
            "to": [{"email": to_email}],
            "subject": subject,
            "htmlContent": html_content,
        }

        resp = requests.post(
            BREVO_SMTP_URL,
            json=payload,
            headers={
                "accept": "application/json",
                "content-type": "application/json",
                "api-key": api_key,
            },
            timeout=15,
        )

        if resp.status_code not in (200, 201, 202):
            raise RuntimeError(f"Brevo request failed ({resp.status_code}): {resp.text[:300]}")

    @classmethod
    def send_reset_password_code(cls, to_email: str, code: str) -> None:
        """Email a 6-character password-reset code, styled to match the app UI."""
        body_html = f"""\
      <h1 style="margin:0 0 12px 0;color:{BRAND_INK};font-size:22px;line-height:28px;">Reset Your Password</h1>
      <p style="margin:0 0 24px 0;color:{BRAND_TEXT_MUTED};font-size:15px;line-height:24px;">
        We received a request to reset the password for your Poultry Scan AI account.
        Use the 6-character code below to choose a new password.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center"
              style="background-color:{BRAND_LIGHT_GREEN};border:1px dashed {BRAND_PRIMARY};border-radius:12px;padding:18px 16px;">
            <span style="color:{BRAND_INK};font-family:'Courier New',monospace;font-size:32px;font-weight:bold;letter-spacing:10px;">{code}</span>
          </td>
        </tr>
      </table>

      <p style="margin:20px 0 0 0;color:{BRAND_TEXT_MUTED};font-size:14px;line-height:22px;">
        This code expires in <strong style="color:{BRAND_INK};">30 minutes</strong>. If you didn't request a password
        reset, you can safely ignore this email.
      </p>
      <p style="margin:16px 0 0 0;color:{BRAND_TEXT_MUTED};font-size:14px;line-height:22px;">
        Go to the app and enter your code to finish resetting your password.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 0 0;">
        <tr>
          <td align="center" style="background-color:{BRAND_PRIMARY};border-radius:8px;">
            <a href="{DEFAULT_APP_URL}/verify-reset-code" target="_blank"
               style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">
              Enter Your Code
            </a>
          </td>
        </tr>
      </table>"""

        cls._send(
            to_email,
            "Your Poultry Scan AI password reset code",
            cls._render_shell("Password Reset", body_html),
        )

    @classmethod
    def send_welcome_email(cls, to_email: str, name: str | None = None) -> None:
        """Greet a user the first time they log in, styled to match the app UI."""
        greeting = html.escape((name or "").strip() or "there")

        features = [
            ("Scan your flock", "Snap a photo to count chickens and spot early signs of illness."),
            ("Track your farms", "Keep every farm, scan session and journal entry in one place."),
            ("Get smart insights", "Receive AI-powered care tips and health summaries for your birds."),
        ]
        feature_rows = "".join(
            f"""
        <tr>
          <td valign="top" style="padding:0 12px 14px 0;width:24px;">
            <span style="display:inline-block;width:22px;height:22px;line-height:22px;border-radius:11px;background-color:{BRAND_LIGHT_GREEN};color:{BRAND_PRIMARY};font-size:13px;font-weight:bold;text-align:center;">&#10003;</span>
          </td>
          <td valign="top" style="padding:0 0 14px 0;">
            <span style="color:{BRAND_INK};font-size:15px;font-weight:bold;">{title}</span><br />
            <span style="color:{BRAND_TEXT_MUTED};font-size:14px;line-height:22px;">{desc}</span>
          </td>
        </tr>"""
            for title, desc in features
        )

        body_html = f"""\
      <h1 style="margin:0 0 12px 0;color:{BRAND_INK};font-size:22px;line-height:28px;">Welcome to Poultry Scan AI, {greeting}!</h1>
      <p style="margin:0 0 24px 0;color:{BRAND_TEXT_MUTED};font-size:15px;line-height:24px;">
        Thanks for joining us. Your account is all set, and your dashboard is ready.
        Here's what you can do to get started:
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">{feature_rows}
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:12px 0 0 0;">
        <tr>
          <td align="center" style="background-color:{BRAND_PRIMARY};border-radius:8px;">
            <a href="{DEFAULT_APP_URL}/dashboard" target="_blank"
               style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">
              Go to Dashboard
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:24px 0 0 0;color:{BRAND_TEXT_MUTED};font-size:14px;line-height:22px;">
        Happy farming!<br />
        <strong style="color:{BRAND_INK};">The Poultry Scan AI Team</strong>
      </p>"""

        cls._send(
            to_email,
            "Welcome to Poultry Scan AI",
            cls._render_shell("Welcome to Poultry Scan AI", body_html),
        )

    @classmethod
    def send_feedback(cls, message: str, sender_email: str | None = None) -> None:
        """Email new user feedback to the team inbox, styled like the feedback modal."""
        recipient = os.getenv("FEEDBACK_TO_EMAIL") or os.getenv("BREVO_SENDER_EMAIL")
        if not recipient:
            raise RuntimeError("Feedback recipient is not configured (FEEDBACK_TO_EMAIL)")

        from_label = html.escape(sender_email or "Not provided")

        body_html = f"""\
      <h1 style="margin:0 0 8px 0;color:{BRAND_INK};font-size:22px;line-height:28px;">New Feedback Received</h1>
      <p style="margin:0 0 24px 0;color:{BRAND_TEXT_MUTED};font-size:15px;line-height:24px;">
        A user sent the following feedback through the app.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
             style="border:1px solid {BRAND_BORDER};border-radius:12px;">
        <tr>
          <td style="padding:12px 16px;background-color:{BRAND_LIGHT_GREEN};">
            <span style="color:{BRAND_PRIMARY};font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">From</span>
            <br />
            <span style="color:{BRAND_INK};font-size:15px;font-weight:bold;">{from_label}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:16px;background-color:#ffffff;color:{BRAND_INK};font-size:15px;line-height:24px;">
            {html.escape(message)}
          </td>
        </tr>
      </table>

      <p style="margin:20px 0 0 0;color:{BRAND_TEXT_MUTED};font-size:13px;line-height:20px;">
        You can reply to this email if you need to follow up. If no email is listed, ask through the in-app chat instead.
      </p>"""

        cls._send(
            recipient,
            "New feedback for Poultry Scan AI",
            cls._render_shell("New Feedback", body_html),
        )
