<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CartController extends Controller
{
    public function checkout()
    {
        return view('pages.cart.checkout');
    }

    public function pago(Request $request)
    {
        $checkoutData = $request->validate([
            'nombre' => 'required|string|max:120',
            'apellido' => 'required|string|max:120',
            'correo' => 'required|email|max:255',
            'celular' => 'required|string|max:30',
            'direccion' => 'required|string|max:255',
            'departamento' => 'required|string|max:120',
            'provincia' => 'required|string|max:120',
            'distrito' => 'required|string|max:120',
            'costo_envio' => 'required|numeric|min:0|max:10000',
        ]);

        session(['checkout_data' => $checkoutData]);

        return view('pages.cart.pago', compact('checkoutData'));
    }

    public function procesarOrder(Request $request)
    {
        $data = session('checkout_data');
        if (!$data) {
            return redirect()->route('cart.checkout')->with('error', 'Completa primero tus datos de entrega.');
        }

        $validated = $request->validate([
            'payment_method' => 'required|in:Transferencia,Yape,Contraentrega',
            'cart_items' => 'required|string|max:20000',
        ]);

        $items = json_decode($validated['cart_items'], true);
        if (!is_array($items) || count($items) < 1 || count($items) > 50) {
            throw ValidationException::withMessages(['cart_items' => 'El carrito está vacío o contiene demasiados productos.']);
        }

        $normalized = [];
        foreach ($items as $item) {
            if (!is_array($item) || !isset($item['id'], $item['qty'])) {
                throw ValidationException::withMessages(['cart_items' => 'Uno de los productos del carrito no es válido.']);
            }
            $id = filter_var($item['id'], FILTER_VALIDATE_INT);
            $quantity = filter_var($item['qty'], FILTER_VALIDATE_INT);
            if (!$id || !$quantity || $quantity < 1 || $quantity > 99) {
                throw ValidationException::withMessages(['cart_items' => 'Revisa las cantidades del carrito.']);
            }
            $product = Product::find($id);
            if (!$product) {
                throw ValidationException::withMessages(['cart_items' => 'Uno de los productos ya no está disponible. Actualiza tu carrito.']);
            }
            if ($product->stock > 0 && $quantity > $product->stock) {
                throw ValidationException::withMessages(['cart_items' => 'No hay stock suficiente para ' . $product->name . '.']);
            }
            $price = (float) ($product->price_unit ?? $product->price);
            $normalized[] = ['product' => $product, 'quantity' => $quantity, 'price' => $price];
        }

        DB::beginTransaction();
        try {
            $subtotal = array_reduce($normalized, fn ($sum, $item) => $sum + $item['price'] * $item['quantity'], 0.0);
            $shipping = (float) $data['costo_envio'];
            $order = Order::create([
                'customer_name' => trim($data['nombre'] . ' ' . $data['apellido']),
                'customer_email' => $data['correo'],
                'customer_phone' => $data['celular'],
                'shipping_address' => $data['direccion'],
                'department' => $data['departamento'],
                'province' => $data['provincia'],
                'district' => $data['distrito'],
                'shipping_cost' => $shipping,
                'subtotal' => $subtotal,
                'total' => $subtotal + $shipping,
                'payment_method' => $validated['payment_method'],
                'status' => 'pendiente',
            ]);

            foreach ($normalized as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product']->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'price_type' => 'unidad',
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