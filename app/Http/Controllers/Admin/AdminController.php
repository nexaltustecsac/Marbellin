<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function showLogin() { return view('admin.login'); }

    public function login(Request $request)
    {
        $credentials = $request->validate(['email' => 'required|email', 'password' => 'required|string']);
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            if (Auth::user()->email === env('MARBELLIN_ADMIN_EMAIL')) {
                return redirect()->route('admin.dashboard');
            }
            Auth::logout();
        }
        return back()->withErrors(['email' => 'Acceso administrativo no autorizado.'])->onlyInput('email');
    }

    public function dashboard()
    {
        abort_unless(Auth::check() && Auth::user()->email === env('MARBELLIN_ADMIN_EMAIL'), 403);
        return view('admin.dashboard', [
            'productsCount' => Product::count(),
            'ordersCount' => Order::count(),
            'customersCount' => User::count(),
            'recentOrders' => Order::latest()->take(8)->get(),
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('admin.login');
    }
}