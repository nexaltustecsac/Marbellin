<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="csrf-token" content="{{ csrf_token() }}">
<title>@yield('title', 'Marbellin | Lencería fina')</title>
<meta name="description" content="@yield('description', 'Lencería Marbellin: comodidad, suavidad y estilo para ti.')">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{{ asset('css/marbellin.css') }}">
<script defer src="{{ asset('js/marbellin.js') }}"></script>
@stack('head')
</head>
<body>
<div class="topbar">MARBELLIN · LENCERÍA FINA · ENVÍOS A TODO EL PERÚ</div>
<header class="header"><a class="logo" href="{{ route('home') }}">marbellin<span>.</span></a><button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false">☰</button><nav class="nav"><a href="{{ route('home') }}">Inicio</a><a href="{{ route('products.index') }}">Productos</a><a href="{{ route('pages.nosotros') }}">Nosotros</a><a href="{{ route('pages.contacto') }}">Contacto</a></nav><div class="header-actions"><a href="{{ route('auth.login') }}">Ingresar</a><a href="{{ route('cart.checkout') }}">Carrito <span class="cart-count" data-cart-count>0</span></a></div></header>
@if(session('success'))<div class="notice success" role="status">{{ session('success') }}</div>@endif
@if(session('error'))<div class="notice error" role="alert">{{ session('error') }}</div>@endif
@if($errors->any())<div class="notice error" role="alert">@foreach($errors->all() as $error)<p>{{ $error }}</p>@endforeach</div>@endif
<main>@yield('content')</main>
<footer class="footer"><a class="logo" href="{{ route('home') }}">marbellin<span>.</span></a><p>Lencería fina, pensada para ti.</p><div class="footer-links"><a href="{{ route('pages.privacy') }}">Privacidad</a><a href="{{ route('pages.terms') }}">Términos</a><a href="{{ route('pages.returns') }}">Cambios y devoluciones</a><a href="{{ route('pages.faq') }}">Preguntas frecuentes</a></div><small>© {{ date('Y') }} Marbellin. Todos los derechos reservados.</small></footer>
@stack('scripts')
</body></html>