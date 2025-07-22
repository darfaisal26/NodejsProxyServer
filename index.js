import fetch from "node-fetch";
import express from "express";
import dotenv from "dotenv";
import cors from "cors"
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Optional: Handle preflight for custom headers or methods (if needed)
app.options("*", cors());

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   if (req.method === "OPTIONS") return res.sendStatus(204);
//   next();
// });

app.use("/shipstation", async (req, res) => {
  const proxyPath = req.originalUrl.replace("/shipstation", "");
  const shipstationUrl = `https://ssapi.shipstation.com${proxyPath}`;

  try {
    const authString = Buffer.from(
      `${process.env.SHIPSTATION_API_KEY}:${process.env.SHIPSTATION_API_SECRET}`
    ).toString("base64");

    const headers = {
      Authorization: `Basic ${authString}`,
    };
    // console.log("headers", headers);

    const hasBody = ["POST", "PUT", "DELETE"].includes(req.method);
    if (hasBody) {
      headers["Content-Type"] = "application/json";
    }

    // console.log("hasBody", hasBody);
    const options = {
      method: req.method,
      headers,
      body: hasBody ? JSON.stringify(req.body) : undefined,
    };

    // console.log("options", options);
    const response = await fetch(shipstationUrl, options);
    console.log("response", response);

    const contentType = response.headers.get("content-type");
    // console.log("contentType", contentType);
    const text = await response.text();
    // console.log("text", text);

    let data;
    try {
      // console.log("in try block");
      data = contentType?.includes("application/json")
        ? JSON.parse(text)
        : text;
      console.log("data", data, "data");
    } catch (error) {
      // console.log("in catch inner block");
      console.error("❌ Failed to parse response JSON:", text);
      return res.status(response.status).send(text);
    }

    res.status(response.status).json(data);
  } catch (err) {
    // console.log("in catch block");
    console.error("🚨 Error in proxy:", err);
    res.status(500).send("Proxy error Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});









/* {
    "shipByDateTime": null,
    "paidDateTime": "2025-07-22T15:26:27.000Z",
    "holdUntilDateTime": null,
    "orderDateTime": "2025-07-22T15:26:27.000Z",
    "items": [],
    "amountSummary": {
        "shippingPaid": {
            "value": 0,
            "code": "USD"
        },
        "taxPaid": {
            "value": 0,
            "code": "USD"
        },
        "totalPaid": {
            "value": 0,
            "code": "USD"
        }
    },
    "soldTo": {
        "email": "business@samsung.com",
        "name": "New order",
        "phone": "0837273273"
    },
    "isGift": false,
    "shipToAddress": {
        "countryCode": "US",
        "email": "business@samsung.com",
        "name": "New order",
        "company": "samsung",
        "line1": "12",
        "city": "Seoul",
        "state": "WV",
        "postalCode": "12882",
        "phone": "0837273273"
    },
    "orderNumber": "",
    "createGuid": "0374f211-86c9-0cdd-7af7-8ce5569ed361",
    "store": {
        "storeGuid": "8c3d89b1-e72c-48f1-94a5-7350cbb8527f"
    },
    "storeGuid": "8c3d89b1-e72c-48f1-94a5-7350cbb8527f"
} */

/*
{
  "orderNumber": "TEST-ORDER-API-DOCS",
  "orderKey": "0f6bec18-3e89-4881-83aa-f392d84f4c74",
  "orderDate": "2015-06-29T08:46:27.0000000",
  "paymentDate": "2015-06-29T08:46:27.0000000",
  "shipByDate": "2015-07-05T00:00:00.0000000",
  "orderStatus": "awaiting_shipment",
  "customerId": 37701499,
  "customerUsername": "headhoncho@whitehouse.gov",
  "customerEmail": "headhoncho@whitehouse.gov",
  "billTo": {
    "name": "The President",
    "company": null,
    "street1": null,
    "street2": null,
    "street3": null,
    "city": null,
    "state": null,
    "postalCode": null,
    "country": null,
    "phone": null,
    "residential": null
  },
  "shipTo": {
    "name": "The President",
    "company": "US Govt",
    "street1": "1600 Pennsylvania Ave",
    "street2": "Oval Office",
    "street3": null,
    "city": "Washington",
    "state": "DC",
    "postalCode": "20500",
    "country": "US",
    "phone": "555-555-5555",
    "residential": true
  },
  "items": [
    {
      "lineItemKey": "vd08-MSLbtx",
      "sku": "ABC123",
      "name": "Test item #1",
      "imageUrl": null,
      "weight": {
        "value": 24,
        "units": "ounces"
      },
      "quantity": 2,
      "unitPrice": 99.99,
      "taxAmount": 2.5,
      "shippingAmount": 5,
      "warehouseLocation": "Aisle 1, Bin 7",
      "options": [
        {
          "name": "Size",
          "value": "Large"
        }
      ],
      "productId": 123456,
      "fulfillmentSku": null,
      "adjustment": false,
      "upc": "32-65-98"
    },
    {
      "lineItemKey": null,
      "sku": "DISCOUNT CODE",
      "name": "10% OFF",
      "imageUrl": null,
      "weight": {
        "value": 0,
        "units": "ounces"
      },
      "quantity": 1,
      "unitPrice": -20.55,
      "taxAmount": null,
      "shippingAmount": null,
      "warehouseLocation": null,
      "options": [],
      "productId": 123456,
      "fulfillmentSku": "SKU-Discount",
      "adjustment": true,
      "upc": null
    }
  ],
  "amountPaid": 218.73,
  "taxAmount": 5,
  "shippingAmount": 10,
  "customerNotes": "Please ship as soon as possible!",
  "internalNotes": "Customer called and would like to upgrade shipping",
  "gift": true,
  "giftMessage": "Thank you!",
  "paymentMethod": "Credit Card",
  "requestedShippingService": "Priority Mail",
  "carrierCode": "fedex",
  "serviceCode": "fedex_2day",
  "packageCode": "package",
  "confirmation": "delivery",
  "shipDate": "2015-07-02",
  "weight": {
    "value": 25,
    "units": "ounces"
  },
  "dimensions": {
    "units": "inches",
    "length": 7,
    "width": 5,
    "height": 6
  },
  "insuranceOptions": {
    "provider": "carrier",
    "insureShipment": true,
    "insuredValue": 200
  },
  "internationalOptions": {
    "contents": null,
    "customsItems": null
  },
  "advancedOptions": {
    "warehouseId": null,
    "nonMachinable": false,
    "saturdayDelivery": false,
    "containsAlcohol": false,
    "mergedOrSplit": false,
    "mergedIds": [],
    "parentId": null,
    "storeId": null,
    "customField1": "Custom data that you can add to an order. See Custom Field #2 & #3 for more info!",
    "customField2": "Per UI settings, this information can appear on some carrier's shipping labels. See link below",
    "customField3": "https://help.shipstation.com/hc/en-us/articles/206639957",
    "source": "Webstore",
    "billToParty": null,
    "billToAccount": null,
    "billToPostalCode": null,
    "billToCountryCode": null
  },
  "tagIds": [
    53974
  ]
}




*/
