const { app } = require('@azure/functions');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://kkvszipvbsxezcdrgsut.supabase.co";

app.http('getplayers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'hunts/{id:int}/players',
    handler: async (request, context) => {
        const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_KEY);
        const { id } = request.params;

        console.log(request);
        const { data, error } = await supabase
            .from('hunts_player')
            .select()
            .eq('hunt_id', id);

        if (error) {
            context.log(`Error inserting data: ${error.message}`);
            return { status: 500, body: { error: error.message } };
        }
        return { jsonBody: data };
    }
});