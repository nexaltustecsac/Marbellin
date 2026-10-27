@extends('layouts.app')
@section('title','Preguntas frecuentes | Marbellin')
@section('content')
<section class="page-heading"><p class="eyebrow">MARBELLIN · INFORMACIÓN</p><h1>Resolvemos tus dudas</h1><p>¿Cómo puedo comprar? Explora los productos, añade tus favoritos al carrito y completa tus datos de entrega. ¿Cómo consulto un pedido? Guarda el número de pedido que aparece al finalizar la compra y contáctanos si necesitas ayuda.</p></section><section class="section text-page"><h2>¿Puedo cambiar un producto?</h2><p>Las condiciones dependen del estado de la prenda y de las normas de higiene. Revisa la política de cambios antes de realizar tu compra.</p><a class="button" href="{{ route('pages.contacto') }}">Contáctanos</a></section>
@endsection