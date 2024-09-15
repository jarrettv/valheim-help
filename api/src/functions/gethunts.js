const { app } = require('@azure/functions');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://kkvszipvbsxezcdrgsut.supabase.co";

app.http('gethunts', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'hunts/list',
    handler: async (request, context) => {
        const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_KEY);
        const { data, error } = await supabase
            .from('hunts')
            .select('id, name, start_at, end_at, status');

        if (error) {
            context.log(`Error inserting data: ${error.message}`);
            return { status: 500, body: { error: error.message } };
        }
        return { jsonBody: data };
    }
});