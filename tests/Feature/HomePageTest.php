<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomePageTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_loads(): void
    {
        $this->get('/')->assertOk()->assertSee('Tu esencia');
    }

    public function test_product_listing_loads_when_catalog_is_empty(): void
    {
        $this->get('/productos')->assertOk()->assertSee('Productos Marbellin');
    }
}
