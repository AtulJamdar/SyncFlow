let clients = []; // This will store active connections

// This function sends an event to all connected clients
// In a real app, you would target specific users
export const sendEventToAll = (data) => {
    clients.forEach(client => client.res.write(`data: ${JSON.stringify(data)}\n\n`));
};

export const sseHandler = (req, res) => {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = {
        id: clientId,
        res,
    };
    clients.push(newClient);
    console.log(`Client ${clientId} connected`);

    // Send a welcome message
    const welcomeData = { message: 'Welcome to real-time notifications!' };
    res.write(`data: ${JSON.stringify(welcomeData)}\n\n`);

    // Handle client disconnection
    req.on('close', () => {
        clients = clients.filter(client => client.id !== clientId);
        console.log(`Client ${clientId} disconnected`);
    });
};