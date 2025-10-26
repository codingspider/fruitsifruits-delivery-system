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
        Schema::create('sell_lines', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('flavour_id')->nullable();
            $table->unsignedBigInteger('bottle_id')->nullable();
            $table->unsignedBigInteger('product_id')->nullable();
            $table->unsignedBigInteger('transaction_id');

            $table->integer('remaining')->default(0);
            $table->integer('to_be_filled')->default(0);
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('sub_total', 10, 2)->default(0);

            $table->foreign('flavour_id')->references('id')->on('flavours')->onDelete('cascade');
            $table->foreign('bottle_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sell_lines');
    }
};
