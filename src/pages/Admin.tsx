import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/index'; 
const STATUS_CONFIG = {
  unconfirmed: {
    label: '訂單尚待確認',
    style: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  },
  pending: {
    label: '待取貨',
    style: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  },
  collected: {
    label: '已取貨',
    style: 'bg-green-100 text-green-700 hover:bg-green-200',
  },
  completed: {
    label: '訂單完成',
    style: 'bg-gray-100 text-gray-400 cursor-not-allowed',  // 最後一步不能再按
  },
};

// 狀態順序
const STATUS_ORDER = ['unconfirmed', 'pending', 'collected', 'completed'] as const;

// 定義一筆訂單長什麼樣子
type OrderItem = {
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
};

type Order = {
  order_id: string;
  createdAt: string;
  status?: 'unconfirmed' | 'pending' | 'collected' | 'completed';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupDate: string;
  pickupTime: string;
  specialNotes?: string;
  totalAmount: number;
  items: OrderItem[];
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // 頁面一載入，就去 localStorage 拿資料
  useEffect(() => {
    const saved = localStorage.getItem('breadOrders');
    if (saved) {
      const parsed = JSON.parse(saved);
      // 最新的訂單排在最上面
      setOrders(parsed.reverse());
    }
  }, []);

  // 刪除單筆訂單
  const deleteOrder = async (order_id: string) => {
    const { supabase } = await import('@/lib/supabase');
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('order_id', order_id);

    if (!error) {
      setOrders(orders.filter((o) => o.order_id !== order_id));
    }
  };

  const toggleStatus = async (order_id: string, direction: 'forward' | 'backward') => {
    const { supabase } = await import('@/lib/supabase');

    const updated = orders.map((o) => {
      if (o.order_id !== order_id) return o;
      const currentStatus = o.status || 'unconfirmed';
      const currentIndex = STATUS_ORDER.indexOf(currentStatus);
      if (direction === 'forward' && currentIndex === STATUS_ORDER.length - 1) return o;
      if (direction === 'backward' && currentIndex === 0) return o;
      return {
        ...o,
        status: STATUS_ORDER[currentIndex + (direction === 'forward' ? 1 : -1)],
      };
    });

    const target = updated.find((o) => o.order_id === order_id);
    if (target) {
      await supabase
        .from('orders')
        .update({ status: target.status })
        .eq('order_id', order_id);
    }

    setOrders(updated);
  };

    // 同時套用日期和狀態篩選
    const filteredOrders = orders.filter((o) => {
        const matchDate = filterDate ? o.pickupDate === filterDate : true;
        const matchStatus = filterStatus ? (o.status || 'unconfirmed') === filterStatus : true;
        return matchDate && matchStatus;
    });
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-2">📋 後台訂單管理</h1>
      <p className="text-gray-500 mb-4">共 {filteredOrders.length} 筆訂單</p>

        {/* 篩選列 */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">取貨日期</label>
            <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-300"
            />
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">訂單狀態</label>
            <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-300"
            >
            <option value="">全部狀態</option>
            {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
            </select>
        </div>

        {/* 清除篩選按鈕 */}
        {(filterDate || filterStatus) && (
            <div className="flex items-end">
            <button
                onClick={() => { setFilterDate(''); setFilterStatus(''); }}
                className="text-sm text-gray-400 hover:text-gray-600 underline pb-2"
            >
                清除篩選
            </button>
            </div>
        )}
        </div>
    
      {filteredOrders.length === 0 ? (
        <p className="text-gray-400">目前還沒有訂單</p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-2xl shadow p-6 border border-gray-100"
            >
        {/* 訂單標題列 */}
        <div className="flex justify-between items-center mb-4">
        <div>
            <p className="text-xs text-gray-400">{order.createdAt}</p>
            <p className="font-mono text-sm text-gray-500">{order.order_id}</p>
        </div>
        <div className="flex items-center gap-2">
        <button
            onClick={() => toggleStatus(order.order_id, 'backward')}
            disabled={!order.status || order.status === 'unconfirmed'}
            className="text-sm px-2 py-1 rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
            ←
        </button>

        {/* 狀態標籤 */}
        <span
            className={`text-sm px-3 py-1 rounded-full font-medium ${
            STATUS_CONFIG[order.status || 'unconfirmed'].style
            }`}
        >
            {STATUS_CONFIG[order.status || 'unconfirmed'].label}
        </span>

        {/* 進一步按鈕 */}
        <button
            onClick={() => toggleStatus(order.order_id, 'forward')}
            disabled={order.status === 'completed'}
            className="text-sm px-2 py-1 rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
            →
        </button>
        </div>
    </div>

              {/* 客人資訊 + 取貨資訊 */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-semibold mb-2">👤 顧客資訊</p>
                  <p>姓名：{order.customerName}</p>
                  <p>電話：{order.customerPhone}</p>
                  <p>信箱：{order.customerEmail}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-semibold mb-2">🗓️ 取貨資訊</p>
                  <p>日期：{order.pickupDate}</p>
                  <p>時段：{order.pickupTime}</p>
                  {order.specialNotes && <p>備註：{order.specialNotes}</p>}
                </div>
              </div>

              {/* 訂購品項 */}
              <div className="text-sm mb-4">
                <p className="font-semibold mb-2">🍞 訂購品項</p>
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-400 text-left border-b">
                      <th className="pb-1">品名</th>
                      <th className="pb-1 text-center">數量</th>
                      <th className="pb-1 text-right">小計</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((item, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-1">{item.productName}</td>
                        <td className="py-1 text-center">x {item.quantity}</td>
                        <td className="py-1 text-right">{formatPrice(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-right font-bold mt-2">
                  總計：{formatPrice(order.totalAmount)}
                </p>
              </div>

              {/* 刪除按鈕 */}
              <div className="text-right">
                <button
                  onClick={() => deleteOrder(order.order_id)}
                  className="text-sm text-red-400 hover:text-red-600 underline"
                >
                  刪除此訂單
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}