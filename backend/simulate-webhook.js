
const fetch = require('node-fetch');

const WEBHOOK_URL = 'http://localhost:3000/api/v1/meta/webhook';

// Sample message payload from Facebook
const samplePayload = {
    object: 'page',
    entry: [
        {
            id: '103231445946962', // Real Page ID from DB
            time: Date.now(),
            messaging: [
                {
                    sender: { id: 'sim_user_001' },
                    recipient: { id: '103231445946962' },
                    timestamp: Date.now(),
                    message: {
                        mid: `mid.${Date.now()}:12345678`,
                        text: 'This is a test message to verify Database Saving logic!',
                    },
                },
            ],
        },
    ],
};

async function simulateWebhook() {
    console.log('🚀 Sending simulated Facebook message...');

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(samplePayload),
        });

        if (response.ok) {
            console.log('✅ Webhook accepted the message!');
            console.log('👉 Check your backend terminal for the "INCOMING WEBHOOK MESSAGE" log.');
        } else {
            console.error('❌ Webhook rejected the message:', response.status, await response.text());
        }
    } catch (error) {
        console.error('❌ Failed to send webhook:', error);
    }
}

simulateWebhook();
