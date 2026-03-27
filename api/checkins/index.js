const { Client } = require('pg');

module.exports = async function (context, req) {
    context.log('Checkins API processed a request.');

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        context.res = { status: 500, body: { error: "DATABASE_URL is not configured." } };
        return;
    }

    const client = new Client({ connectionString });

    try {
        await client.connect();

        if (req.method === 'GET') {
            // Fetch history
            const result = await client.query('SELECT * FROM checkins ORDER BY created_at ASC LIMIT 10');
            context.res = {
                status: 200,
                body: result.rows
            };
        } else if (req.method === 'POST') {
            // Save check-in
            const { sleep, stress, cognitive, social, food_security, composite, journal } = req.body;
            
            const query = `
                INSERT INTO checkins (sleep, stress, cognitive, social, food_security, composite, journal)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `;
            const values = [sleep, stress, cognitive, social, food_security, composite, journal];
            
            const result = await client.query(query, values);
            context.res = {
                status: 201,
                body: result.rows[0]
            };
        }
    } catch (error) {
        context.log.error('Database error:', error);
        context.res = {
            status: 500,
            body: { error: error.message }
        };
    } finally {
        await client.end();
    }
}
