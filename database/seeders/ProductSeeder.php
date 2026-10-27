<?php

namespace Database\\Seeders;

use App\\Models\\Product;
use Illuminate\\Database\\Seeder;
use Illuminate\\Support\\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Bikini clásico', 'category' => 'bikinis', 'price' => 19.90, 'description' => 'Bikini cómodo para uso diario.', 'stock' => 30],
            ['name' => 'Bikini encaje', 'category' => 'bikinis', 'price' => 29.90, 'description' => 'Diseño delicado con detalles de encaje.', 'stock' => 20],
            ['name' => 'Cachetero básico', 'category' => 'cacheteros', 'price' => 17.90, 'description' => 'Prenda suave y cómoda para todos los días.', 'stock' => 30],
            ['name' => 'Cachetero encaje', 'category' => 'cacheteros', 'price' => 24.90, 'description' => 'Acabado elegante con encaje.', 'stock' => 20],
        ];
        foreach ($products as $item) {
            Product::updateOrCreate(
                ['slug' => Str::slug($item['name'])],
                array_merge($item, ['price_unit' => $item['price'], 'images' => [], 'slug' => Str::slug($item['name'])])
            );
        }
    }
}