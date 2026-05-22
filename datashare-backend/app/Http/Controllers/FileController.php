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

    /**
     * List authenticated user files
     */
    public function index(Request $request)
    {
        $search = $request->query('search');

        $sort = $request->query('sort', 'created_at');

        // Allowed sortable columns
        $allowedSorts = [
            'created_at',
            'original_name',
            'size',
        ];

        // Prevent invalid sort column
        if (!in_array($sort, $allowedSorts)) {
            $sort = 'created_at';
        }

        $query = auth()->user()->files();

        // Search by original filename
        if ($search) {
            $query->where('original_name', 'like', "%{$search}%");
        }

        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);

        $files = $query
            ->orderBy($sort, 'desc')
            ->paginate($perPage);

        return response()->json($files);
    }

    /**
     * Show a specific file
     */
    public function show(int $id)
    {
        $file = File::findOrFail($id);

        $this->authorize('view', $file);

        return response()->json([
            'file' => $file
        ]);
    }

    /**
     * Delete a file
     */
    public function destroy(int $id)
    {
        $file = File::findOrFail($id);

        $this->authorize('delete', $file);

        // Delete physical file
        if (Storage::exists($file->path)) {
            Storage::delete($file->path);
        }

        // Delete database record
        $file->delete();

        return response()->json([
            'message' => 'File deleted successfully'
        ]);
    }

    /**
     * Update file metadata
     */
    public function update(Request $request, int $id)
    {
        $file = File::findOrFail($id);

        $this->authorize('update', $file);

        // Validation
        $validated = $request->validate([
            'original_name' => 'sometimes|string|max:255',
            'expires_at' => 'nullable|date',
        ]);

        // Update fields
        $file->update($validated);

        return response()->json([
            'message' => 'File updated successfully',
            'file' => $file
        ]);
    }
}
