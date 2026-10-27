@extends('layouts.app')
@section('title','Distribuidora | Marbellin')
@section('content')
<section class="page-heading"><p class="eyebrow">MARBELLIN · INFORMACIÓN</p><h1>Crezcamos juntos</h1><p>¿Te interesa vender productos Marbellin? Cuéntanos sobre tu negocio y el volumen aproximado que deseas adquirir.</p></section><section class="section text-page"><h2>Solicita información</h2><p>Escríbenos desde la página de contacto con el asunto “Distribución”. Nuestro equipo podrá orientarte sobre disponibilidad y condiciones comerciales.</p><a class="button" href="{{ route('pages.contacto') }}">Contáctanos</a></section>
@endsection