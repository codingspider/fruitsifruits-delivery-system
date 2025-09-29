<?php

namespace App\Http\Controllers\API;

use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;


/**
 * @group Plan management
 *
 * APIs for managing Plans
 * 
 */
class PLanController extends Controller
{
    /**
        * Get Plan List 
        * @route  GET /api/plans
        * @return \Illuminate\Http\JsonResponse  JSON array of plans.
        * @authenticated
        * @param  \Illuminate\Http\Request  $request
        * @urlParam (optional) search term for filtering
     */
    public function index(Request $request)
    {
        try {
            $search = $request->input('search');
            $query = Plan::query();
            if ($search) {
                $query->where('plan_name', 'like', "%{$search}%");
            }
            $plans = $query->paginate(10);
            return $this->sendResponse($plans, 'Plan retrived successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Server Error.'.$e->getMessage());
        }
    }
    
    public function getAllPlans(Request $request)
    {
        try {
            $plans = Plan::whereStatus('active')->get();
            return $this->sendResponse($plans, 'Plan retrived successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Server Error.'.$e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'plan_name' => 'required',
                'number_of_order' => 'required',
                'business_location' => 'required',
                'staff_user' => 'required',
                'sms_remider' => 'required'
            ]);

            if ($validator->fails()) {
                return $this->sendError('Validation Error.'. $validator->errors());
            }

            $data = $request->all();
            $plan = Plan::create($data);


            return $this->sendResponse(['plan' => $plan], 'Plan saved successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage(), 500);
        }
    }

    public function edit($id)
    {
        try {
            $plan = Plan::find($id);
            return $this->sendResponse($plan, 'Plan retrived successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Server Error.'.$e->getMessage());
        }
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plan_name'      => 'required',
            'number_of_order'     => 'required',
            'business_location'     => 'required',
            'sms_reminder'     => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();

        try {
            // Create Owner
            $planData = $request->except(['id']);
            $plan = Plan::where('id', $request->id)->update($planData);
            DB::commit();
            
            return $this->sendResponse(['plan' => $plan], 'Plan saved successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Server Error: ' . $e->getMessage(), 500);
        }
    }
}
