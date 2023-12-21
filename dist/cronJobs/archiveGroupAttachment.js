"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron = __importStar(require("cron"));
const sequelize_1 = require("sequelize");
const groupfileattachment_1 = __importDefault(require("../models/groupfileattachment"));
const archivegroupattachment_1 = __importDefault(require("../models/archivegroupattachment"));
const attachmentJob = new cron.CronJob('35 16 * * *', async () => {
    try {
        const currentDate = new Date();
        const oneDayAgo = new Date();
        oneDayAgo.setDate(currentDate.getDate() - 1); // Get date one day ago
        // Find attachments older than one day
        const oldAttachments = await groupfileattachment_1.default.findAll({
            where: {
                timestamp: {
                    [sequelize_1.Op.lt]: oneDayAgo,
                },
            },
        });
        // Archive old attachments
        const archivePromises = oldAttachments.map(async (attachment) => {
            await archivegroupattachment_1.default.create({
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
    }
    catch (error) {
        console.error('Error in cron job:', error);
    }
}, null, true, 'IST');
attachmentJob.start(); // Start the cron job
