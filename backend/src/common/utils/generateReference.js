import crypto from 'crypto';

export const generateReference = (prefix = 'TXN') => {
  return `${prefix}-${crypto.randomUUID()}`;
};

export const generateVTPassReference = () => {
  const now = new Date();

  const lagosTime = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);

  const parts = Object.fromEntries(
    lagosTime.map(({ type, value }) => [type, value]),
  );

  const timestamp =
    `${parts.year}${parts.month}${parts.day}` + `${parts.hour}${parts.minute}`;

  const randomString = crypto.randomBytes(8).toString('hex');

  return `${timestamp}${randomString}`;
};
