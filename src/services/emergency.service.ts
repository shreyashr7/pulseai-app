import api from './api';
import { EmergencyContact, EmergencyAlert } from '../types';
import { mockEmergencyContacts } from '../mocks/healthData';

const USE_MOCK = true;

let mockContacts = [...mockEmergencyContacts];

export const emergencyService = {
    // Get emergency contacts
    getEmergencyContacts: async (): Promise<EmergencyContact[]> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return [...mockContacts];
        }

        const response = await api.get('/emergency/contacts');
        return response.data;
    },

    // Add emergency contact
    addEmergencyContact: async (contact: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const newContact: EmergencyContact = {
                ...contact,
                id: Date.now().toString(),
            };
            mockContacts.push(newContact);
            return newContact;
        }

        const response = await api.post('/emergency/contacts', contact);
        return response.data;
    },

    // Update emergency contact
    updateEmergencyContact: async (id: string, updates: Partial<EmergencyContact>): Promise<EmergencyContact> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const index = mockContacts.findIndex(c => c.id === id);
            if (index === -1) throw new Error('Contact not found');
            mockContacts[index] = { ...mockContacts[index], ...updates };
            return mockContacts[index];
        }

        const response = await api.put(`/emergency/contacts/${id}`, updates);
        return response.data;
    },

    // Delete emergency contact
    deleteEmergencyContact: async (id: string): Promise<void> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 200));
            mockContacts = mockContacts.filter(c => c.id !== id);
            return;
        }

        await api.delete(`/emergency/contacts/${id}`);
    },

    // Trigger SOS
    triggerSOS: async (): Promise<EmergencyAlert> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
                id: Date.now().toString(),
                type: 'Manual',
                timestamp: new Date().toISOString(),
                status: 'Pending',
                triggeredBy: 'User',
            };
        }

        const response = await api.post('/emergency/sos');
        return response.data;
    },

    // Confirm emergency
    confirmEmergency: async (alertId: string): Promise<void> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return;
        }

        await api.post(`/emergency/${alertId}/confirm`);
    },

    // Cancel emergency
    cancelEmergency: async (alertId: string): Promise<void> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return;
        }

        await api.post(`/emergency/${alertId}/cancel`);
    },
};
