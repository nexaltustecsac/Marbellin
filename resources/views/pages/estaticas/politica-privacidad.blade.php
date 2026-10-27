@extends('layouts.app')
@section('title','Política de privacidad | Marbellin')
@section('content')
<section class="page-heading"><p class="eyebrow">MARBELLIN · INFORMACIÓN</p><h1>Tu información merece cuidado</h1><p>Utilizamos los datos que proporcionas para gestionar consultas, cuentas y pedidos. No introduzcas información bancaria sensible en formularios que no lo soliciten expresamente.</p></section><section class="section text-page"><h2>Datos recopilados</h2><p>Podemos solicitar nombre, correo, teléfono y dirección para atender tu pedido. Puedes consultar o solicitar la actualización de tus datos a través de nuestros canales de contacto.</p><a class="button" href="{{ route('pages.contacto') }}">Contáctanos</a></section>
@endsection