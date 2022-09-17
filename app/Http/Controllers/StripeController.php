<?php

namespace App\Http\Controllers;
use Stripe\Customer;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class StripeController extends Controller
{
    public function __construct() {
        Stripe::setApiKey(env('STRIPE_API_KEY'));
    }

    public function store(Request $request)
    {
        try {

            $jsonStr = file_get_contents('php://input');
            $jsonObj = json_decode($jsonStr);

            $precio = json_decode(json_encode($jsonObj->items[0]->precio), true);

            $customer = Customer::create();

            $paymentIntent = PaymentIntent::create([
                'customer' => $customer->id,
                'setup_future_usage' => 'off_session',
                'amount' => $precio,
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
