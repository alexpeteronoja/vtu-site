import cron from 'node-cron';
import { reconcilePendingPaymentService } from '../../modules/payment/paymentService.js';
import { logger } from '../utils/logger.js';

export const startPaymentReconciliation = () => {
  cron.schedule(
    '*/30 * * * *',
    async () => {
      try {
        console.log('started');
        const results = await reconcilePendingPaymentService({
          olderThanMinutes: 5,
          limit: 100,
        });

        if (results.checked > 0) {
          console.log(
            `reconcile payment: checked=${results.checked} resolved=${results.resolved} failed=${results.failed}`,
          );
        }

        if (results.failed > 0) {
          // Wire this into alerting that is email
          // a persistently failing reference usually means a genuine  mismatch or an API credential issue that needs a human.

          logger.error('reconcile payment failures:', results.errors);
        }
      } catch (err) {
        // alerting on immediately no fundings get reconciled until fixed.
        logger.error('reconcile funding job crashed:', err.message);
      }
    },
    { noOverlap: true },
  );
};
