import express from 'express';
import Reservation from '../models/Reservation.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create reservation (public)
router.post('/', async (req, res, next) => {
  try {
    const {
      products,
      totalAmount,
      reservedAt,
      expiresAt,
      deliveryType,
      paymentMethod,
      shippingCost,
      shippingAddress,
      customerEmail,
      customerName,
    } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required reservation data',
      });
    }

    const productIds = products.map((p) => p._id || p.productId).filter(Boolean);
    if (!productIds.length) {
      return res.status(400).json({
        success: false,
        message: 'No valid products provided',
      });
    }

    const dbProducts = await Product.find({ _id: { $in: productIds } });
    const unavailable = dbProducts.filter((p) => !p.disponible);
    if (unavailable.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Some products are already reserved or unavailable',
        data: unavailable.map((p) => ({ id: p._id, title: p.title })),
      });
    }

    const normalizedProducts = products.map((p) => ({
      productId: p._id || p.productId,
      title: p.title,
      price: p.price,
    }));

    // Generate unique order number: ORD-YYYYMMDD-XXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Count reservations for today
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    
    const count = await Reservation.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
    
    const orderNumber = `ORD-${dateStr}-${String(count + 1).padStart(3, '0')}`;
    
    console.log('Generated order number:', orderNumber);

    const reservationData = {
      orderNumber,
      products: normalizedProducts,
      totalAmount,
      reservedAt: reservedAt ? new Date(reservedAt) : new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'active',
      deliveryType: deliveryType || 'pickup',
      paymentMethod: paymentMethod || 'cash',
      shippingCost: shippingCost || 0,
      customerEmail: customerEmail || '',
      customerName: customerName || '',
    };

    // Add shipping address only if delivery type is delivery
    if (deliveryType === 'delivery' && shippingAddress) {
      reservationData.shippingAddress = shippingAddress;
    }

    const reservation = await Reservation.create(reservationData);

    console.log('Reservation created with orderNumber:', reservation.orderNumber);

    await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { disponible: false } }
    );

    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
});

// Get all reservations (admin)
router.get('/', protect, async (req, res, next) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json({ success: true, data: reservations });
  } catch (error) {
    next(error);
  }
});

// Update reservation status (admin)
router.patch('/:id/status', protect, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['canceled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status update',
      });
    }

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    reservation.status = status;
    if (status === 'canceled') {
      reservation.canceledAt = new Date();
      const productIds = reservation.products.map((p) => p.productId);
      await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { disponible: true } }
      );
      await Reservation.deleteOne({ _id: reservation._id });
      return res.json({ success: true, deleted: true, data: { _id: reservation._id } });
    }
    if (status === 'completed') {
      reservation.completedAt = new Date();
    }

    await reservation.save();

    res.json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
});

export default router;
