import { io } from 'socket.io-client';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect(token) {
        this.socket = io(process.env.REACT_APP_WS_URL, {
            auth: { token },
            transports: ['websocket']
        });

        this.socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        this.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        // Handle different event types
        ['internship_update', 'report_submitted', 'evaluation_received'].forEach(
            eventType => {
                this.socket.on(eventType, (data) => {
                    const listeners = this.listeners.get(eventType) || [];
                    listeners.forEach(callback => callback(data));
                });
            }
        );
    }

    subscribe(eventType, callback) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        this.listeners.get(eventType).push(callback);
    }

    unsubscribe(eventType, callback) {
        const listeners = this.listeners.get(eventType) || [];
        this.listeners.set(
            eventType,
            listeners.filter(cb => cb !== callback)
        );
    }
}

export const wsService = new WebSocketService(); 