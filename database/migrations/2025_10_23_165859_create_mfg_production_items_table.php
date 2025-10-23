<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mfg_production_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mfg_production_id')->constrained('mfg_productions')->cascadeOnDelete();
            $table->foreignId('flavour_id')->constrained('flavours')->cascadeOnDelete();
            $table->foreignId('bottle_id')->nullable()->constrained('bottles')->cascadeOnDelete();
            $table->string('size')->nullable();
            $table->string('quantity')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mfg_production_items');
    }
};
