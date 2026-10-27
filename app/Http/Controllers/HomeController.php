<?php

namespace App\Http\Controllers;

use App\Models\Product;

class HomeController extends Controller
{
    public function index()
    {
        $newProducts = Product::whereIn('id', [1052, 1025, 1028, 1007, 1024])->get();
        if ($newProducts->isEmpty()) {
            $newProducts = Product::query()->latest()->take(5)->get();
        }

        $bestSellers = Product::whereIn('id', [1027, 1024, 1032, 1020, 1034])->get();
        if ($bestSellers->isEmpty()) {
            $bestSellers = Product::query()->skip(5)->take(5)->get();
        }

        return view('pages.home', compact('newProducts', 'bestSellers'));
    }
}