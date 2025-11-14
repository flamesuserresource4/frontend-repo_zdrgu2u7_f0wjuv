import { useEffect, useMemo, useState } from 'react'
import { ShoppingCart, Calendar, Coffee, MapPin, Info, Plus, Minus } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Header({ onTab, tab }) {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Coffee className="text-amber-600" />
          <span>Caffé Blue</span>
        </div>
        <nav className="flex items-center gap-2">
          <button onClick={() => onTab('about')} className={`px-3 py-2 rounded-md text-sm font-medium ${tab==='about'?'bg-amber-100 text-amber-800':'hover:bg-gray-100'}`}>About</button>
          <button onClick={() => onTab('menu')} className={`px-3 py-2 rounded-md text-sm font-medium ${tab==='menu'?'bg-amber-100 text-amber-800':'hover:bg-gray-100'}`}>Menu</button>
          <button onClick={() => onTab('reserve')} className={`px-3 py-2 rounded-md text-sm font-medium ${tab==='reserve'?'bg-amber-100 text-amber-800':'hover:bg-gray-100'}`}>
            <Calendar className="inline-block mr-1 h-4 w-4"/> Reserve
          </button>
          <button onClick={() => onTab('cart')} className={`px-3 py-2 rounded-md text-sm font-medium ${tab==='cart'?'bg-amber-100 text-amber-800':'hover:bg-gray-100'}`}>
            <ShoppingCart className="inline-block mr-1 h-4 w-4"/> Cart
          </button>
        </nav>
      </div>
    </header>
  )
}

function About({ cafe }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-3xl font-bold mb-3">Welcome to {cafe?.name || 'our café'}</h2>
        <p className="text-gray-600 mb-4">{cafe?.description || 'A cozy spot serving specialty coffee, fresh pastries, and warm vibes.'}</p>
        <div className="flex items-center gap-3 text-gray-700">
          <MapPin className="h-5 w-5 text-amber-600"/>
          <span>{cafe?.place || '123 Bean St, Roast City'}</span>
        </div>
        {cafe?.open_hours && (
          <div className="mt-2 text-gray-700">
            <span className="font-medium">Hours:</span> {cafe.open_hours}
          </div>
        )}
        {cafe?.phone && (
          <div className="mt-1 text-gray-700">
            <span className="font-medium">Phone:</span> {cafe.phone}
          </div>
        )}
      </div>
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="text-amber-700"/>
          <h3 className="font-semibold text-amber-800">About our coffee</h3>
        </div>
        <p className="text-amber-900/80">We source our beans from sustainable farms and roast in-house for maximum freshness. Whether you love bold espresso or smooth pour-over, there’s something for everyone.</p>
      </div>
    </section>
  )
}

function Menu({ items, onAdd }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Menu</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="rounded-xl border p-4 bg-white shadow-sm hover:shadow-md transition">
            {item.image_url && (
              <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-3"/>
            )}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                {item.category && <span className="inline-block mt-2 text-xs bg-gray-100 px-2 py-1 rounded">{item.category}</span>}
              </div>
              <div className="text-amber-700 font-bold">${item.price?.toFixed(2)}</div>
            </div>
            <button onClick={() => onAdd(item)} className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-md">
              <Plus className="h-4 w-4"/> Add to cart
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

function Cart({ cart, onInc, onDec, onCheckout }) {
  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0)
  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="bg-white border rounded-xl p-4 divide-y">
          {cart.map((c) => (
            <div key={c.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-gray-600">${c.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onDec(c.id)} className="p-1 rounded border hover:bg-gray-50"><Minus className="h-4 w-4"/></button>
                <span>{c.qty}</span>
                <button onClick={() => onInc(c.id)} className="p-1 rounded border hover:bg-gray-50"><Plus className="h-4 w-4"/></button>
              </div>
            </div>
          ))}
          <div className="pt-4 flex items-center justify-between">
            <div className="text-lg font-semibold">Total</div>
            <div className="text-xl font-bold text-amber-700">${total.toFixed(2)}</div>
          </div>
          <button onClick={onCheckout} className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md">Place Order</button>
        </div>
      )}
    </section>
  )
}

function Reserve({ onSubmit }) {
  const [form, setForm] = useState({ name: '', contact: '', party_size: 2, datetime_iso: '', notes: '' })
  return (
    <section className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Reserve a Table</h2>
      <div className="bg-white border rounded-xl p-4 space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Your name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <input className="w-full border rounded px-3 py-2" placeholder="Contact (phone/email)" value={form.contact} onChange={e=>setForm({...form, contact:e.target.value})}/>
        <input type="number" min={1} className="w-full border rounded px-3 py-2" placeholder="Party size" value={form.party_size} onChange={e=>setForm({...form, party_size:Number(e.target.value)})}/>
        <input type="datetime-local" className="w-full border rounded px-3 py-2" value={form.datetime_iso} onChange={e=>setForm({...form, datetime_iso:e.target.value})}/>
        <textarea className="w-full border rounded px-3 py-2" placeholder="Notes (optional)" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}/>
        <button onClick={()=>onSubmit(form)} className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md">Submit Reservation</button>
      </div>
    </section>
  )
}

function App() {
  const [tab, setTab] = useState('about')
  const [cafe, setCafe] = useState(null)
  const [menu, setMenu] = useState([])
  const [cart, setCart] = useState([])

  // Fetch cafe info and menu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cafesRes, menuRes] = await Promise.all([
          fetch(`${API_BASE}/api/cafes`).then(r=>r.json()),
          fetch(`${API_BASE}/api/menu`).then(r=>r.json()),
        ])
        setCafe(cafesRes[0])
        setMenu(menuRes)
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [])

  const onAdd = (item) => {
    setTab('cart')
    setCart(prev => {
      const found = prev.find(p => p.id === item.id)
      if (found) return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p)
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }]
    })
  }

  const onInc = (id) => setCart(prev => prev.map(p => p.id===id?{...p, qty:p.qty+1}:p))
  const onDec = (id) => setCart(prev => prev.flatMap(p => p.id===id? (p.qty>1?{...p, qty:p.qty-1}:[]):[p]))

  const onCheckout = async () => {
    if (cart.length===0) return
    const items = cart.map(c => ({ menu_item_id: c.id, quantity: c.qty }))
    const payload = { customer_name: 'Walk-in', contact: '', items }
    const res = await fetch(`${API_BASE}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    alert(`Order placed! Total: $${data.total}`)
    setCart([])
  }

  const onReserve = async (form) => {
    const res = await fetch(`${API_BASE}/api/reservations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) {
      alert('Reservation requested!')
      setTab('about')
    } else {
      alert('Failed to reserve')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-50 text-gray-900">
      <Header tab={tab} onTab={setTab} />
      {tab === 'about' && <About cafe={cafe} />}
      {tab === 'menu' && <Menu items={menu} onAdd={onAdd} />}
      {tab === 'cart' && <Cart cart={cart} onInc={onInc} onDec={onDec} onCheckout={onCheckout} />}
      {tab === 'reserve' && <Reserve onSubmit={onReserve} />}
      <footer className="text-center text-sm text-gray-500 py-8">© {new Date().getFullYear()} Caffé Blue</footer>
    </div>
  )
}

export default App
