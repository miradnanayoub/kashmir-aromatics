import Link from 'next/link';

// --- Types ---
interface LineItem {
  id: number;
  name: string;
  quantity: number;
  total: string;
  image: { src: string } | undefined;
}

interface OrderData {
  id: number;
  status: string;
  total: string;
  shipping_total: string;
  currency_symbol: string;
  line_items: LineItem[];
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    address_1: string;
    city: string;
    state: string;
    postcode: string;
  };
  payment_method_title: string;
}

// --- Fetcher with Error Logging ---
async function getOrder(orderId: string) {
  const url = `${process.env.WORDPRESS_SITE_URL}/wp-json/wc/v3/orders/${orderId}`;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  console.log(`Fetching Order: ${url}`); 

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { error: `API Error ${res.status}: ${errorText}` };
    }
    
    const data = await res.json();
    return { data };

  } catch (error: any) {
    return { error: `Network Error: ${error.message}` };
  }
}

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId: string }>;
}) {
  const { orderId } = await searchParams;

  // 1. Fetch the data (or the error)
  const { data: order, error } = await getOrder(orderId);

  // 2. If there is an error, SHOW IT on screen instead of 404
  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-red-50 text-red-800">
        <h1 className="text-2xl font-bold mb-4">Something went wrong fetching the order</h1>
        <p className="font-mono bg-white p-4 rounded border border-red-200">{error || "Unknown Error"}</p>
        <p className="mt-4 text-sm text-gray-600">
           Attempted Order ID: {orderId}
        </p>
        <Link href="/" className="mt-6 underline">Return Home</Link>
      </div>
    );
  }

  // 3. Success View 
  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- HEADER SECTION --- */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
             <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="text-3xl font-serif text-gray-900 mb-2">Thank you for your order</h1>
          <p className="text-gray-500">
            Order <span className="font-mono font-bold text-gray-900">#{order.id}</span> is confirmed.
          </p>
          {/* --- NEW EMAIL CONFIRMATION LINE --- */}
          <p className="text-sm text-gray-500 mt-2">
            Order details sent to <span className="font-medium text-gray-900">{order.billing.email}</span>
          </p>
        </div>

        {/* --- RECEIPT CARD --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Items Ordered</h2>
            <ul className="divide-y divide-gray-100">
              {order.line_items.map((item: LineItem) => (
                <li key={item.id} className="py-4 flex items-start">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                    {item.image?.src ? (
                      <img src={item.image.src} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">IMG</div>
                    )}
                  </div>
                  <div className="ml-4 flex-1 flex flex-row justify-between items-start gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                      {order.currency_symbol}{parseFloat(item.total).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 px-6 py-6 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>{order.currency_symbol}{(parseFloat(order.total) - parseFloat(order.shipping_total)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>Shipping</span>
              <span>{parseFloat(order.shipping_total) > 0 ? `${order.currency_symbol}${order.shipping_total}` : 'Free'}</span>
            </div>
            <div className="flex justify-between text-lg font-medium text-gray-900 pt-4 border-t border-gray-200">
              <span>Total</span>
              <span>{order.currency_symbol}{parseFloat(order.total).toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-200">
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Shipping To</h4>
                <address className="not-italic text-sm text-gray-600">
                  {order.billing.first_name} {order.billing.last_name}<br />
                  {order.billing.address_1}<br />
                  {order.billing.city}, {order.billing.state} {order.billing.postcode}
                </address>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment Method</h4>
                <p className="text-sm text-gray-600">{order.payment_method_title}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}