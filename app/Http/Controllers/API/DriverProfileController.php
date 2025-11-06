<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Transaction;
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
    
    public function dailyCollection(Request $request){
        $validator = Validator::make($request->all(), [
            'amount'  => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            $transaction = new Transaction();
            $transaction->transaction_type = 'collection';
            $transaction->reference_no = time();
            $transaction->total_amount = $request->amount;
            $transaction->date = now();
            $transaction->notes = null;
            $transaction->status = 'paid';
            $transaction->created_by = auth()->user()->id;
            $transaction->save();

            DB::commit();
            return $this->sendResponse($transaction, 'Data saved successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Server Error: '.$e->getMessage(), 500);
        }
    }

    public function getStats(Request $request)
    {
        try {
            $data = [];
            $data['total_delivery'] = Transaction::where('transaction_type', 'sell')->where('created_by', auth()->user()->id)->sum('id');
            $data['total_amount'] = Transaction::where('transaction_type', 'sell')->where('created_by', auth()->user()->id)->sum('total_amount');
            $data['total_pending_amount'] = Transaction::where('transaction_type', 'sell')->where('created_by', auth()->user()->id)->where('status', '!=', 'paid')->sum('total_amount');

            return $this->sendResponse($data, 'Data retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage());
        }
    }
    
    public function getPreviousDue(Request $request)
    {
        try {
            $data = Transaction::where('transaction_type', 'sell')->where('created_by', auth()->user()->id)->where('status', 'due')->get();
            return $this->sendResponse($data, 'Data retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage());
        }
    }
    
    public function makePayment(Request $request)
    {
        try {
            $data = Transaction::findOrFail($request->transaction_id);
            $data->status = 'paid';
            $data->save();
            return $this->sendResponse($data, 'Data retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage());
        }
    }
    
    public function getReports(Request $request)
    {
        try {
            $transactions = Transaction::withSum(['sell_lines as total_remaining' => function ($query) {
                $query->where('remaining', '>', 0);
            }], 'remaining')
            ->where('transaction_type', 'sell')
            ->where('created_by', auth()->user()->id)
            ->having('total_remaining', '>', 0)
            ->orderByDesc('total_remaining')
            ->get();

            return $this->sendResponse($transactions, 'Data retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Server Error: ' . $e->getMessage());
        }
    }
}
