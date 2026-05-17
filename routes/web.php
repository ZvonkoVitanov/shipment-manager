<?php

use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Client\DashboardController as ClientDashboardController;
use App\Http\Controllers\Admin\ShipmentController as AdminShipmentController;
use App\Http\Controllers\Admin\ShipmentReportController as AdminShipmentReportController;
use App\Http\Controllers\Client\GroupedShipmentController;
use App\Http\Controllers\Client\ShipmentController;
use App\Http\Controllers\Client\ShipmentImportController;
use App\Http\Controllers\Client\ShipmentReportController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TrackingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/track/{barcode}', [TrackingController::class, 'show'])->name('tracking.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        if (auth()->user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('client.dashboard');
    })->name('dashboard');

    Route::middleware('admin')
        ->prefix('admin')
        ->name('admin.')
        ->group(function () {
            Route::get('/dashboard', [AdminDashboardController::class, 'index'])
                ->name('dashboard');

            Route::resource('clients', ClientController::class)->only([
                'index',
                'create',
                'store',
            ]);
            Route::get('/shipments', [AdminShipmentController::class, 'index'])
                ->name('shipments.index');

            Route::get('/shipments/{shipment}', [AdminShipmentController::class, 'show'])
                ->name('shipments.show');

            Route::post('/shipments/{shipment}/status', [AdminShipmentController::class, 'updateStatus'])
                ->name('shipments.update-status');

            Route::get('/reports/shipments', [AdminShipmentReportController::class, 'index'])
                ->name('reports.shipments');

            Route::get('/reports/shipments/export-csv', [AdminShipmentReportController::class, 'exportCsv'])
                ->name('reports.shipments.export-csv');
        });


    Route::prefix('client')
        ->name('client.')
        ->group(function () {
            Route::get('/dashboard', [ClientDashboardController::class, 'index'])
                ->name('dashboard');

            Route::resource('shipments', ShipmentController::class)->only([
                'index',
                'create',
                'store',
                'show'
            ]);

            Route::get('/shipments/{shipment}/label', [ShipmentController::class, 'label'])
                ->name('shipments.label');

            Route::get('/imports', [ShipmentImportController::class, 'index'])
                ->name('imports.index');

            Route::get('/imports/create', [ShipmentImportController::class, 'create'])
                ->name('imports.create');

            Route::post('/imports/preview', [ShipmentImportController::class, 'preview'])
                ->name('imports.preview');

            Route::get('/imports/{import}', [ShipmentImportController::class, 'show'])
                ->name('imports.show');

            Route::post('/imports/{import}/confirm', [ShipmentImportController::class, 'confirm'])
                ->name('imports.confirm');

            Route::resource('grouped-shipments', GroupedShipmentController::class)->only([
                'index',
                'create',
                'store',
                'show',
            ]);

            Route::get('/reports/shipments', [ShipmentReportController::class, 'index'])
                ->name('reports.shipments');

            Route::get('/reports/shipments/export-csv', [ShipmentReportController::class, 'exportCsv'])
                ->name('reports.shipments.export-csv');

            Route::resource('clients', ClientController::class)->only([
                'index',
                'create',
                'store',
            ]);

        });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
