<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function checkout() { return view('pages.cart.checkout'); }

    public function pago(Request $request)
    {
        $checkoutData = $request->only(['nombre','apellido','correo','celular','direccion','departamento','provincia','distrito','costo_envio']);
        session(['checkout_data' => $checkoutData]);
        return view('pages.cart.pago', compact('checkoutData'));
    }

    public function procesarOrder(Request $request)
    {
        $data = session('checkout_data', []);
        if (!$data) return redirect()->route('products.index')->with('error', 'Faltan los datos de facturación.');
        $items = json_decode($request->input('cart_items', '[]'), true);
        if (!is_array($items) || !$items) return redirect()->route('products.index')->with('error', 'No hay productos en tu orden.');

        DB::beginTransaction();
        try {
            $subtotal = 0;
            foreach ($items as $item) {
                $subtotal += (float)($item['precio'] ?? 0) * max(1, (int)($item['cantidad'] ?? 1));
            }
            $shipping = (float)($data['costo_envio'] ?? 0);
            $order = Order::create([
                'customer_name' => trim(($data['nombre'] ?? '') . ' ' . ($data['apellido'] ?? '')),
                'customer_email' => $data['correo'] ?? '',
                'customer_phone' => $data['celular'] ?? '',
                'shipping_address' => $data['direccion'] ?? '',
                'department' => $data['departamento'] ?? '',
                'province' => $data['provincia'] ?? '',
                'district' => $data['distrito'] ?? '',
                'shipping_cost' => $shipping,
                'subtotal' => $subtotal,
                'total' => $subtotal + $shipping,
                'payment_method' => $request->input('payment_method', 'Transferencia'),
                'status' => 'pendiente',
            ]);
            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'] ?? null,
                    'quantity' => max(1, (int)($item['cantidad'] ?? 1)),
                    'price' => (float)($item['precio'] ?? 0),
                    'price_type' => $item['tipoPrecio'] ?? 'unidad',
                ]);
            }
            DB::commit();
            session()->forget('checkout_data');
            return redirect()->route('cart.resumen', $order->id)->with('clear_cart', true);
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return back()->with('error', 'No se pudo procesar el pedido. Revisa los datos e inténtalo nuevamente.');
        }
    }

    public function resumen($id)
    {
        $order = Order::with('items.product')->findOrFail($id);
        return view('pages.cart.resumen', compact('order'));
    }
}