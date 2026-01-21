
/**
 * GOOGLE APPS SCRIPT WEB APP - ACHAT OR MONTRÉAL LEAD HANDLER
 * 
 * Instructions:
 * 1. Open a Google Sheet.
 * 2. Extensions > Apps Script.
 * 3. Paste this code.
 * 4. Replace placeholder constants below.
 * 5. Deploy > New Deployment > Web App > "Execute as Me" > "Who has access: Anyone".
 * 6. Copy the Web App URL and paste it into constants.ts as SHEETS_WEBHOOK_URL.
 */

const NOTIFICATION_EMAIL = "achatormontreal@gmail.com";
const NOTIFICATION_SMS_NUMBER = "5149656130";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    
    // 1. Log to Google Sheet
    sheet.appendRow([
      data.createdAt,
      data.name || "N/A",
      data.phone || "N/A",
      data.email || "N/A",
      data.estimateTotal,
      data.totalWeight,
      JSON.stringify(data.breakdown),
      data.language,
      data.pageUrl
    ]);

    const nameStr = data.name ? data.name : "Un client";
    const estimateStr = "$" + data.estimateTotal + " CAD";
    const timestamp = new Date(data.createdAt).toLocaleString('fr-CA');

    // 2. Email Notification Logic
    if (data.email) {
      const emailBody = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #D4AF37; border-radius: 10px;">
          <h2 style="color: #D4AF37;">Nouveau Lead Estimation Or</h2>
          <p><strong>Nom:</strong> ${data.name || "Non fourni"}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Téléphone:</strong> ${data.phone || "Non fourni"}</p>
          <hr/>
          <p style="font-size: 1.2em;"><strong>Estimation Totale:</strong> ${estimateStr}</p>
          <p><strong>Poids Cumulé:</strong> ${data.totalWeight}g</p>
          <p><strong>Détails:</strong> ${JSON.stringify(data.breakdown)}</p>
          <hr/>
          <p style="font-size: 0.8em; color: #666;">Soumis le ${timestamp} depuis ${data.pageUrl}</p>
        </div>
      `;
      
      GmailApp.sendEmail(NOTIFICATION_EMAIL, "Nouveau Lead Estimation Or - " + estimateStr, "", {
        htmlBody: emailBody,
        name: "Achat Or Montréal Bot"
      });
    }

    // 3. SMS Notification Logic
    if (data.phone) {
      const smsMessage = `Nouvelle estimation: ${nameStr}. Tél: ${data.phone}. Total: ${estimateStr}. Date: ${timestamp}. Voir Google Sheet pour détails.`;
      sendSmsNotification(NOTIFICATION_SMS_NUMBER, smsMessage);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log(err.toString());
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Sends an SMS notification.
 * Implementation depends on your chosen provider (Twilio, ClickSend, etc.)
 */
function sendSmsNotification(to, body) {
  // Option A: Log to Apps Script Console (Default placeholder)
  Logger.log("SMS to " + to + ": " + body);
  
  // Option B: Twilio Example (Requires accountSid and authToken in Script Properties)
  /*
  const props = PropertiesService.getScriptProperties();
  const sid = props.getProperty('TWILIO_SID');
  const token = props.getProperty('TWILIO_TOKEN');
  const from = props.getProperty('TWILIO_PHONE');
  
  if (!sid || !token) return;

  const payload = {
    "Body": body,
    "From": from,
    "To": "+1" + to
  };
  const options = {
    "method": "post",
    "payload": payload,
    "headers": {
      "Authorization": "Basic " + Utilities.base64Encode(sid + ":" + token)
    },
    "muteHttpExceptions": true
  };
  UrlFetchApp.fetch("https://api.twilio.com/2010-04-01/Accounts/" + sid + "/Messages.json", options);
  */
}
