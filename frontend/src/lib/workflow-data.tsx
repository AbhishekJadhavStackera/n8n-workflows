export const workflowJSONData: Record<string, any> = {
  "ai-petshop-assistant": {
    name: "AI Petshop Assistant with GPT-4o, Google Calendar & WhatsApp/Instagram/FB",
    nodes: [
      {
        parameters: {
          httpMethod: "POST",
          path: "petshop-webhook",
          responseMode: "responseNode",
        },
        id: "webhook-trigger",
        name: "Webhook Trigger",
        type: "n8n-nodes-base.webhook",
        typeVersion: 1,
        position: [240, 300],
      },
      {
        parameters: {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are Amanda, a helpful AI assistant for a pet shop. Help customers with pet care questions, booking appointments, and product recommendations. Be friendly and knowledgeable.",
            },
            {
              role: "user",
              content: "={{$json.body.message}}",
            },
          ],
        },
        id: "openai-chat",
        name: "OpenAI GPT-4o",
        type: "n8n-nodes-base.openAi",
        typeVersion: 1,
        position: [460, 300],
      },
      {
        parameters: {
          conditions: {
            string: [
              {
                value1: "={{$json.response}}",
                operation: "contains",
                value2: "appointment",
              },
            ],
          },
        },
        id: "appointment-check",
        name: "Check for Appointment",
        type: "n8n-nodes-base.if",
        typeVersion: 1,
        position: [680, 200],
      },
      {
        parameters: {
          calendarId: "primary",
          resource: "event",
          operation: "create",
          start: "={{$json.appointment_time}}",
          end: "={{DateTime.fromISO($json.appointment_time).plus({hours: 1}).toISO()}}",
          summary: "Pet Appointment - {{$json.pet_name}}",
          description: "Appointment booked via AI assistant for {{$json.customer_name}}",
        },
        id: "google-calendar",
        name: "Create Calendar Event",
        type: "n8n-nodes-base.googleCalendar",
        typeVersion: 1,
        position: [900, 150],
      },
      {
        parameters: {
          phoneNumber: "={{$json.customer_phone}}",
          message:
            "Hi {{$json.customer_name}}! 🐾 Your appointment for {{$json.pet_name}} has been scheduled for {{DateTime.fromISO($json.appointment_time).toFormat('MMM dd, yyyy at h:mm a')}}. We can't wait to see you both!",
        },
        id: "whatsapp-send",
        name: "Send WhatsApp Confirmation",
        type: "n8n-nodes-base.whatsApp",
        typeVersion: 1,
        position: [900, 250],
      },
      {
        parameters: {
          platform: "instagram",
          message: "={{$json.response}}",
          recipientId: "={{$json.sender_id}}",
        },
        id: "instagram-reply",
        name: "Instagram Reply",
        type: "n8n-nodes-base.instagram",
        typeVersion: 1,
        position: [680, 400],
      },
    ],
    connections: {
      "Webhook Trigger": {
        main: [
          [
            {
              node: "OpenAI GPT-4o",
              type: "main",
              index: 0,
            },
          ],
        ],
      },
      "OpenAI GPT-4o": {
        main: [
          [
            {
              node: "Check for Appointment",
              type: "main",
              index: 0,
            },
            {
              node: "Instagram Reply",
              type: "main",
              index: 0,
            },
          ],
        ],
      },
      "Check for Appointment": {
        main: [
          [
            {
              node: "Create Calendar Event",
              type: "main",
              index: 0,
            },
            {
              node: "Send WhatsApp Confirmation",
              type: "main",
              index: 0,
            },
          ],
        ],
      },
    },
    active: true,
    settings: {
      timezone: "America/New_York",
    },
  },
  "social-media-scheduler": {
    name: "Multi-Platform Social Media Content Scheduler",
    nodes: [
      {
        parameters: {
          rule: {
            interval: [
              {
                field: "cronExpression",
                expression: "0 9,14,18 * * *",
              },
            ],
          },
        },
        id: "schedule-trigger",
        name: "Schedule Trigger",
        type: "n8n-nodes-base.cron",
        typeVersion: 1,
        position: [240, 300],
      },
      {
        parameters: {
          operation: "getAll",
          resource: "post",
          filters: {
            status: "scheduled",
          },
        },
        id: "get-scheduled-posts",
        name: "Get Scheduled Posts",
        type: "n8n-nodes-base.contentDatabase",
        typeVersion: 1,
        position: [460, 300],
      },
      {
        parameters: {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Generate engaging hashtags for social media posts. Return only hashtags, maximum 5 per post.",
            },
            {
              role: "user",
              content: "={{$json.content}}",
            },
          ],
        },
        id: "generate-hashtags",
        name: "Generate Hashtags",
        type: "n8n-nodes-base.openAi",
        typeVersion: 1,
        position: [680, 300],
      },
      {
        parameters: {
          text: "={{$json.content}} {{$json.hashtags}}",
        },
        id: "twitter-post",
        name: "Post to Twitter",
        type: "n8n-nodes-base.twitter",
        typeVersion: 1,
        position: [900, 200],
      },
      {
        parameters: {
          text: "={{$json.content}}",
          visibility: "public",
        },
        id: "linkedin-post",
        name: "Post to LinkedIn",
        type: "n8n-nodes-base.linkedIn",
        typeVersion: 1,
        position: [900, 300],
      },
      {
        parameters: {
          message: "={{$json.content}} {{$json.hashtags}}",
        },
        id: "facebook-post",
        name: "Post to Facebook",
        type: "n8n-nodes-base.facebook",
        typeVersion: 1,
        position: [900, 400],
      },
    ],
    connections: {
      "Schedule Trigger": {
        main: [
          [
            {
              node: "Get Scheduled Posts",
              type: "main",
              index: 0,
            },
          ],
        ],
      },
      "Get Scheduled Posts": {
        main: [
          [
            {
              node: "Generate Hashtags",
              type: "main",
              index: 0,
            },
          ],
        ],
      },
      "Generate Hashtags": {
        main: [
          [
            {
              node: "Post to Twitter",
              type: "main",
              index: 0,
            },
            {
              node: "Post to LinkedIn",
              type: "main",
              index: 0,
            },
            {
              node: "Post to Facebook",
              type: "main",
              index: 0,
            },
          ],
        ],
      },
    },
    active: true,
  },
  "ecommerce-order-fulfillment": {
    name: "E-commerce Order Fulfillment Automation",
    nodes: [
      {
        parameters: {
          events: ["orders/paid"],
        },
        id: "shopify-webhook",
        name: "Shopify Order Webhook",
        type: "n8n-nodes-base.shopifyTrigger",
        typeVersion: 1,
        position: [240, 300],
      },
      {
        parameters: {
          resource: "charge",
          operation: "get",
          chargeId: "={{$json.payment_details.charge_id}}",
        },
        id: "verify-payment",
        name: "Verify Payment",
        type: "n8n-nodes-base.stripe",
        typeVersion: 1,
        position: [460, 300],
      },
      {
        parameters: {
          operation: "update",
          productId: "={{$json.line_items[0].product_id}}",
          updateFields: {
            inventory_quantity: "={{$json.line_items[0].inventory_quantity - $json.line_items[0].quantity}}",
          },
        },
        id: "update-inventory",
        name: "Update Inventory",
        type: "n8n-nodes-base.shopify",
        typeVersion: 1,
        position: [680, 200],
      },
      {
        parameters: {
          resource: "shipment",
          operation: "create",
          orderNumber: "={{$json.order_number}}",
          shipTo: {
            name: "={{$json.shipping_address.name}}",
            street1: "={{$json.shipping_address.address1}}",
            city: "={{$json.shipping_address.city}}",
            state: "={{$json.shipping_address.province}}",
            postalCode: "={{$json.shipping_address.zip}}",
            country: "={{$json.shipping_address.country}}",
          },
        },
        id: "create-shipment",
        name: "Create Shipment",
        type: "n8n-nodes-base.shipStation",
        typeVersion: 1,
        position: [680, 400],
      },
      {
        parameters: {
          to: "={{$json.customer.email}}",
          subject: "Your order #{{$json.order_number}} is on its way!",
          html: `
            <h2>Order Shipped!</h2>
            <p>Hi {{$json.customer.first_name}},</p>
            <p>Great news! Your order #{{$json.order_number}} has been shipped and is on its way to you.</p>
            <p><strong>Tracking Number:</strong> {{$json.tracking_number}}</p>
            <p>You can track your package at: <a href="{{$json.tracking_url}}">{{$json.tracking_url}}</a></p>
            <p>Thank you for your business!</p>
          `,
        },
        id: "send-tracking-email",
        name: "Send Tracking Email",
        type: "n8n-nodes-base.emailSend",
        typeVersion: 1,
        position: [900, 300],
      },
    ],
    connections: {
      "Shopify Order Webhook": {
        main: [
          [
            {
              node: "Verify Payment",
              type: "main",
              index: 0,
            },
          ],
        ],
      },
      "Verify Payment": {
        main: [
          [
            {
              node: "Update Inventory",
              type: "main",
              index: 0,
            },
            {
              node: "Create Shipment",
              type: "main",
              index: 0,
            },
          ],
        ],
      },
      "Create Shipment": {
        main: [
          [
            {
              node: "Send Tracking Email",
              type: "main",
              index: 0,
            },
          ],
        ],
      },
    },
    active: true,
  },
}