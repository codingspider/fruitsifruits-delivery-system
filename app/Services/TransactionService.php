<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\TransactionLine;
use App\Models\StockMove;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    /**
     * Process a transaction and update stock automatically
     */
    public static function processTransaction(Transaction $transaction)
    {
        foreach ($transaction->lines as $line) {

            // Determine stock quantity sign
            $quantity = $line->quantity;
            $type = $transaction->transaction_type;

            // Stock impact
            if (in_array($type, ['purchase', 'return', 'production_finished'])) {
                $stock_qty = $quantity; // positive stock
            } elseif (in_array($type, ['production_raw', 'delivery', 'damage'])) {
                $stock_qty = -$quantity; // negative stock
            } else {
                $stock_qty = 0; // expense type has no stock
            }

            // Get latest stock
            $lastStock = StockMove::where('product_id', $line->product_id)
                ->latest('id')
                ->first();

            $current_stock = $lastStock ? $lastStock->stock_after : $line->product->opening_stock;

            // Create stock move
            StockMove::create([
                'transaction_line_id' => $line->id,
                'product_id' => $line->product_id,
                'quantity' => $stock_qty,
                'unit_cost' => $line->unit_cost,
                'stock_after' => $current_stock + $stock_qty,
            ]);

            // Optional: update product average cost for finished products
            if ($type == 'production_finished') {
                $product = $line->product;
                $product->cost_price = $line->unit_cost;
                $product->save();
            }
        }
    }

    /**
     * Get profit/loss for a given date range
     */
    public static function getProfitLoss($startDate, $endDate)
    {
        $deliveries = Transaction::where('transaction_type', 'delivery')
            ->whereBetween('date', [$startDate, $endDate])
            ->with('lines.product')
            ->get();

        $totalRevenue = 0;
        $totalCost = 0;

        foreach ($deliveries as $transaction) {
            foreach ($transaction->lines as $line) {
                $totalRevenue += $line->sub_total;
                $totalCost += $line->quantity * $line->product->cost_price;
            }
        }

        return [
            'total_revenue' => $totalRevenue,
            'total_cost' => $totalCost,
            'profit' => $totalRevenue - $totalCost,
        ];
    }

    /**
     * Get production cost per finished product
     */
    public static function getCostPerProduct($productId)
    {
        $product = Product::find($productId);
        if (!$product || $product->product_type !== 'finished') return null;

        // Sum all raw/packaging used for this product (simplified)
        $lines = TransactionLine::whereHas('transaction', function($q){
            $q->where('transaction_type', 'production');
        })->where('product_id', $productId)->get();

        $totalQty = $lines->sum('quantity');
        $totalCost = $lines->sum('sub_total');

        if ($totalQty == 0) return 0;

        return round($totalCost / $totalQty, 2);
    }
}
