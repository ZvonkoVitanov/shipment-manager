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
        Schema::create('grouped_shipments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('client_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('recipient_name');
            $table->string('recipient_phone');
            $table->string('pickup_location')->nullable();

            $table->unsignedInteger('total_shipments')->default(0);

            $table->decimal('discount_percentage', 5, 2)->default(0);

            $table->decimal('total_price_before_discount', 10, 2)->default(0);
            $table->decimal('total_discount', 10, 2)->default(0);
            $table->decimal('total_price_after_discount', 10, 2)->default(0);

            $table->enum('status', [
                'created',
                'confirmed',
                'cancelled',
            ])->default('created');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grouped_shipments');
    }
};
