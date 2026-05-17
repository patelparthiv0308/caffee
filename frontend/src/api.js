import fallbackProducts from './data/mockProducts';

const LOCAL_BASE_URL = 'http://127.0.0.1:8000';
const BIN_URL = 'https://extendsclass.com/api/json-storage/bin/fadeccf';

// Determine if we are loaded over HTTPS (live site).
const isSecureLive = window.location.protocol === 'https:';

// Initialize localStorage databases if not present
if (!localStorage.getItem('aether_products')) {
  localStorage.setItem('aether_products', JSON.stringify(fallbackProducts));
}
if (!localStorage.getItem('aether_orders')) {
  localStorage.setItem('aether_orders', JSON.stringify([]));
}
if (!localStorage.getItem('aether_store_open')) {
  localStorage.setItem('aether_store_open', 'true');
}

// Cloud Synchronizer Helper with a built-in Multi-Device Merger Engine
async function getSyncedOrders() {
  try {
    const res = await fetch(BIN_URL);
    if (!res.ok) return JSON.parse(localStorage.getItem('aether_orders') || '[]');
    const cloudOrders = await res.json();
    if (!Array.isArray(cloudOrders)) return JSON.parse(localStorage.getItem('aether_orders') || '[]');

    // Get current local orders
    const localOrders = JSON.parse(localStorage.getItem('aether_orders') || '[]');
    
    // Merge cloud orders and local orders matching by ID to prevent overwriting
    const merged = [...cloudOrders];
    let hasNewLocalOrders = false;

    localOrders.forEach(local => {
      if (local && local.id && !merged.some(c => c && c.id === local.id)) {
        merged.push(local);
        hasNewLocalOrders = true;
      }
    });

    // Update localStorage with merged list
    localStorage.setItem('aether_orders', JSON.stringify(merged));

    // If there were local orders not yet in the cloud, sync them back
    if (hasNewLocalOrders) {
      console.log("[Aether Sync] Merged new local orders to cloud.");
      fetch(BIN_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      }).catch(e => console.warn("[Aether Sync] Background merge sync failed:", e));
    }

    return merged;
  } catch (e) {
    console.warn("[Aether Sync] Failed to fetch from cloud, using local storage:", e);
    return JSON.parse(localStorage.getItem('aether_orders') || '[]');
  }
}

async function syncOrders(orders) {
  try {
    await fetch(BIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orders)
    });
  } catch (e) {
    console.warn("[Aether Sync] Failed to sync to cloud:", e);
  }
}

export const api = {
  getProducts: async () => {
    if (isSecureLive) {
      console.log("[Aether Live API] Running in Serverless HTTPS Mode. Fetching local products.");
      return JSON.parse(localStorage.getItem('aether_products'));
    }
    try {
      const res = await fetch(`${LOCAL_BASE_URL}/api/products/`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn("[Aether API] Local server unreachable. Falling back to client-side database.");
      return JSON.parse(localStorage.getItem('aether_products'));
    }
  },

  getStoreStatus: async () => {
    if (isSecureLive) {
      return { is_open: localStorage.getItem('aether_store_open') === 'true' };
    }
    try {
      const res = await fetch(`${LOCAL_BASE_URL}/api/store-status/`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (e) {
      return { is_open: localStorage.getItem('aether_store_open') === 'true' };
    }
  },

  placeOrder: async (orderData) => {
    let orders = [];
    try {
      orders = await getSyncedOrders();
    } catch (e) {}
    if (!orders || !Array.isArray(orders)) {
      orders = JSON.parse(localStorage.getItem('aether_orders') || '[]');
    }

    const newOrder = {
      ...orderData,
      id: 'ord_' + Math.random().toString(36).substr(2, 9),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    orders.push(newOrder);
    localStorage.setItem('aether_orders', JSON.stringify(orders));
    
    // Sync to cloud
    await syncOrders(orders);

    if (isSecureLive) {
      return { success: true, order_id: newOrder.id };
    }

    try {
      const res = await fetch(`${LOCAL_BASE_URL}/api/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (e) {
      return { success: true, order_id: newOrder.id };
    }
  },

  getOrderStatus: async (orderId) => {
    let orders = [];
    try {
      orders = await getSyncedOrders();
    } catch (e) {}
    if (!orders || !Array.isArray(orders)) {
      orders = JSON.parse(localStorage.getItem('aether_orders') || '[]');
    }

    const order = orders.find(o => o && o.id === orderId);
    if (isSecureLive || (orderId && orderId.startsWith('ord_'))) {
      return order ? { status: order.status } : { status: 'pending' };
    }
    try {
      const res = await fetch(`${LOCAL_BASE_URL}/api/orders/${orderId}/status/`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (e) {
      return order ? { status: order.status } : { status: 'pending' };
    }
  },

  toggleStock: async (productId) => {
    const products = JSON.parse(localStorage.getItem('aether_products') || '[]');
    const updated = products.map(p => {
      if (p.id === productId) {
        return { ...p, is_available: !p.is_available };
      }
      return p;
    });
    localStorage.setItem('aether_products', JSON.stringify(updated));

    if (isSecureLive) {
      return { success: true };
    }
    try {
      const res = await fetch(`${LOCAL_BASE_URL}/api/products/${productId}/toggle-stock/`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (e) {
      return { success: true };
    }
  },

  cancelOrder: async (orderId) => {
    let orders = [];
    try {
      orders = await getSyncedOrders();
    } catch (e) {}
    if (!orders || !Array.isArray(orders)) {
      orders = JSON.parse(localStorage.getItem('aether_orders') || '[]');
    }

    const updated = orders.map(o => o && o.id === orderId ? { ...o, status: 'Cancelled' } : o);
    localStorage.setItem('aether_orders', JSON.stringify(updated));
    await syncOrders(updated);

    if (isSecureLive || (orderId && orderId.startsWith('ord_'))) {
      return { success: true };
    }
    try {
      const res = await fetch(`${LOCAL_BASE_URL}/api/orders/${orderId}/status/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' })
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (e) {
      return { success: true };
    }
  }
};
