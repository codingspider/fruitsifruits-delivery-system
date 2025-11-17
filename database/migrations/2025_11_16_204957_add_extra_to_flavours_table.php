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
        Schema::table('flavours', function (Blueprint $table) {
            $table->string('batch_yield')->nullable();
            $table->decimal('batch_ingredient_cost', 12, 4)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('flavours', function (Blueprint $table) {
            //
        });
    }
};
