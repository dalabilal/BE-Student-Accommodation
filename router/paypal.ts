import express, { Request, Response  } from 'express';
const base = "https://api-m.sandbox.paypal.com";
const router = express.Router();

/**
* Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
* @see https://developer.paypal.com/api/rest/authentication/
*/
const generateAccessToken = async () => {
    try {
      if (!"AVrJoLUN2kFpf88KtBdWN6NQH8dgff6_duj3PNtrsHEWnmKg7JI0NhzFlaKvCu8N5hO5UcZH6kO_alrS" || !"EFSx1h9o8wy_-_kD58aA1axJ6oKd7rt0kLaJ-bmHTuRfvM_QSAIeYtCrRCZtwfiQdPQuKZDf3QmmHy8V") {
        throw new Error("MISSING_API_CREDENTIALS");
      }
      const auth = Buffer.from(
        "AVrJoLUN2kFpf88KtBdWN6NQH8dgff6_duj3PNtrsHEWnmKg7JI0NhzFlaKvCu8N5hO5UcZH6kO_alrS" || + ":" + "EFSx1h9o8wy_-_kD58aA1axJ6oKd7rt0kLaJ-bmHTuRfvM_QSAIeYtCrRCZtwfiQdPQuKZDf3QmmHy8V",
      ).toString("base64");
      const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Failed to generate Access Token:", error);
    }
  };
      
  const clientId = "AVrJoLUN2kFpf88KtBdWN6NQH8dgff6_duj3PNtrsHEWnmKg7JI0NhzFlaKvCu8N5hO5UcZH6kO_alrS";
  const sellerPayerId = "EFSx1h9o8wy_-_kD58aA1axJ6oKd7rt0kLaJ-bmHTuRfvM_QSAIeYtCrRCZtwfiQdPQuKZDf3QmmHy8V"
  const jwt = getAuthAssertionValue(clientId, sellerPayerId);
  console.log(jwt);
  function getAuthAssertionValue(clientId : any, sellerPayerId : any) {
      const header = {
          "alg": "none"
      };
      const encodedHeader = base64url(header);
      const payload = {
          "iss": clientId,
          "payer_id": sellerPayerId
      };
      const encodedPayload = base64url(payload);
      return `${encodedHeader}.${encodedPayload}.`;
  }
  function base64url(json : any) {
      return btoa(JSON.stringify(json))
          .replace(/=+$/, '')
          .replace(/+/g, '-')
  }

  /**
* Create an order to start the transaction.
* @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
*/
const createOrder = async (cart : any) => {
    // use the cart information passed from the front-end to calculate the purchase unit details
    console.log(
      "shopping cart information passed from the frontend createOrder() callback:",
      cart,
    );
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "100.00",
          },
        },
      ],
    };
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        "PayPal-Partner-Attribution-Id": "BN-CODE",
        "PayPal-Auth-Assertion": "PAYPAL-AUTH-ASSERTION",
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
    // return handleResponse(response);
  };
      

router.post("/my-server/create-paypal-order",async (req: Request , res : Response) => {})

export default router;