import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import { Credential } from '../types';

const STORAGE_KEY = 'passvault_credentials';
const INIT_KEY = 'passvault_initialized';

class StorageService {
    private isAvailable: boolean | null = null;

    constructor() {
        this.checkAvailability();
    }

    private async checkAvailability(): Promise<boolean> {
        if (this.isAvailable !== null) return this.isAvailable;

        try {
            // Test AsyncStorage with a simple operation
            await AsyncStorage.setItem('__test', 'test');
            const value = await AsyncStorage.getItem('__test');
            await AsyncStorage.removeItem('__test');

            this.isAvailable = value === 'test';
            return this.isAvailable;
        } catch (error) {
            this.isAvailable = false;
            return false;
        }
    }

    async isFirstLaunch(): Promise<boolean> {
        try {
            const initialized = await AsyncStorage.getItem(INIT_KEY);
            return initialized !== 'true';
        } catch {
            return true;
        }
    }

    async markInitialized(): Promise<void> {
        try {
            await AsyncStorage.setItem(INIT_KEY, 'true');
        } catch (error) {
            console.error('Error marking initialized:', error);
        }
    }

    async getAll(): Promise<Credential[]> {
        const available = await this.checkAvailability();

        if (!available) {
            Alert.alert(
                'Storage Error',
                'Unable to access device storage. Please make sure you have granted storage permissions and try restarting the app.'
            );
            return [];
        }

        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            Alert.alert(
                'Error',
                'Failed to load credentials. Please try again.'
            );
            return [];
        }
    }

    async get(id: string): Promise<Credential | null> {
        try {
            const credentials = await this.getAll();
            return credentials.find(c => c.id === id) || null;
        } catch (error) {
            Alert.alert(
                'Error',
                'Failed to load credential. Please try again.'
            );
            return null;
        }
    }

    async save(credentials: Credential[]): Promise<boolean> {
        const available = await this.checkAvailability();

        if (!available) {
            Alert.alert(
                'Storage Error',
                'Unable to access device storage. Please make sure your device has available storage space and try again.'
            );
            return false;
        }

        try {
            const jsonValue = JSON.stringify(credentials);
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue);

            // Verify the save was successful
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            return saved === jsonValue;
        } catch (error) {
            console.error('Error saving credentials:', error);
            return false;
        }
    }

    async add(credential: Credential): Promise<boolean> {
        try {
            const credentials = await this.getAll();
            credentials.push(credential);
            return this.save(credentials);
        } catch (error) {
            console.error('Error adding credential:', error);
            return false;
        }
    }

    async update(id: string, updatedCredential: Credential): Promise<boolean> {
        try {
            const credentials = await this.getAll();
            const index = credentials.findIndex(c => c.id === id);
            if (index !== -1) {
                credentials[index] = updatedCredential;
                return this.save(credentials);
            }
            return false;
        } catch (error) {
            console.error('Error updating credential:', error);
            return false;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const credentials = await this.getAll();
            const filtered = credentials.filter(c => c.id !== id);
            return this.save(filtered);
        } catch (error) {
            console.error('Error deleting credential:', error);
            return false;
        }
    }

    async clearAll(): Promise<boolean> {
        return new Promise((resolve) => {
            Alert.alert(
                'Clear All Data',
                'Are you sure you want to delete ALL credentials? This action cannot be undone.',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => resolve(false)
                    },
                    {
                        text: 'Delete All',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await AsyncStorage.removeItem(STORAGE_KEY);
                                // Don't remove INIT_KEY so we don't show onboarding again
                                resolve(true);
                            } catch (error) {
                                console.error('Error clearing data:', error);
                                Alert.alert('Error', 'Failed to clear data');
                                resolve(false);
                            }
                        }
                    }
                ]
            );
        });
    }
}

export const storage = new StorageService();