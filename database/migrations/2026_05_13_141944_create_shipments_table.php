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
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('client_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('barcode')->unique();

            $table->string('recipient_name');
            $table->string('recipient_address');
            $table->string('recipient_city');
            $table->string('delivery_post_office')->nullable();
            $table->string('recipient_phone');

            $table->decimal('ransom_amount', 10, 2)->default(0);
            $table->string('invoice_number')->nullable();
            $table->decimal('weight', 8, 2)->nullable();

            $table->enum('delivery_type', [
                'home',
                'post_office',
            ])->default('home');

            $table->enum('pickup_type', [
                'post_office',
                'address',
            ])->default('post_office');

            $table->string('pickup_location')->nullable();

            $table->text('note')->nullable();

            $table->enum('latest_status', [
                'created',
                'picked_up',
                'in_transit',
                'out_for_delivery',
                'delivered',
                'returned',
                'cancelled',
            ])->default('created');

            $table->enum('payment_method', [
                'virman',
                'pos',
            ])->nullable();

            $table->string('postman_code')->nullable();
            $table->string('counter_code')->nullable();

            $table->boolean('is_locked')->default(false);

            $table->foreignId('operator_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('assigned_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
