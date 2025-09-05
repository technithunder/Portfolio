import cron from 'node-cron';
import { AuthController } from '@/auth/controllers';

export const sendWhatsAppFollowUpMessages = () => { 
    cron.schedule('*/5 * * * *', async () => {
        console.log('Running WhatsApp follow-up job...');
        await AuthController.sendFollowUpMessages();
    });
}