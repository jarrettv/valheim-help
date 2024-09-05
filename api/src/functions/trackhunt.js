const { app } = require('@azure/functions');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://kkvszipvbsxezcdrgsut.supabase.co";

app.http('trackhunt', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_KEY);

        const input = await request.json();

        // Insert data into Supabase
        const { data, error } = await supabase
            .from('track_hunts')
            .insert([input])
            .select();

        if (error) {
            context.log(`Error inserting data: ${error.message}`);
            return { status: 500, body: { error: error.message } };
        }
        
        context.log('Data inserted:', data);
        return { jsonBody: { id: data[0].id } };
    }
});
