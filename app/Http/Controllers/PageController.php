<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function nosotros() { return view('pages.estaticas.nosotros'); }
    public function contacto() { return view('pages.estaticas.contacto'); }

    public function enviarContacto(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
        ]);
        ContactMessage::create($validated);
        return back()->with('success', 'Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.');
    }

    public function marbelover() { return view('pages.estaticas.marbelover'); }
    public function preguntasFrecuentes() { return view('pages.estaticas.preguntasfrecuentes'); }
    public function politicaPrivacidad() { return view('pages.estaticas.politica-privacidad'); }
    public function terminos() { return view('pages.estaticas.terminos'); }
    public function cambiosDevoluciones() { return view('pages.estaticas.cambios-devoluciones'); }
    public function tarifaEnvio() { return view('pages.estaticas.tarifaenvio'); }
    public function distribuidora() { return view('pages.estaticas.distribuidora'); }
    public function catalogo() { return view('pages.estaticas.catalogo'); }

    public function libroReclamaciones() { return view('pages.estaticas.libro-reclamaciones'); }

    public function enviarReclamacion(Request $request)
    {
        $validated = $request->validate([
            'document_type' => 'required|string',
            'document_number' => 'required|string|max:20',
            'fullname' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'claim_type' => 'required|string',
            'description' => 'required|string',
        ]);
        $claim = Claim::create($validated);
        return back()->with('success', 'Tu reclamo/queja ha sido registrado con el código #' . $claim->id . '. En breve nos comunicaremos contigo.');
    }
}