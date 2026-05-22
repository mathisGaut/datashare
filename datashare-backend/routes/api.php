<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FileController;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('files')->group(function () {
        // upload
        Route::post('/', [FileController::class, 'store']);
        // list
        Route::get('/', [FileController::class, 'index']);
        // delete
        Route::delete('/{id}', [FileController::class, 'destroy']);
        // update
        Route::put('/{id}', [FileController::class, 'update']);
        // show
        Route::get('/{id}', [FileController::class, 'show']);
    });
});

// Publics routes
Route::prefix('files')->group(function () {
    Route::get('/share/{token}', [FileController::class, 'shareInfo']);
    Route::get('/download/{token}', [FileController::class, 'download']);
});

// Test API
Route::get('/test', function () {
    return response()->json([
        'message' => 'API OK'
    ]);
});
