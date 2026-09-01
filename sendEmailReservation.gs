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
      <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="width:94px;vertical-align:top;padding-right:12px;">
              ${produit.imageUrl
                ? `<img src="${produit.imageUrl}" alt="${produit.title || 'Produit'}" style="width:88px;height:88px;object-fit:cover;border-radius:10px;border:1px solid #e5e7eb;display:block;"/>`
                : `<div style="width:88px;height:88px;border-radius:10px;border:1px solid #e5e7eb;background:#f8fafc;"></div>`}
            </td>
            <td style="vertical-align:top;">
              <div style="font-weight:700;color:#111827;font-size:15px;">${produit.title || ''}</div>
              <div style="color:#6b7280;font-size:13px;line-height:1.5;margin-top:4px;">${produit.description || ''}</div>
              <div style="margin-top:8px;font-weight:700;color:#4c6a65;font-size:15px;">CHF ${Number(produit.price || 0).toFixed(2)}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const paymentBlock = deliveryType === 'delivery'
    ? paymentMethod === 'twint'
      ? `
        <div style="margin-top: 12px; padding: 14px; border-radius: 10px; background: #fff7ed; border-left: 4px solid #f59e0b;">
          <p style="margin: 0 0 10px 0;"><strong>Méthode choisie: TWINT</strong></p>
          <p style="margin: 0;"><strong>Paiement TWINT:</strong> +41 78 758 17 33</p>
          <p style="margin: 10px 0 0 0; font-size: 13px; color: #7c2d12;"><strong>Important:</strong> merci d'indiquer le numéro de commande <span style="font-family: monospace; background:#fff3cd; padding:2px 6px; border-radius:4px;">${orderNumber}</span> dans la référence du paiement.</p>
        </div>
      `
      : `
        <div style="margin-top: 12px; padding: 14px; border-radius: 10px; background: #eff6ff; border-left: 4px solid #2563eb;">
          <p style="margin: 0 0 10px 0;"><strong>Méthode choisie: Carte de crédit ou débit</strong></p>
          <p style="margin: 0;"><strong>Lien de paiement:</strong> <a href="https://revolut.me/elop29" style="color:#1d4ed8;">revolut.me/elop29</a></p>
          <p style="margin: 10px 0 0 0; font-size: 13px; color: #1e3a8a;"><strong>Important:</strong> merci d'indiquer le numéro de commande <span style="font-family: monospace; background:#fff3cd; padding:2px 6px; border-radius:4px;">${orderNumber}</span> dans la référence du paiement.</p>
        </div>
      `
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
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f6f8; margin: 0; padding: 20px 12px;">
        <div style="max-width: 700px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4c6a65 0%, #3f5a56 100%); padding: 30px 28px; border-radius: 18px 18px 0 0; color: #fff; text-align: center; box-shadow: 0 8px 28px rgba(76,106,101,0.25);">
            <h1 style="margin: 0; font-size: 30px; letter-spacing: 0.02em;">BRUNO PESENTI</h1>
            <p style="margin: 8px 0 0 0; color: #deb887;">Le Cabinotier</p>
          </div>

          <div style="border: 1px solid #e5e7eb; border-top: 0; border-radius: 0 0 18px 18px; padding: 28px; background: #fff; box-shadow: 0 10px 30px rgba(15,23,42,0.08);">
            <h2 style="margin: 0 0 18px 0; color: #4c6a65;">Confirmation de ${deliveryType === 'delivery' ? 'commande' : 'réservation'}</h2>
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Merci pour votre ${deliveryType === 'delivery' ? 'commande' : 'réservation'} chez Bruno Pesenti.</p>

            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; margin: 22px 0;">
              <p style="margin: 0; color: #6b7280;">Numéro de commande</p>
              <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: 700; color: #4c6a65;">${orderNumber}</p>
            </div>

            <h3 style="margin: 24px 0 12px 0; color: #111827;">Produits</h3>
            <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff;">
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

            <div style="margin-top: 22px; padding: 16px; background: #f0f7f6; border-radius: 10px; border-left: 4px solid #4c6a65;">
              <p style="margin: 0 0 8px 0;"><strong>Questions ou modification de la réservation / commande ?</strong></p>
              <p style="margin: 0; font-size: 14px; color: #334155;">
                Contactez Bruno Pesenti<br>
                Téléphone: <a href="tel:0227317575" style="color:#1d4ed8; text-decoration:none;">022 731 75 75</a><br>
                E-mail: <a href="mailto:info.brunopesenti@gmail.com" style="color:#1d4ed8; text-decoration:none;">info.brunopesenti@gmail.com</a><br>
                Adresse: Rue des Corps-Saints 10, 1201 Genève
              </p>
            </div>

            <p style="margin-top: 20px;">Cordialement,<br><strong>Bruno Pesenti</strong></p>

            <p style="margin: 14px 0 0 0; font-size: 12px; color: #64748b; text-align:center;">
              Merci de conserver ce message pour le suivi de votre commande.
            </p>
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
    ...(deliveryType === 'delivery'
      ? paymentMethod === 'twint'
        ? [
            '',
            'Méthode choisie: TWINT',
            'Paiement TWINT: +41 78 758 17 33',
            `Important: indiquez le numéro de commande ${orderNumber} dans la référence du paiement.`,
          ]
        : [
            '',
            'Méthode choisie: Carte de crédit ou débit',
            'Lien de paiement: https://revolut.me/elop29',
            `Important: indiquez le numéro de commande ${orderNumber} dans la référence du paiement.`,
          ]
      : []),
    '',
    'Produits:',
    ...(produits || []).map((produit) => `- ${produit.title || ''} (CHF ${Number(produit.price || 0).toFixed(2)})`),
    '',
    deliveryType === 'delivery'
      ? 'Votre commande sera traitée après validation du paiement.'
      : 'Les produits sont réservés pendant 14 jours. Merci de venir les retirer à l’atelier.',
    '',
    'Questions ou modification de la réservation / commande :',
    'Téléphone: 022 731 75 75',
    'E-mail: info.brunopesenti@gmail.com',
    'Adresse: Rue des Corps-Saints 10, 1201 Genève',
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

