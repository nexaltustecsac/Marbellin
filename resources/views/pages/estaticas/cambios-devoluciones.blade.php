@extends('layouts.app')
@section('title','Cambios y devoluciones | Marbellin')
@section('content')
<section class="page-heading"><p class="eyebrow">MARBELLIN · INFORMACIÓN</p><h1>Queremos ayudarte</h1><p>Por tratarse de prendas íntimas, las solicitudes de cambio deben evaluarse considerando la higiene, el estado del producto y la normativa aplicable.</p></section><section class="section text-page"><h2>Cómo solicitar una evaluación</h2><p>Conserva tu comprobante y contacta a nuestro equipo indicando el número de pedido y el motivo de la solicitud.</p><a class="button" href="{{ route('pages.contacto') }}">Contáctanos</a></section>
@endsection