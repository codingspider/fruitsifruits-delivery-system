<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Setting;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Mail\ForgotPasswordMail;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController as BaseController;

class RegisterController extends BaseController
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'c_password' => 'required|same:password',
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $input = $request->all();
        $input['password'] = Hash::make($input['password']);
        $user = User::create($input);

        $success['token'] =  $user->createToken('MyApp')->plainTextToken;
        $success['name'] =  $user->name;
   
        return $this->sendResponse($success, 'User register successfully.');
    }
   
    /**
     * Login api
     *
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        $login_type = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $credentials = [
            $login_type => $request->login,
            'password' => $request->password,
        ];

        if (Auth::attempt($credentials, $request->filled('remember'))) {
            $user = Auth::user();
            $role = $user->role ?? 'driver';

            $business = Setting::first();

            $success = [
                'token'      => $user->createToken('MyApp')->plainTextToken,
                'name'       => $user->name,
                'role'       => $role,
                'favicon'    => asset(Storage::url($business->favicon ?? '')),
                'logo'       => asset(Storage::url($business->logo ?? '')),
                'app_name'   => $business->name ?? 'Fruit Production',
            ];

            $user->last_login_at = now();
            $user->save();

            return $this->sendResponse($success, 'User login successfully.');
        } else {
            return $this->sendError('Unauthorised.', ['error' => 'Unauthorised']);
        }
    }

    
    public function forgotPassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|exists:users,email',
            ]);

            if ($validator->fails()) {
                return $this->sendError('Validation Error.'. $validator->errors());
            }

            $user = User::where('email', $request->email)->first();

            // Generate token
            $token = Str::random(60);

            // Store token in password_resets table
            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $user->email],
                [
                    'email' => $user->email,
                    'token' => bcrypt($token),
                    'created_at' => now()
                ]
            );

            // Send email with the token
            Mail::to($user->email)->queue(new ForgotPasswordMail($token));

            return $this->sendResponse(['email' => $user->email], 'Reset password email sent successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Server Error.'.$e->getMessage());
        }
    }

    public function resetPassword(Request $request)
    {
        try {
            // Validate input
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|exists:users,email',
                'token' => 'required',
                'password' => 'required|min:6',
            ]);

            if ($validator->fails()) {
                return $this->sendError('Validation Error.'. $validator->errors(), 422);
            }

            // Attempt to reset the user's password
            $status = Password::reset(
                $request->only('email', 'password', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password),
                        'remember_token' => Str::random(60),
                    ])->save();
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return $this->sendResponse([], 'Password has been reset successfully.');
            } else {
                return $this->sendError('Reset failed.', ['error' => __($status)], 400);
            }

        } catch (\Exception $e) {
            return $this->sendError('Something went wrong.', ['error' => $e->getMessage()], 500);
        }
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->currentAccessToken()->delete();
            $user->tokens()->delete();
        }
        return $this->sendResponse([], 'Logged out successfully.');
    }
}
