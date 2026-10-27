@extends('layouts.app')
@section('title','Acceso administrador | Marbellin')
@section('content')
<section class="auth-wrap"><form class="form-card" method="POST" action="{{ route('admin.login.submit') }}">@csrf<p class="eyebrow">PANEL DE GESTIÓN</p><h1>Administración</h1><label>Correo de administrador<input type="email" name="email" value="{{ old('email') }}" required></label><label>Contraseña<input type="password" name="password" required></label><button class="button full" type="submit">Ingresar al panel</button><p class="form-foot">Acceso restringido al personal autorizado.</p></form></section>
@endsection