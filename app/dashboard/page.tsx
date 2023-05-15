import { prisma } from '@/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

const fetchOrders = async () => {
  const user = await getServerSession(authOptions);
  if (!user) {
    return null;
  }
  const orders = await prisma.order.findMany({
    where: {
      userId: user?.user?.id
    },
    include: {
      products: true
    }
  });
  return orders;
};

export default async function Dashboard() {
  const orders = await fetchOrders();
  if (orders === null) {
    return <div>You need to login to view your orders.</div>;
  }
  if (orders.length === 0) {
    return <h1>No orders</h1>;
  }
  return (
    <div>
      <h1 className="text-bold">Your Orders</h1>
      <div className="font-medium">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg">
            <h2>Order reference: {order.id}</h2>
            <p>Time: {new Date(order.createDate).toDateString()}</p>
            <p className="text-md py-2">
              Status:{' '}
              <span
                className={`${
                  order.status === 'complete' ? 'bg-teal-500' : 'bg-orange-500'
                } text-white`}
              >
                {order.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