function sendEmailConcours(emailTo, name, reveils) {
  const subject = 'Confirmation de votre participation au concours - Bruno Pesenti';

  const clientEmail = buildConcoursCustomerEmail({ name, reveils });
  const adminEmail = buildConcoursAdminEmail({ name, email: emailTo, reveils });

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

function buildConcoursCustomerEmail({ name, reveils }) {
  const htmlBody = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f6f8; margin: 0; padding: 20px 12px;">
        <div style="max-width: 700px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4c6a65 0%, #3f5a56 100%); padding: 30px 28px; border-radius: 18px 18px 0 0; color: #fff; text-align: center; box-shadow: 0 8px 28px rgba(76,106,101,0.25);">
            <h1 style="margin: 0; font-size: 30px; letter-spacing: 0.02em;">BRUNO PESENTI</h1>
            <p style="margin: 8px 0 0 0; color: #deb887;">Le Cabinotier</p>
          </div>

          <div style="border: 1px solid #e5e7eb; border-top: 0; border-radius: 0 0 18px 18px; padding: 28px; background: #fff; box-shadow: 0 10px 30px rgba(15,23,42,0.08);">
            <h2 style="margin: 0 0 18px 0; color: #4c6a65;">Confirmation de participation au concours</h2>
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Merci pour votre participation au concours de Bruno Pesenti ! Votre inscription a bien été enregistrée.</p>

            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; margin: 22px 0;">
              <p style="margin: 0; color: #6b7280;">Votre réponse</p>
              <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: 700; color: #4c6a65;">${reveils || 'N/A'}</p>
            </div>

            <p>Le tirage au sort sera effectué parmi les bonnes réponses. Le gagnant sera contacté par e-mail ou par téléphone.</p>

            <div style="margin-top: 22px; padding: 16px; background: #f0f7f6; border-radius: 10px; border-left: 4px solid #4c6a65;">
              <p style="margin: 0 0 8px 0;"><strong>Questions ?</strong></p>
              <p style="margin: 0; font-size: 14px; color: #334155;">
                Contactez Bruno Pesenti<br>
                Téléphone: <a href="tel:0227317575" style="color:#1d4ed8; text-decoration:none;">022 731 75 75</a><br>
                E-mail: <a href="mailto:info.brunopesenti@gmail.com" style="color:#1d4ed8; text-decoration:none;">info.brunopesenti@gmail.com</a><br>
                Adresse: Rue des Corps-Saints 10, 1201 Genève
              </p>
            </div>

            <p style="margin-top: 20px;">Bonne chance !<br><strong>Bruno Pesenti</strong></p>

            <p style="margin: 14px 0 0 0; font-size: 12px; color: #64748b; text-align:center;">
              Merci de conserver ce message comme preuve de votre participation.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const body = [
    `Bonjour ${name || ''},`,
    '',
    'Merci pour votre participation au concours de Bruno Pesenti ! Votre inscription a bien été enregistrée.',
    `Votre réponse: ${reveils || 'N/A'}`,
    '',
    'Le tirage au sort sera effectué parmi les bonnes réponses. Le gagnant sera contacté par e-mail ou par téléphone.',
    '',
    'Questions :',
    'Téléphone: 022 731 75 75',
    'E-mail: info.brunopesenti@gmail.com',
    'Adresse: Rue des Corps-Saints 10, 1201 Genève',
    '',
    'Bonne chance !',
    'Bruno Pesenti',
  ].join('\n');

  return { htmlBody, body };
}

function buildConcoursAdminEmail({ name, email, reveils }) {
  const subject = `Nouvelle participation au concours - ${name}`;

  const htmlBody = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 700px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #4c6a65;">Nouvelle participation au concours</h2>
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Réponse :</strong> ${reveils || 'N/A'}</p>
        </div>
      </body>
    </html>
  `;

  const body = [
    'Nouvelle participation au concours',
    `Nom: ${name}`,
    `Email: ${email}`,
    `Réponse: ${reveils || 'N/A'}`,
  ].join('\n');

  return { subject, htmlBody, body };
}