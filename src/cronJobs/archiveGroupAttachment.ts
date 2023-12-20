import * as cron from 'cron';
import { Op } from 'sequelize';
import GroupFileAttachment from '../models/groupfileattachment';
import ArchiveGroupAttachment from '../models/archivegroupattachment';

const attachmentJob = new cron.CronJob('35 16 * * *', async () => {

    try {
        const currentDate = new Date();
        const oneDayAgo = new Date();
        oneDayAgo.setDate(currentDate.getDate() - 1); // Get date one day ago

        // Find attachments older than one day
        const oldAttachments = await GroupFileAttachment.findAll({
            where: {
                timestamp: {
                    [Op.lt]: oneDayAgo,
                },
            },
        });

        // Archive old attachments
        const archivePromises = oldAttachments.map(async (attachment) => {
            await ArchiveGroupAttachment.create({
                sender_id: attachment.sender_id,
                group_id: attachment.group_id,
                file_name: attachment.file_name,
                file_type: attachment.file_type,
                file_url: attachment.file_url,
                file_size: attachment.file_size,
                timestamp: attachment.timestamp,
            });
            await attachment.destroy();
        });

        await Promise.all(archivePromises);

        console.log('Cron job completed: Archived old attachments');
    } catch (error) {
        console.error('Error in cron job:', error);
    }
}, null, true, 'IST');

attachmentJob.start(); // Start the cron job
