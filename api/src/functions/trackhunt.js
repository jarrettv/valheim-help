const { app } = require('@azure/functions');

app.http('trackhunt', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const data = await request.json();
        
        context.log(`Received data: ${JSON.stringify(data)}`);

        return {jsonBody: data};
    }
});
