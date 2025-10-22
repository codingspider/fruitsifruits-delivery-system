<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\DriverRouteLocation;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;

class DriverRouteController extends BaseController
{
    /**
     * List all products (or ingredients if product_type = raw/packaging)
     */
    public function index(Request $request)
    {
        try {
            $datas = DriverRouteLocation::with('user')->latest()->paginate(10);
            return $this->sendResponse($datas, 'Data retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }


    /**
     * Show single product (ingredient)
     */
    public function show($id)
    {
        $data = DriverRouteLocation::find($id);
        return $this->sendResponse($data, 'Data retrieved successfully.');
    }

    /**
     * Edit product (same as show)
     */
    public function edit($id)
    {
        $data = DriverRouteLocation::find($id);
        return $this->sendResponse($data, 'Data retrieved successfully.');
    }

    /**
     * Store new product (ingredient)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'           => 'required',
            'day'               => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            $driverRoute = new DriverRouteLocation();
            $driverRoute->user_id = $request->user_id;
            $driverRoute->day = $request->day;
            $driverRoute->locations = json_encode($request->locations);
            $driverRoute->save();

            DB::commit();
            return $this->sendResponse($driverRoute, 'Data saved successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Server Error: '.$e->getMessage(), 500);
        }
    }

    /**
     * Update product
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'day'     => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            $driverRoute = DriverRouteLocation::find($id);

            if (!$driverRoute) {
                return $this->sendError('Driver Route not found', [], 404);
            }

            $driverRoute->user_id = $request->user_id;
            $driverRoute->day = $request->day;
            $driverRoute->locations = json_encode($request->locations);
            $driverRoute->save();

            DB::commit();
            return $this->sendResponse($driverRoute, 'Data updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Server Error: '.$e->getMessage(), 500);
        }
    }


    /**
     * Delete product
     */
    public function destroy($id)
    {
        try {
            $driverRoute = DriverRouteLocation::find($id);
            if (!$driverRoute) {
                return $this->sendError('Data not found.', 404);
            }
            $driverRoute->delete();
            return $this->sendResponse([], 'Data deleted successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage(), 500);
        }
    }
}
