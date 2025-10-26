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
        Schema::create('return_leftover_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('return_leftover_id')->constrained('return_leftovers')->cascadeOnDelete();
            $table->foreignId('bottle_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('flavour_id')->nullable()->constrained('flavours')->cascadeOnDelete();
            $table->integer('quantity')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('return_leftover_items');
    }
};
