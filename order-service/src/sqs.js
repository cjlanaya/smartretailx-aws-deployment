const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

const sqs = new SQSClient({ region: process.env.AWS_REGION || 'eu-north-1' });
const QUEUE_URL = process.env.ORDER_EVENTS_QUEUE_URL;

// Publishes an order-placed event to SQS. This decouples order-service
// from notification-service — order-service does not need to know who
// consumes the event, or wait for a response, unlike the previous
// synchronous HTTP call.
async function publishOrderPlaced({ orderId, userId, total, itemCount }) {
  if (!QUEUE_URL) {
    console.warn('ORDER_EVENTS_QUEUE_URL not set — skipping SQS publish');
    return;
  }

  const message = {
    eventType: 'order_placed',
    orderId,
    userId,
    total,
    itemCount,
    timestamp: new Date().toISOString()
  };

  try {
    await sqs.send(new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(message)
    }));
    console.log(`Published order_placed event for order ${orderId} to SQS`);
  } catch (err) {
    // Publishing failure should not fail the order itself — the order
    // was already committed to the database successfully. We log and
    // move on; a production system would add a retry/dead-letter path.
    console.error('Failed to publish order_placed event to SQS:', err.message);
  }
}

module.exports = { publishOrderPlaced };
