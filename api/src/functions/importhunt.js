const { app } = require('@azure/functions');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://kkvszipvbsxezcdrgsut.supabase.co";

app.http('importhunt', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'importhunt',
    handler: async (request, context) => {
        const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_KEY);
        const input = await request.json();

        const { data: hunt, error: hunt_error } = await supabase
            .from('hunts')
            .select('id,seed,end_at')
            .eq('id', input.hunt_id);

        if (hunt_error) {
            context.log(`Error loading hunt seed: ${hunt_error.message}`);
            return { status: 500, jsonBody: { error: hunt_error.message } };
        }
    
        const { data: track_hunts, error: track_error } = await supabase
            .from('track_hunts')
            .select('current_score,deaths,logouts,trophies')
            .eq('session_id', hunt[0].seed)
            .eq('player_name', input.player_id)
            .lt('created_at', hunt[0].end_at)
            .order('created_at', { ascending: false })
            .limit(1);
        
        if (track_error) {
            context.log(`Error loading track hunt: ${track_error.message}`);
            return { status: 500, jsonBody: { error: track_error.message } };
        }

        if (!track_hunts || track_hunts.length === 0) {
            context.log('No track hunts found');
            return { status: 404, jsonBody: { error: 'No track hunts found' } };
        }
        
        var trophies = track_hunts[0].trophies.split(',').map(x => x.trim());
        const now = new Date().toISOString();
        const updatePlayer = { score: track_hunts[0].current_score, deaths: track_hunts[0].deaths, relogs: track_hunts[0].logouts, trophies: trophies, updated_at: now };

        const { data: updateData, error: updateError } = await supabase
            .from('hunts_player')
            .update(updatePlayer)
            .eq('hunt_id', hunt[0].id)
            .eq('player_id', input.player_id)
            .select();

        if (updateError) {
            console.log(`Error updating current hunt: ${updateError.message}`);
            return { status: 500, body: { jsonBody: updateError.message } };
        }

        return { jsonBody: { hunt_id: hunt[0].id, player_id: input.player_id } };
    }
});
