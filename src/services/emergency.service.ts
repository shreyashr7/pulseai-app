import api from './api';
import { EmergencyContact, EmergencyAlert } from '../types';
import { API_CONFIG } from '../config/api.config';
import { mockEmergencyContacts } from '../mocks/healthData';

const USE_MOCK = false;

let mockContacts = [...mockEmergencyContacts];

export const emergencyService = {
    // Get emergency contacts
    getEmergencyContacts: async (): Promise<EmergencyContact[]> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return [...mockContacts];
        }

        try {
            const response = await api.get(API_CONFIG.ENDPOINTS.EMERGENCY_CONTACTS);
            // Transform backend format to app format
            return response.data.map((contact: any) => ({
                id: contact.id.toString(),
                name: contact.name,
                phone: contact.phone,
                relationship: contact.relationship || 'Other',
                isPrimary: contact.is_primary || false,
                priority: contact.is_primary ? 1 : 2,
            }));
        } catch (error) {
            console.warn('Failed to fetch emergency contacts:', error);
            throw error;
        }
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

        // Transform to backend format
        const payload = {
            name: contact.name,
            phone: contact.phone,
            relationship: contact.relationship,
            is_primary: contact.isPrimary || false,
        };

        const response = await api.post(API_CONFIG.ENDPOINTS.EMERGENCY_CONTACTS, payload);
        const data = response.data;
        
        return {
            id: data.id.toString(),
            name: data.name,
            phone: data.phone,
            relationship: data.relationship || 'Other',
            isPrimary: data.is_primary || false,
            priority: data.is_primary ? 1 : 2,
        };
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

        // Transform to backend format
        const payload = {
            name: updates.name,
            phone: updates.phone,
            relationship: updates.relationship,
            is_primary: updates.isPrimary,
        };

        const response = await api.put(`${API_CONFIG.ENDPOINTS.EMERGENCY_CONTACTS}/${id}`, payload);
        const data = response.data;
        
        return {
            id: data.id.toString(),
            name: data.name,
            phone: data.phone,
            relationship: data.relationship || 'Other',
            isPrimary: data.is_primary || false,
            priority: data.is_primary ? 1 : 2,
        };
    },

    // Delete emergency contact
    deleteEmergencyContact: async (id: string): Promise<void> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 200));
            mockContacts = mockContacts.filter(c => c.id !== id);
            return;
        }

        await api.delete(`${API_CONFIG.ENDPOINTS.EMERGENCY_CONTACTS}/${id}`);
    },

    // Trigger SOS
    triggerSOS: async (): Promise<EmergencyAlert> => {
        // SOS is handled locally - call primary contact
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id: Date.now().toString(),
            type: 'Manual',
            timestamp: new Date().toISOString(),
            status: 'Pending',
            triggeredBy: 'User',
        };
    },

    // Confirm emergency
    confirmEmergency: async (alertId: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 300));
    },

    // Cancel emergency
    cancelEmergency: async (alertId: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 300));
    },
};
