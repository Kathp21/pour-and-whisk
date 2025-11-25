import { useEffect, useState, Fragment } from 'react'

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'READY' | 'COMPLETED' | 'CANCELLED'

export interface OrderItemOption {
    name_snapshot: string
    price_delta_snapshot_cents: number
}

export interface OrderItem {
    item_id: string
    quantity: number
    name_snapshot: string
    price_each_cents: string
    options: OrderItemOption[]
}

export interface Order {
    id: string
    order_number: string
    customer_name: string
    pickup_time: string
    status: OrderStatus
    total_cents: number
    tax_cents: number
    tip_cents: number
    items: OrderItem[]
    created_at: string
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all' | 'ALL'>('ALL')
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

    useEffect(() => {
        fetchOrders()
    }, [statusFilter])

    async function fetchOrders() {
        try {
            const adminToken = localStorage.getItem('adminToken')
            if (!adminToken) {
                console.error('No admin token found')
                return
            }
            
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/orders`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminToken}`,
                },
            })
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired or invalid, redirect to login
                    localStorage.removeItem('adminToken')
                    window.location.href = '/admin/login'
                    return
                }
                throw new Error(`Failed to fetch orders: ${response.status}`)
            }
            const data = await response.json()
            // API returns { orders: [...] }
            const ordersArray = Array.isArray(data) ? data : (data.orders || data.data || [])
            
            // Filter by status if not 'ALL'
            let filteredOrders = ordersArray
            if (statusFilter !== 'all' && statusFilter !== 'ALL') {
                filteredOrders = ordersArray.filter((order: Order) => order.status === statusFilter)
            }
            
            setOrders(filteredOrders)
        } catch (error) {
            console.error('Error fetching orders:', error)
            setOrders([]) // Ensure orders is always an array
        }
    }

    async function updateOrderStatus(id: string, next: OrderStatus) {
        try {
            const adminToken = localStorage.getItem('adminToken')
            if (!adminToken) {
                console.error('No admin token found')
                return
            }
            
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/orders/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify({ status: next }),
            })
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired or invalid, redirect to login
                    localStorage.removeItem('adminToken')
                    window.location.href = '/admin/login'
                    return
                }
                throw new Error(`Failed to update order status: ${response.status}`)
            }
            fetchOrders()
        } catch (error) {
            console.error('Error updating order status:', error)
        }
    }

    function getNextStatus(status: OrderStatus): OrderStatus | null {
        if (status === 'PENDING') return 'IN_PROGRESS'
        if (status === 'IN_PROGRESS') return 'READY'
        if (status === 'READY') return 'COMPLETED'
        return null
    }

    // Helper function to format cents to dollars
    // Handles different scales: regular cents (divide by 100) vs scaled cents (divide by 10000)
    function formatCentsToDollars(cents: number | string): string {
        const centsNum = Number(cents)
        // If the number is very large (>= 1000000), it's likely in 10000x scale
        // Otherwise, treat as regular cents (divide by 100)
        if (centsNum >= 1000000) {
            return (centsNum / 10000).toFixed(2)
        } else {
            // Regular cents: divide by 100
            return (centsNum / 100).toFixed(2)
        }
    }

    return (
        <div className="px-6 py-4 md:px-12">
            <h1 className="text-2xl text-text-light font-bold mb-4">Orders</h1>

            {/* Status Filter: */}
            <div className="flex gap-2 mb-4">
            {['ALL', 'PENDING', 'IN_PROGRESS', 'READY', 'COMPLETED'].map(s => (
            <button
                key={s}
                onClick={() => setStatusFilter(s as OrderStatus | 'all' | 'ALL')}
                className={`px-3 py-1 rounded-full text-sm ${
                statusFilter === s ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-100'
                }`}
            >
                {s.replace('_', ' ')}
            </button>
            ))}
        </div>

        {/* Table */}
        <table className="w-full text-sm border-collapse">
            <thead>
            <tr className="border-b border-slate-800 text-text-light">
                <th className="py-2 text-left">Order #</th>
                <th className="py-2 text-left">Customer</th>
                <th className="py-2 text-left">Pickup</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-right">Total</th>
                <th className="py-2 text-right">Actions</th>
            </tr>
            </thead>
            <tbody>
            {Array.isArray(orders) && orders.length > 0 ? orders.map(o => {
                const next = getNextStatus(o.status)
                const isExpanded = expandedOrderId === o.id
                
                // Format pickup_time to match formatTimeDisplay from CheckoutPage
                // Converts "HH:MM" format (e.g., "01:45") to "H:MM AM/PM" format (e.g., "1:45 AM")
                const formatPickupTime = (timeStr: string) => {
                    if (!timeStr) return ''
                    // If it's already in "HH:MM" format, convert to 12-hour format matching formatTimeDisplay
                    if (timeStr.match(/^\d{2}:\d{2}$/)) {
                        const [hours, minutes] = timeStr.split(':').map(Number)
                        const period = hours >= 12 ? 'PM' : 'AM'
                        // Match formatTimeDisplay logic: hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
                        const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
                        return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`
                    }
                    // Fallback: try to parse as date/time string
                    try {
                        const date = new Date(timeStr)
                        if (!isNaN(date.getTime())) {
                            const hours = date.getHours()
                            const minutes = date.getMinutes()
                            const period = hours >= 12 ? 'PM' : 'AM'
                            const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
                            return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`
                        }
                    } catch {
                        // If parsing fails, return as-is
                    }
                    return timeStr
                }
                
                return (
                <Fragment key={o.id}>
                <tr className="border-b border-slate-900 hover:bg-slate-800/50 cursor-pointer" onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}>
                    <td className="py-2">{o.order_number}</td>
                    <td className="py-2">{o.customer_name}</td>
                    <td className="py-2">{formatPickupTime(o.pickup_time)}</td>
                    <td className="py-2">{o.status.replace('_', ' ')}</td>
                    <td className="py-2 text-right">${formatCentsToDollars(o.total_cents)}</td>
                    <td className="py-2 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                    {next && (
                        <button
                        onClick={() => updateOrderStatus(o.id, next)}
                        className="px-3 py-1 rounded bg-emerald-500 text-slate-950 text-xs hover:bg-emerald-400"
                        >
                        Mark {next.replace('_', ' ')}
                        </button>
                    )}
                    </td>
                </tr>
                {isExpanded && (
                    <tr key={`${o.id}-details`} className="border-b border-slate-900 bg-slate-800/30">
                        <td colSpan={6} className="py-4 px-4">
                            <div className="space-y-4">
                                {/* Items */}
                                <div>
                                    <div className="text-sm font-semibold text-text-light mb-2">Items:</div>
                                    <div className="space-y-2">
                                        {o.items.map((item, idx) => (
                                            <div key={item.item_id || idx} className="pl-4 border-l-2 border-slate-700">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="font-medium text-text-light">
                                                            {item.quantity}x {item.name_snapshot}
                                                        </div>
                                                        {item.options && item.options.length > 0 && (
                                                            <div className="text-xs text-text-light/60 mt-1">
                                                                {item.options.map((opt, optIdx) => (
                                                                    <span key={optIdx}>
                                                                        {opt.name_snapshot}
                                                                        {optIdx < item.options.length - 1 ? ' • ' : ''}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-text-light">
                                                        ${formatCentsToDollars(item.price_each_cents)} each
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Price Breakdown */}
                                <div className="pt-2 border-t border-slate-700">
                                    <div className="flex justify-between text-sm text-text-light/80 mb-1">
                                        <span>Tax:</span>
                                        <span>${formatCentsToDollars(o.tax_cents)}</span>
                                    </div>
                                    {Number(o.tip_cents) > 0 && (
                                        <div className="flex justify-between text-sm text-text-light/80 mb-1">
                                            <span>Tip:</span>
                                            <span>${formatCentsToDollars(o.tip_cents)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm font-semibold text-text-light mt-2 pt-2 border-t border-slate-700">
                                        <span>Total:</span>
                                        <span>${formatCentsToDollars(o.total_cents)}</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                )}
                </Fragment>
                )
            }) : (
                <tr>
                    <td colSpan={6} className="py-8 text-center text-text-light/60">
                        No orders found
                    </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>
    )

}