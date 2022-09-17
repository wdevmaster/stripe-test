<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Stripe\Stripe;
use Stripe\Customer;
use Stripe\PaymentIntent;

class StripeController extends Controller
{
    public function __construct() {
        Stripe::setApiKey('sk_test_51LaSPgDHpqZ66oEuUKDUq7S9LTgtWwyQa78Ha6C3hwplyxvtR6gDmJuZnCTr3DbfajlEjZJQpIh8WqmbwUL2fU5S00OVFrSeE2');
    }

    public function create(Request $request)
    {
        try {
            $customer = Customer::create();

            $paymentIntent = PaymentIntent::create([
                'customer' => $customer->id,
                'setup_future_usage' => 'off_session',
                'amount' => $this->calculateOrderAmount($request->items),
                'currency' => 'usd',
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            return response()->json($paymentIntent, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function calculateOrderAmount(array $items): int
    {
        return 55000;
    }
}
