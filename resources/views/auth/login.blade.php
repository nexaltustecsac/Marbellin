@extends('layouts.app')
@section('title','Ingresar | Marbellin')
@section('content')
<section class="auth-wrap"><form class="form-card" method="POST" action="{{ route('auth.login.submit') }}">@csrf<p class="eyebrow">QUÉ BUENO TENERTE DE VUELTA</p><h1>Iniciar sesión</h1><label>Correo electrónico<input type="email" name="email" value="{{ old('email') }}" autocomplete="email" required></label><label>Contraseña<input type="password" name="password" autocomplete="current-password" required></label><button class="button full" type="submit">Ingresar</button><p class="form-foot">¿Aún no tienes cuenta? <a href="{{ route('auth.register') }}">Regístrate aquí</a></p></form></section>
@endsection