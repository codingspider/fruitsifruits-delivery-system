<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;

class DriverManageController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $data = User::where('role', 'driver')->paginate(10);
            return $this->sendResponse($data, 'Driver retrived successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Server Error.'.$e->getMessage());
        }
    }
    
    public function edit($id)
    {
        try {
            $user = User::find($id);
            return $this->sendResponse($user, 'Driver retrived successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error.'.$e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'email'     => 'required|email|unique:users,email',
            'username'  => 'required|unique:users,username',
            'password'  => 'required',
            'status'    => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();

        try {
            // Check if user already exists
            $existingUser = User::where('email', $request->email)->orWhere('username', $request->username)->first();
            if ($existingUser) {
                return $this->sendError('Driver already exists.');
            }

            $userData = $request->all();
            if($request->password){
                $userData['password'] = Hash::make($request->password);
            }
            $userData['role'] = 'driver';

            // store new user
            $user = User::create($userData);
            DB::commit();

            return $this->sendResponse(['user' => $user], 'Data saved successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Server Error: ' . $e->getMessage(), 500);
        }
    }
    
    public function update(Request $request, $id)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email,' . $id,
            'username'  => 'required|string|unique:users,username,' . $id,
            'password'  => 'nullable|string|min:6',
            'status'    => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();

        try {
            $user = User::findOrFail($id);

            $user->name = $request->name;
            $user->email = $request->email;
            $user->username = $request->username;
            $user->status = $request->status;

            // Update password only if provided
            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }

            $user->save();
            DB::commit();

            return $this->sendResponse(['user' => $user], 'Data updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Server Error: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return $this->sendError('Driver not found.', 404);
            }
            $user->delete();
            return $this->sendResponse([], 'Data deleted successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage(), 500);
        }
    }
}
