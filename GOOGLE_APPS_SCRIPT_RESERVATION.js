function doPost(e) {
  try {
    const data = e && e.parameter ? e.parameter : {};

    if (data.action !== 'demandeReservation' || !data.Email || !data.Name || !data.Produits || !data.OrderNumber) {
      return ContentService
        .createTextOutput(JSON.stringify({ successSecondemail: false, message: 'Invalid reservation payload' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const products = parseJsonField(data.Produits, []);
    const orderNumber = String(data.OrderNumber || 'N/A');
    const email = normalizeEmail(data.Email);
    const name = String(data.Name || '').trim();
    const deliveryType = String(data.DeliveryType || 'pickup');
    const paymentMethod = String(data.PaymentMethod || 'cash');
    const shippingCost = Number(data.ShippingCost || 0);
    const shippingAddress = parseJsonField(data.ShippingAddress, null);

    const result = sendEmailReservation(
      email,
      name,
      orderNumber,
      products,
      deliveryType,
      paymentMethod,
      shippingCost,
      shippingAddress,
    );

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Reservation doPost error: ' + error);
    return ContentService
      .createTextOutput(JSON.stringify({ successSecondemail: false, message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function parseJsonField(value, fallbackValue) {
  if (!value) {
    return fallbackValue;
  }

  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallbackValue;
  }
}

function sendEmailReservation(emailTo, name, orderNumber, produits, deliveryType, paymentMethod, shippingCost, shippingAddress) {
  const subtotal = (produits || []).reduce((sum, produit) => sum + Number(produit.price || 0), 0);
  const total = subtotal + shippingCost;
  const subject = deliveryType === 'delivery'
    ? 'Confirmation de votre commande - Bruno Pesenti'
    : 'Confirmation de votre réservation - Bruno Pesenti';

  const clientEmail = buildCustomerEmail({
    name,
    orderNumber,
    produits,
    subtotal,
    total,
    deliveryType,
    paymentMethod,
    shippingCost,
    shippingAddress,
  });

  const adminEmail = buildAdminEmail({
    customerName: name,
    customerEmail: emailTo,
    orderNumber,
    produits,
    subtotal,
    deliveryType,
    paymentMethod,
    shippingCost,
    total,
    shippingAddress,
  });

  const clientSuccess = sendReservationCustomerEmail(
    emailTo,
    subject,
    clientEmail.htmlBody,
    clientEmail.body,
  );

  const adminSuccess = sendReservationAdminEmail(
    adminEmail.subject,
    adminEmail.htmlBody,
    adminEmail.body,
    emailTo,
  );

  return {
    successSecondemail: clientSuccess,
    successAdminemail: adminSuccess,
  };
}

function buildCustomerEmail({
  name,
  orderNumber,
  produits,
  subtotal,
  total,
  deliveryType,
  paymentMethod,
  shippingCost,
  shippingAddress,
}) {
  const productsHtml = (produits || []).map((produit) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
        <div style="font-weight:700;color:#111827;">${produit.title || ''}</div>
        <div style="color:#6b7280;font-size:13px;line-height:1.4;">${produit.description || ''}</div>
        <div style="margin-top:4px;font-weight:700;color:#4c6a65;">CHF ${Number(produit.price || 0).toFixed(2)}</div>
      </td>
    </tr>
  `).join('');

  const paymentBlock = deliveryType === 'delivery'
    ? `<p><strong>Méthode de paiement :</strong> ${paymentMethod}</p>`
    : `<p><strong>Mode de retrait :</strong> Retrait en atelier</p>`;

  const shippingBlock = deliveryType === 'delivery' && shippingAddress
    ? `
      <div style="background: #f8fafc; padding: 16px; border-radius: 10px; margin-top: 18px;">
        <p style="margin: 0 0 8px 0;"><strong>Adresse de livraison :</strong></p>
        <p style="margin: 0; line-height: 1.7;">
          ${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}<br>
          ${shippingAddress.street || ''} ${shippingAddress.streetNumber || ''}<br>
          ${shippingAddress.postalCode || ''} ${shippingAddress.city || ''}<br>
          ${shippingAddress.canton || ''}<br>
          ${shippingAddress.phone || ''}
        </p>
      </div>
    `
    : '';

  const htmlBody = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #ffffff; margin: 0; padding: 0;">
        <div style="max-width: 680px; margin: 0 auto; padding: 24px;">
          <div style="background: linear-gradient(135deg, #4c6a65 0%, #3f5a56 100%); padding: 28px; border-radius: 16px 16px 0 0; color: #fff; text-align: center;">
            <h1 style="margin: 0; font-size: 30px; letter-spacing: 0.02em;">BRUNO PESENTI</h1>
            <p style="margin: 8px 0 0 0; color: #deb887;">Le Cabinotier</p>
          </div>

          <div style="border: 1px solid #e5e7eb; border-top: 0; border-radius: 0 0 16px 16px; padding: 28px; background: #fff;">
            <h2 style="margin: 0 0 18px 0; color: #4c6a65;">Confirmation de ${deliveryType === 'delivery' ? 'commande' : 'réservation'}</h2>
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Merci pour votre ${deliveryType === 'delivery' ? 'commande' : 'réservation'} chez Bruno Pesenti.</p>

            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; margin: 22px 0;">
              <p style="margin: 0; color: #6b7280;">Numéro de commande</p>
              <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: 700; color: #4c6a65;">${orderNumber}</p>
            </div>

            <h3 style="margin: 24px 0 12px 0; color: #111827;">Produits</h3>
            <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;padding:0 16px;">
              ${productsHtml}
            </table>

            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; margin-top: 18px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Sous-total</span><span>CHF ${subtotal.toFixed(2)}</span></div>
              ${deliveryType === 'delivery' ? `<div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Frais de livraison</span><span>CHF ${shippingCost.toFixed(2)}</span></div>` : ''}
              <div style="display: flex; justify-content: space-between; border-top: 2px solid #4c6a65; padding-top: 10px; margin-top: 10px; font-weight: 700; font-size: 18px;">
                <span>Total</span><span>CHF ${total.toFixed(2)}</span>
              </div>
            </div>

            <div style="margin-top: 20px; padding: 16px; background: #fff7ed; border-left: 4px solid #deb887; border-radius: 8px;">
              ${paymentBlock}
              ${deliveryType === 'pickup'
                ? '<p style="margin: 10px 0 0 0;">Les produits sont réservés pendant 14 jours. Merci de venir les retirer à l’atelier.</p>'
                : '<p style="margin: 10px 0 0 0;">Votre commande sera traitée après validation du paiement.</p>'}
            </div>

            ${shippingBlock}

            <p style="margin-top: 24px;">Cordialement,<br><strong>Bruno Pesenti</strong></p>
          </div>
        </div>
      </body>
    </html>
  `;

  const body = [
    `Bonjour ${name || ''},`,
    '',
    `Votre ${deliveryType === 'delivery' ? 'commande' : 'réservation'} chez Bruno Pesenti est bien enregistrée.`,
    `Numéro de commande: ${orderNumber}`,
    `Sous-total: CHF ${subtotal.toFixed(2)}`,
    deliveryType === 'delivery' ? `Livraison: CHF ${shippingCost.toFixed(2)}` : 'Retrait en atelier',
    `Total: CHF ${total.toFixed(2)}`,
    '',
    'Produits:',
    ...(produits || []).map((produit) => `- ${produit.title || ''} (CHF ${Number(produit.price || 0).toFixed(2)})`),
    '',
    deliveryType === 'delivery'
      ? 'Votre commande sera traitée après validation du paiement.'
      : 'Les produits sont réservés pendant 14 jours. Merci de venir les retirer à l’atelier.',
    '',
    'Cordialement,',
    'Bruno Pesenti',
  ].join('\n');

  return { htmlBody, body };
}

function buildAdminEmail({
  customerName,
  customerEmail,
  orderNumber,
  produits,
  subtotal,
  deliveryType,
  paymentMethod,
  shippingCost,
  total,
  shippingAddress,
}) {
  const subjectAdmin = `Nouvelle ${deliveryType === 'delivery' ? 'commande' : 'réservation'} - ${orderNumber}`;

  let productsHtml = '';
  for (const produit of produits) {
    productsHtml += `<li><strong>${produit.title}</strong> - CHF ${Number(produit.price || 0).toFixed(2)}</li>`;
  }

  const addressHtml = shippingAddress
    ? `<p><strong>Adresse livraison :</strong><br>${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}<br>${shippingAddress.street || ''} ${shippingAddress.streetNumber || ''}<br>${shippingAddress.postalCode || ''} ${shippingAddress.city || ''}<br>${shippingAddress.canton || ''}<br>${shippingAddress.phone || ''}</p>`
    : '';

  const htmlBody = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 700px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #4c6a65;">Nouvelle ${deliveryType === 'delivery' ? 'commande' : 'réservation'}</h2>
          <p><strong>Numéro :</strong> ${orderNumber}</p>
          <p><strong>Client :</strong> ${customerName}</p>
          <p><strong>Email :</strong> ${customerEmail}</p>
          <p><strong>Type :</strong> ${deliveryType}</p>
          <p><strong>Paiement :</strong> ${paymentMethod}</p>
          <p><strong>Sous-total :</strong> CHF ${subtotal.toFixed(2)}</p>
          <p><strong>Livraison :</strong> CHF ${shippingCost.toFixed(2)}</p>
          <p><strong>Total :</strong> CHF ${total.toFixed(2)}</p>
          ${addressHtml}
          <h3>Produits</h3>
          <ul>${productsHtml}</ul>
        </div>
      </body>
    </html>
  `;

  const body = [
    `Nouvelle ${deliveryType === 'delivery' ? 'commande' : 'réservation'}`,
    `Numéro: ${orderNumber}`,
    `Client: ${customerName}`,
    `Email: ${customerEmail}`,
    `Type: ${deliveryType}`,
    `Paiement: ${paymentMethod}`,
    `Sous-total: CHF ${subtotal.toFixed(2)}`,
    `Livraison: CHF ${shippingCost.toFixed(2)}`,
    `Total: CHF ${total.toFixed(2)}`,
  ].join('\n');

  return { subject: subjectAdmin, htmlBody, body };
}

function sendReservationCustomerEmail(emailTo, subject, htmlBody, body) {
  return sendMailSafe({
    to: emailTo,
    subject,
    htmlBody,
    body,
    name: 'Bruno Pesenti',
    replyTo: 'info.brunopesenti@gmail.com',
    noReply: true,
  });
}

function sendReservationAdminEmail(subject, htmlBody, body, customerEmail) {
  return sendMailSafe({
    to: 'info.brunopesenti@gmail.com',
    subject,
    htmlBody,
    body,
    name: 'Bruno Pesenti',
    replyTo: customerEmail,
    noReply: true,
  });
}

function sendMailSafe(message) {
  try {
    MailApp.sendEmail(message);
    return true;
  } catch (error) {
    Logger.log('MailApp.sendEmail failed for ' + message.to + ': ' + error);
    return false;
  }
}
