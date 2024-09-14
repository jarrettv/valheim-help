const { app } = require('@azure/functions');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://kkvszipvbsxezcdrgsut.supabase.co";

app.http('setupplayers', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'hunts/players',
    handler: async (request, context) => {
        const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_KEY);
        const input = await request.json();

        console.log(input);

        // Insert data into Supabase
        const { data, error } = await supabase
            .from('hunts_player')
            .insert([...input])
            .select();

        if (error) {
            context.log(`Error inserting data: ${error.message}`);
            return { status: 500, body: { error: error.message } };
        }
        return { jsonBody: { count: data.length } };
    }
});
