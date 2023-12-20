import * as cron from 'cron';
import { Op } from 'sequelize';
import GroupMessage from '../models/groupmessage';
import ArchiveGroupMessage from '../models/archivegroupmessage';

const job = new cron.CronJob('30 15 * * *', async () => {

    try {
        const currentDate = new Date();
        const oneDayAgo = new Date();
        oneDayAgo.setDate(currentDate.getDate() - 1); // Get date one day ago

        // Find messages older than one day
        const oldMessages = await GroupMessage.findAll({
            where: {
                timestamp: {
                    [Op.lt]: oneDayAgo,
                },
            },
        });

        // Archive old messages
        const archivePromises = oldMessages.map(async (message) => {
            await ArchiveGroupMessage.create({
                sender_id: message.sender_id,
                group_id: message.group_id,
                message: message.message,
                message_type: message.message_type,
                timestamp: message.timestamp,
            });
            await message.destroy();
        });

        await Promise.all(archivePromises);

        console.log('Cron job completed: Archived old messages');
    } catch (error) {
        console.error('Error in cron job:', error);
    }
}, null, true, 'IST');

job.start(); // Start the cron job
