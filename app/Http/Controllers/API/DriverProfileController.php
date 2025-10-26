<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;

class DriverProfileController extends BaseController
{
    public function profileData(Request $request)
    {
        try {
            $profile = User::where('id', auth()->user()->id)->first();
            return $this->sendResponse($profile, 'Data retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage());
        }
    }

    public function profileDataUpdate(Request $request){
        $validator = Validator::make($request->all(), [
            'name'           => 'required|string|max:255',
            'phone'  => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            $flavour = User::find(auth()->user()->id);
            $flavour->name = $request->name;
            $flavour->phone = $request->phone;
            $flavour->save();

            DB::commit();
            return $this->sendResponse($flavour, 'Data saved successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Server Error: '.$e->getMessage(), 500);
        }
    }
}
