import { CalendarEvent } from '../types'
import { formatDateLong, formatTimeRange, truncate } from '../utils'

export function buildDigestHtml(
  events: CalendarEvent[],
  weekLabel: string
): string {
  const calendarUrl =
    process.env.NEXT_PUBLIC_CALENDAR_URL || 'https://cwtraininghub.co.uk'
  const adminEmail =
    process.env.ADMIN_EMAIL || 'admin@cwtraininghub.co.uk'

  const eventRows = events.length === 0
    ? `<tr><td style="padding:20px;text-align:center;color:#6B7280;font-family:Arial,sans-serif;">
        No events scheduled for this week.
       </td></tr>`
    : events.map(event => buildEventRow(event)).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CWTH Events &amp; Training — Week of ${weekLabel}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f7fa;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f7fa;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1A5FA8;padding:32px 40px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;letter-spacing:-0.3px;">
                CWTH Events &amp; Training
              </p>
              <p style="margin:8px 0 0;color:#E8F4FD;font-size:14px;">
                Coventry &amp; Warwickshire Training Hub
              </p>
            </td>
          </tr>

          <!-- Subheading -->
          <tr>
            <td style="padding:28px 40px 8px;border-bottom:1px solid #D1D5DB;">
              <h1 style="margin:0 0 8px;font-size:20px;color:#1A2B3C;font-weight:bold;">
                Upcoming Events &amp; Training
              </h1>
              <p style="margin:0 0 20px;font-size:15px;color:#6B7280;line-height:1.6;">
                Here&apos;s what&apos;s coming up this week for primary care staff across Coventry &amp; Warwickshire.
              </p>
              <p style="margin:0;font-size:13px;color:#6B7280;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">
                Week of ${weekLabel}
              </p>
            </td>
          </tr>

          <!-- Events -->
          <tr>
            <td style="padding:8px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${eventRows}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f5f7fa;padding:24px 40px;border-top:1px solid #D1D5DB;">
              <p style="margin:0 0 8px;font-size:13px;color:#6B7280;line-height:1.6;">
                This digest was sent by CWTH. To manage your subscription or for queries,
                contact <a href="mailto:${adminEmail}" style="color:#1A5FA8;">${adminEmail}</a>.
              </p>
              <p style="margin:0;font-size:13px;color:#6B7280;">
                <a href="${calendarUrl}" style="color:#00B0CA;text-decoration:none;">
                  View full calendar →
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function buildEventRow(event: CalendarEvent): string {
  const dateLabel = formatDateLong(event.event_date)
  const timeRange = formatTimeRange(event.start_time, event.end_time)
  const description = event.description
    ? truncate(event.description, 100)
    : ''
  const locationLine = [
    event.delivery_mode,
    event.location,
  ]
    .filter(Boolean)
    .join(' · ')

  const titleHtml = event.booking_url
    ? `<a href="${escapeHtml(event.booking_url)}" style="color:#1A5FA8;text-decoration:none;font-size:17px;font-weight:bold;line-height:1.3;">
        ${escapeHtml(event.title)}
       </a>`
    : `<span style="color:#1A2B3C;font-size:17px;font-weight:bold;line-height:1.3;">
        ${escapeHtml(event.title)}
       </span>`

  const bookingButton = event.booking_url
    ? `<p style="margin:12px 0 0;">
        <a href="${escapeHtml(event.booking_url)}"
           style="display:inline-block;background-color:#00B0CA;color:#ffffff;padding:8px 18px;border-radius:4px;font-size:13px;font-weight:bold;text-decoration:none;">
          Book / Find Out More →
        </a>
       </p>`
    : ''

  const cancelledBanner = event.status === 'cancelled'
    ? `<p style="margin:0 0 8px;background-color:#fee2e2;color:#dc2626;padding:6px 10px;border-radius:3px;font-size:12px;font-weight:bold;display:inline-block;">
        CANCELLED
       </p>`
    : ''

  return `<tr>
    <td style="padding:20px 40px;border-bottom:1px solid #f0f0f0;">
      ${cancelledBanner}
      <p style="margin:0 0 4px;font-size:12px;color:#6B7280;font-weight:bold;text-transform:uppercase;letter-spacing:0.4px;">
        ${escapeHtml(event.category)}
      </p>
      ${titleHtml}
      <p style="margin:6px 0 0;font-size:13px;color:#6B7280;">
        ${escapeHtml(dateLabel)}${timeRange ? ' · ' + escapeHtml(timeRange) : ''}
      </p>
      ${locationLine
        ? `<p style="margin:4px 0 0;font-size:13px;color:#6B7280;">${escapeHtml(locationLine)}</p>`
        : ''}
      ${description
        ? `<p style="margin:8px 0 0;font-size:14px;color:#374151;line-height:1.5;">${escapeHtml(description)}</p>`
        : ''}
      ${bookingButton}
    </td>
  </tr>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
