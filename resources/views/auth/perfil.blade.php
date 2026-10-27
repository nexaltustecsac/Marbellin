@extends('layouts.app')
@section('title','Mi cuenta | Marbellin')
@section('content')
<section class="page-heading"><p class="eyebrow">TU ESPACIO MARBELLIN</p><h1>Hola, {{ $user->name }}</h1><p>Has iniciado sesión con {{ $user->email }}.</p><form method="POST" action="{{ route('auth.logout') }}">@csrf<button class="button" type="submit">Cerrar sesión</button></form></section>
@endsection