<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\HomeController;
use App\\Http\\Controllers\\PageController;
use App\\Http\\Controllers\\ProductController;
use App\\Http\\Controllers\\CartController;
use App\\Http\\Controllers\\AuthController;
use App\\Http\\Controllers\\Admin\\AdminController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/productos', [ProductController::class, 'index'])->name('products.index');
Route::get('/productos/{id}', [ProductController::class, 'show'])->name('products.show');
Route::get('/nosotros', [PageController::class, 'nosotros'])->name('pages.nosotros');
Route::get('/contacto', [PageController::class, 'contacto'])->name('pages.contacto');
Route::post('/contacto', [PageController::class, 'enviarContacto'])->name('pages.contacto.send');
Route::get('/marbelover', [PageController::class, 'marbelover'])->name('pages.marbelover');
Route::get('/preguntas-frecuentes', [PageController::class, 'preguntasFrecuentes'])->name('pages.faq');
Route::get('/politica-privacidad', [PageController::class, 'politicaPrivacidad'])->name('pages.privacy');
Route::get('/terminos', [PageController::class, 'terminos'])->name('pages.terms');
Route::get('/cambios-devoluciones', [PageController::class, 'cambiosDevoluciones'])->name('pages.returns');
Route::get('/tarifa-envio', [PageController::class, 'tarifaEnvio'])->name('pages.shipping');
Route::get('/distribuidora', [PageController::class, 'distribuidora'])->name('pages.distribuidora');
Route::get('/libro-reclamaciones', [PageController::class, 'libroReclamaciones'])->name('pages.claims');
Route::post('/libro-reclamaciones', [PageController::class, 'enviarReclamacion'])->name('pages.claims.send');
Route::get('/catalogo', [PageController::class, 'catalogo'])->name('pages.catalog');
Route::get('/carrito/checkout', [CartController::class, 'checkout'])->name('cart.checkout');
Route::post('/carrito/pago', [CartController::class, 'pago'])->name('cart.pago');
Route::post('/carrito/procesar', [CartController::class, 'procesarOrder'])->name('cart.process');
Route::get('/carrito/resumen/{id}', [CartController::class, 'resumen'])->name('cart.resumen');
Route::get('/login', [AuthController::class, 'showLogin'])->name('auth.login');
Route::post('/login', [AuthController::class, 'login'])->name('auth.login.submit');
Route::get('/registro', [AuthController::class, 'showRegister'])->name('auth.register');
Route::post('/registro', [AuthController::class, 'register'])->name('auth.register.submit');
Route::middleware('auth')->group(function () {
    Route::get('/perfil', [AuthController::class, 'profile'])->name('auth.profile');
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
});
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminController::class, 'login'])->name('login.submit');
    Route::middleware('auth')->group(function () {
        Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::post('/logout', [AdminController::class, 'logout'])->name('logout');
    });
});
