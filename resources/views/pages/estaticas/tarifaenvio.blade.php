@extends('layouts.app')
@section('title','Tarifas de envío | Marbellin')
@section('content')
<section class="page-heading"><p class="eyebrow">MARBELLIN · INFORMACIÓN</p><h1>Entrega según tu ubicación</h1><p>El costo y plazo de entrega pueden variar según el distrito, la cobertura del servicio y el tamaño del pedido. El importe final debe confirmarse antes del pago.</p></section><section class="section text-page"><h2>Antes de confirmar</h2><p>Verifica que tu dirección y teléfono sean correctos para evitar retrasos en la entrega.</p><a class="button" href="{{ route('pages.contacto') }}">Contáctanos</a></section>
@endsection