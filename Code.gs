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