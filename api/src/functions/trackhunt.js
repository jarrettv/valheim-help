const { app } = require('@azure/functions');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://kkvszipvbsxezcdrgsut.supabase.co";

app.http('trackhunt', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'trackhunt',
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

        var resp = await updateCurrentHunt(supabase, input);
        if (resp) {
            return resp;
        }
        return { jsonBody: { id: data[0].id } };
    }
});

async function updateCurrentHunt(supabase, input) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
        .from('hunts')
        .select('id,seed')
        .lt('start_at', now)
        .gt('end_at', now);

    if (error) {
        console.log(`Error getting current hunt: ${error.message}`);
        return { status: 500, body: { error: error.message } };
    }

    if (data.length !== 1) {
        console.log('No current hunt found, or too many hunts found');
        return;
    }

    const currentHunt = data[0];

    if (currentHunt.seed !== input.session_id) {
        console.log('Session ID does not match current hunt');
        return;
    }

    console.log(input);
    var trophies = input.trophies.split(',').map(x => x.trim());
    const updatePlayer = { score: input.current_score, deaths: input.deaths, relogs: input.logouts, trophies: trophies, updated_at: now };

    const { updateData, updateError } = await supabase
        .from('hunts_player')
        .update(updatePlayer)
        .eq('hunt_id', currentHunt.id)
        .eq('player_id', input.player_name)
        .select();

    if (updateError) {
        console.log(`Error updating current hunt: ${updateError.message}`);
        return { status: 500, body: { error: updateError.message } };
    }

    return { jsonBody: { hunt_id: currentHunt.id, player_id: input.player_name} };
}