const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');
const { getPool } = require('./db');

const sqs = new SQSClient({ region: process.env.AWS_REGION || 'eu-north-1' });
const QUEUE_URL = process.env.ORDER_EVENTS_QUEUE_URL;

// Inserts the customer notification and, for order_placed events, the
// matching admin notification — same behaviour the old direct HTTP
// endpoint provided, just triggered by a queued event instead of a
// synchronous call from order-service.
async function handleOrderPlacedEvent(event) {
  const pool = getPool();
  const { orderId, userId, total } = event;

  await pool.query(
    'INSERT INTO notifications (user_id, type, title, message, order_id) VALUES (?, ?, ?, ?, ?)',
    [
      userId,
      'order_placed',
      '🛍️ Order Placed Successfully',
      `Your order #${orderId} has been placed for $${total}. We are processing it now.`,
      orderId
    ]
  );

  await pool.query(
    'INSERT INTO notifications (user_id, type, title, message, order_id, is_admin_notified) VALUES (0, ?, ?, ?, ?, true)',
    [
      'order_placed',
      `[ADMIN] 🛍️ Order Placed Successfully`,
      `User #${userId}: Order #${orderId} placed for $${total}`,
      orderId
    ]
  );

  console.log(`Processed order_placed event for order ${orderId} from SQS`);
}

// Long-polls SQS in a loop for as long as the process runs. This is
// the asynchronous consumer side of the event-driven flow — it has no
// knowledge of order-service and runs independently of any HTTP request.
async function startOrderEventsConsumer() {
  if (!QUEUE_URL) {
    console.warn('ORDER_EVENTS_QUEUE_URL not set — SQS consumer not started');
    return;
  }

  console.log('Starting SQS order-events consumer...');

  while (true) {
    try {
      const result = await sqs.send(new ReceiveMessageCommand({
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 5,
        WaitTimeSeconds: 15, // long polling — reduces empty-response API calls
        VisibilityTimeout: 30
      }));

      const messages = result.Messages || [];

      for (const msg of messages) {
        try {
          const event = JSON.parse(msg.Body);

          if (event.eventType === 'order_placed') {
            await handleOrderPlacedEvent(event);
          }

          await sqs.send(new DeleteMessageCommand({
            QueueUrl: QUEUE_URL,
            ReceiptHandle: msg.ReceiptHandle
          }));
        } catch (err) {
          // Leave the message in the queue on failure — it will become
          // visible again after VisibilityTimeout and be retried.
          console.error('Failed to process SQS message:', err.message);
        }
      }
    } catch (err) {
      console.error('SQS poll error:', err.message);
      await new Promise(r => setTimeout(r, 5000)); // back off before retrying
    }
  }
}

module.exports = { startOrderEventsConsumer };
