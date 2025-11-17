<?php

namespace App\Http\Controllers\API;

use App\Models\Flavour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;

class FlavourController extends BaseController
{
    /**
     * List all products (or ingredients if product_type = raw/packaging)
     */
    public function index(Request $request)
    {
        try {
            $flavours = Flavour::latest()->paginate(10);
            return $this->sendResponse($flavours, 'Flavour retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }
    
    public function getFlavours(Request $request)
    {
        try {
            $flavour = Flavour::where('status', 'active')->get();
            return $this->sendResponse($flavour, 'Flavour retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: '.$e->getMessage());
        }
    }

    /**
     * Show single product (ingredient)
     */
    public function show(Flavour $flavour)
    {
        return $this->sendResponse($flavour, 'Flavour retrieved successfully.');
    }

    /**
     * Edit product (same as show)
     */
    public function edit($id)
    {
        $flavour = Flavour::find($id);
        return $this->sendResponse($flavour, 'Flavour retrieved successfully.');
    }

    /**
     * Store new product (ingredient)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'           => 'required|string|max:255',
            'status'  => 'required',
            'price'  => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            $flavour = new Flavour();
            $flavour->name = $request->name;
            $flavour->status = $request->status;
            $flavour->price = $request->price;
            $flavour->save();

            DB::commit();
            return $this->sendResponse($flavour, 'Flavour saved successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Server Error: '.$e->getMessage(), 500);
        }
    }

    /**
     * Update product
     */
    public function update(Request $request, Flavour $flavour)
    {
        $validator = Validator::make($request->all(), [
            'name'           => 'required|string|max:255',
            'status'         => 'required',
            'price'         => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            $flavour->name = $request->name;
            $flavour->status = $request->status;
            $flavour->price = $request->price;
            $flavour->save();

            DB::commit();
            return $this->sendResponse($flavour, 'Flavour updated successfully.');
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
            $flavour = Flavour::find($id);
            if (!$flavour) {
                return $this->sendError('Data not found.', 404);
            }
            $flavour->delete();
            return $this->sendResponse([], 'Data deleted successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage(), 500);
        }
    }
}
