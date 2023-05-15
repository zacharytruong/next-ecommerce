import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { AddCartType } from '@/types/AddCartType';
import { prisma } from '@/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15'
});

const calculateOrderAmount = (items: AddCartType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    return acc + +item.unit_amount! * item.quantity!;
  }, 0);
  return totalPrice;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get user
  const userSession = await getServerSession(req, res, authOptions);
  if (!userSession?.user) {
    res.status(403).json({ message: 'Not logged in' });
    return;
  }

  // Extract data from the body
  const { items, payment_intent_id } = req.body;
  // Create order data
  const orderData = {
    user: {
      connect: {
        id: userSession.user?.id
      }
    },
    amount: calculateOrderAmount(items),
    currency: 'usd',
    status: 'pending',
    paymentIntentId: payment_intent_id,
    products: {
      create: items.map((item) => ({
        name: item.name,
        description: item.description || null,
        unit_amount: +item.unit_amount,
        image: item.image,
        quantity: item.quantity
      }))
    }
  };

  // Check if payment intent exists just update the order
  if (payment_intent_id) {
    // Update the order with prisma
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );
    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        {
          amount: calculateOrderAmount(items)
        }
      );
      // Fetch order with product ids
      const existing_order = await prisma.order.findFirst({
        where: {
          paymentIntentId: payment_intent_id
        },
        include: {
          products: true
        }
      });
      if (!existing_order) {
        res.status(400).json({ message: 'Invalid Payment Intent' });
      }
      // Update the order with new products
      const updated_order = await prisma.order.update({
        where: {
          id: existing_order?.id
        },
        data: {
          amount: calculateOrderAmount(items),
          products: {
            deleteMany: {},
            create: items.map((item) => ({
              name: item.name,
              description: item.description || null,
              unit_amount: +item.unit_amount,
              image: item.image,
              quantity: item.quantity
            }))
          }
        }
      });
      res.status(200).json({ paymentIntent: updated_intent });
    }
  } else {
    // Create a new order with prisma
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true
      }
    });
    orderData.paymentIntentId = paymentIntent.id;
    const newOrder = await prisma.order.create({
      data: orderData
    });
    res.status(200).json({ paymentIntent });
  }
}
