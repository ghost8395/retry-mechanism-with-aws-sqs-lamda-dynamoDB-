import {DequeuedMessage} from '../models/queue.models';

let randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
  
export let addExponentialBackOff = (message: DequeuedMessage): DequeuedMessage => {
  // calculate backoff time
  let base_backoff = 60, visibility_timeout, timeoutWithJitter;

  if (parseInt(message.attributes.ApproximateReceiveCount) === 1) {
    timeoutWithJitter = 0;
  } else {
    // visibility_timeout = interval * exponentialRate^retryNumber
    visibility_timeout =
      base_backoff * 1.5 ** (parseInt(message.attributes.ApproximateReceiveCount) - 2);
    // add jitter
    timeoutWithJitter = randomIntFromInterval(
      base_backoff,
      visibility_timeout
    );
  }
  // addVisibilityToMessage
  message.VisibilityTimeout = timeoutWithJitter;
  return message;
};
  
export let processMessage = (message: DequeuedMessage) => {
    if (message.nonRetriableMessage) {
        throw new Error(
            "Unable to process this msg at this time and need to send to dead queue/dynamoDB"
        );
    }
    console.log(`Processing message ${message} successfully.`);
};