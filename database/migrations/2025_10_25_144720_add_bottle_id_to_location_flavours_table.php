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
        Schema::table('location_flavours', function (Blueprint $table) {
            $table->unsignedBigInteger('bottle_id')->nullable()->after('flavour_id');
            $table->foreign('bottle_id')->references('id')->on('products')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('location_flavours', function (Blueprint $table) {
            //
        });
    }
};
