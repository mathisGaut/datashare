<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    /**
     * Upload a file
     */
    public function store(Request $request)
    {
        // Validation
        $request->validate([
            'file' => 'required|file|max:10240', // max 10MB
        ]);

        $uploadedFile = $request->file('file');

        // Store file in storage/app/uploads
        $path = $uploadedFile->store('uploads');

        // Generate unique token
        $token = Str::uuid();

        // Save file in database
        $file = File::create([
            'user_id' => auth()->id(),

            'original_name' => $uploadedFile->getClientOriginalName(),

            'stored_name' => basename($path),

            'path' => $path,

            'mime_type' => $uploadedFile->getMimeType(),

            'size' => $uploadedFile->getSize(),

            'token' => $token,

            'expires_at' => now()->addDays(7),
        ]);

        return response()->json([
            'message' => 'File uploaded successfully',
            'file' => $file,
            'download_url' => url("/api/files/download/{$token}"),
        ], 201);
    }

    /**
     * Download a file
     */
    public function download(string $token)
    {
        $file = File::where('token', $token)->firstOrFail();

        // Check expiration
        if ($file->expires_at && now()->greaterThan($file->expires_at)) {
            return response()->json([
                'message' => 'Download link expired'
            ], 403);
        }

        // Check if file exists
        if (!Storage::exists($file->path)) {
            return response()->json([
                'message' => 'File not found'
            ], 404);
        }

        return Storage::download(
            $file->path,
            $file->original_name
        );
    }
}
