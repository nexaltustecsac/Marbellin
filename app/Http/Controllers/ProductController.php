<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();
        if ($request->filled('cat')) {
            $query->where('category', strtolower($request->string('cat')->toString()));
        }
        if ($request->filled('buscar')) {
            $term = '%' . $request->string('buscar')->toString() . '%';
            $query->where(fn ($q) => $q->where('name', 'like', $term)->orWhere('description', 'like', $term));
        }
        $products = $query->get();
        return view('pages.productos.index', compact('products'));
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        $relatedProducts = Product::where('category', $product->category)->where('id', '!=', $product->id)->take(4)->get();
        return view('pages.productos.show', compact('product', 'relatedProducts'));
    }
}