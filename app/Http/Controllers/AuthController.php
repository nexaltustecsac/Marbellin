<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function showLogin() { return view('auth.login'); }

    public function login(Request $request)
    {
        $credentials = $request->validate(['email' => 'required|email', 'password' => 'required']);
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return Auth::user()->email === env('MARBELLIN_ADMIN_EMAIL')
                ? redirect()->route('admin.dashboard')
                : redirect()->route('auth.profile');
        }
        return back()->withErrors(['email' => 'Las credenciales proporcionadas no son correctas.'])->onlyInput('email');
    }

    public function showRegister() { return view('auth.register'); }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);
        $user = User::create(['name' => $data['name'], 'email' => $data['email'], 'password' => bcrypt($data['password'])]);
        Auth::login($user);
        return redirect()->route('auth.profile');
    }

    public function profile() { return view('auth.perfil', ['user' => Auth::user()]); }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}