<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Setting;
use App\Models\LoginHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;

class BusinessController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $business = Setting::first();
            if (!$business) {
                return $this->sendError('Setting not found.');
            }
            return $this->sendResponse($business, 'Business retrived successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Server Error.'.$e->getMessage());
        }
    }
    
    public function loginHistory(Request $request)
    {
        try {
            $history = LoginHistory::with('user')->latest()->paginate(10);
            return $this->sendResponse($history, 'Data retrived successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Server Error.'.$e->getMessage());
        }
    }
    
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            // Check if record exists, otherwise create new
            $business = Setting::first() ?? new Setting();

            // Handle logo upload
            if ($request->hasFile('logo')) {
                // delete old file if exists
                if ($business->logo && Storage::disk('public')->exists($business->logo)) {
                    Storage::disk('public')->delete($business->logo);
                }

                $logoPath = $request->file('logo')->store('uploads/business/logo', 'public');
                $business->logo = $logoPath;
            }

            // Handle favicon upload
            if ($request->hasFile('favicon')) {
                if ($business->favicon && Storage::disk('public')->exists($business->favicon)) {
                    Storage::disk('public')->delete($business->favicon);
                }

                $faviconPath = $request->file('favicon')->store('uploads/business/favicon', 'public');
                $business->favicon = $faviconPath;
            }

            // Fill or update fields
            $business->fill([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'zip_code' => $request->zip_code,
                'map_api_key' => $request->map_api_key,
                'lat_long' => $request->lat_long,
                'timezone' => $request->timezone,
            ]);

            $business->save();

            DB::commit();
            return $this->sendResponse(['business' => $business], 'Setting saved successfully.', 200);
        } catch (\Exception $e) {
            DB::rollBack(); // rollback is important
            return $this->sendError('Server Error: ' . $e->getMessage(), 500);
        }
    }


    public function timezone(){
        $times = timeZone();
        return $this->sendResponse(['zones' => $times], 'Setting get successfully.', 200);
    }

   
}
