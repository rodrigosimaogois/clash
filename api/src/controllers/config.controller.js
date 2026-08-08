import fs from 'node:fs';
import path from 'node:path';

export class ConfigController {

    // update token remotely
    static updateToken(req, res) {
        const adminSecret = req.headers['x-admin-secret'];
        const { newToken } = req.body;

        // 1. security
        if (adminSecret !== process.env.ADMIN_SECRET) {
            return res.status(401).json({ error: 'Not authorized.' });
        }

        if (!newToken) {
            return res.status(400).json({ error: 'The newToken parameter is required.' });
        }

        // 2. update memory
        process.env.CLASH_API_TOKEN = newToken;

        // 3. update and persist in .env file
        try {
            const envPath = path.resolve('.env');
            let envContent = '';

            if (fs.existsSync(envPath)) {
                envContent = fs.readFileSync(envPath, 'utf8');
            }

            if (envContent.includes('CLASH_API_TOKEN=')) {
                envContent = envContent.replace(/CLASH_API_TOKEN=.*/, `CLASH_API_TOKEN=${newToken}`);
            } else {
                envContent += `\nCLASH_API_TOKEN=${newToken}`;
            }

            fs.writeFileSync(envPath, envContent, 'utf8');

            return res.json({
                success: true,
                message: 'Token updated successfully in memory and in the .env file!'
            });
        } catch (error) {
            return res.json({
                success: true,
                message: 'Token updated only in execution memory.',
                warning: `Failed to save to .env file: ${error.message}`
            });
        }
    }

    // check status of the token
    static getStatus(req, res) {
        const tokenExists = !!process.env.CLASH_API_TOKEN;
        const tokenPreview = tokenExists
            ? `${process.env.CLASH_API_TOKEN}`
            : 'NNot configured';

        return res.json({
            status: 'online',
            tokenConfigured: tokenExists,
            tokenPreview
        });
    }
}