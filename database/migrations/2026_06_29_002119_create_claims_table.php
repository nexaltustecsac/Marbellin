<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('claims', function (Blueprint $table) {
            $table->id();
            $table->string('document_type');
            $table->string('document_number', 20);
            $table->string('fullname');
            $table->string('address');
            $table->string('email');
            $table->string('phone', 20);
            $table->string('claim_type');
            $table->text('description');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('claims'); }
};