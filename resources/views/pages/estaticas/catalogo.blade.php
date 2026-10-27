@extends('layouts.app')
@section('title','Catálogo | Marbellin')
@section('content')
<section class="page-heading"><p class="eyebrow">MARBELLIN · INFORMACIÓN</p><h1>Descubre la colección</h1><p>Estamos preparando un catálogo organizado por categorías y modelos. Muy pronto podrás consultar la información de cada prenda.</p></section><section class="section text-page"><h2>Explora productos</h2><p>Visita la sección de productos para revisar los artículos actualmente publicados.</p><a class="button" href="{{ route('pages.contacto') }}">Contáctanos</a></section>
@endsection