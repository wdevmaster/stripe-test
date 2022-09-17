// This is your test publishable API key.
const stripe = Stripe("pk_test_51LaSPgDHpqZ66oEu3R0OPCe5Xw22vNeZ8dEA1mHci4uHujZtfIcZCFnQTMyBrKPADlkJmFftGvN8FLWMeA9rkVQN00Ao8pcmZb");

// The items the customer wants to buy
const items = [{ precio: costo*100 }];
let token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvYmVkLm5hdmFycmV0ZSIsImV4cCI6MTY2MzMzNzc5NywiaWF0IjoxNjYzMzAxNzk3fQ.wfW3AI8QIO3BJuAoRpNn6NavdL67KQ0KptowTK8j2tQ';
const fetchHeaders = { 
  "Content-Type": "application/json",
  "Authorization": token,
  'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
}

let elements;

initialize();
checkStatus();

document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize() {
  const response = await fetch("/stripe/create", {
    method: "POST",
    headers: fetchHeaders,
    body: JSON.stringify({ items }),
  }).then((r) => r.json());

  elements = stripe.elements({ clientSecret: response.client_secret});

  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {stripe/stripe-php
  e.preventDefault();
  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: "https://bpbtraining-frontend-allusers.herokuapp.com/Stripe",
      receipt_email: document.getElementById("email").value,
    },
  });

  $.ajax({
    url: "https://bpbtraining-backend-api.herokuapp.com/api/v1/contratacioncoach/nueva",
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvYmVkLm5hdmFycmV0ZSIsImV4cCI6MTY2MzMxNjQ4NiwiaWF0IjoxNjYzMjgwNDg2fQ.48zSdwOf89KgInfq10rGEmbqQD7k7mbbCy3egbdrKpg",
      "Access-Control-Allow-Origin": "*",
    },
    type: "POST",
    contentType: "application/json",
    crossDomain: true,
    format: "json",
    data: JSON.stringify({
      "contratacionCoach": {
        "fecha": dia,
        "horaInicio": HHIni,
        "horaFin": HHFin,
        "idCoach": idCoach,
        "idCliente": idUser,
        "idClase": idClas
      },
      "intentosPago": {
        "idCliente": idUser,
        "idClase": idClas,
        "resultado": paymentIntent.status,
        "jsonResponse": JSON.stringify(paymentIntent).toString()
      }
    }),
    success: function (json) {
      console.log("archivo enviado exitosamente");
    },
    error: function (error) {
      console.log('message Error' + JSON.stringify(error));
    }
  });




  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occurred.");
  }

  setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  // var data = new FormData();
  // data.append(contratacionCoach, contratacionCoach);
  // data.append(intentosPago, intentosPago);


   




  switch (paymentIntent.status) {
    case "succeeded":
     
    
      showMessage("Payment succeeded!");
      window.location.replace('/')

      break;
    case "processing":
      showMessage("Your payment is processing.");
      
      break;
    case "requires_payment_method":
      showMessage("Your payment was not successful, please try again.");
     
      break;
    default:
      showMessage("Something went wrong.");
      
      break;
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageText.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}