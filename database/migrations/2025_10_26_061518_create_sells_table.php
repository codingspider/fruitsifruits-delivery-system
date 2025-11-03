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
        Schema::create('sells', function (Blueprint $table) {
            $table->id();

            
            $table->unsignedBigInteger('transaction_id');
            
            $table->boolean('paid')->default(false);
            $table->string('payment_method')->nullable();
            $table->text('remarks')->nullable();
            $table->string('signature_path')->nullable(); // storage path

            // totals
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('return_deduction', 10, 2)->default(0);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('grand_total', 10, 2)->default(0);

            
            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sells');
    }
};
