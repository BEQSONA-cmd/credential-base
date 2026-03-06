import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { storage } from '../utils/storage';
import { Credential } from '../types';
import CredentialsList from '../components/CredentialsList';
import CredentialForm from '../components/CredentialForm';
import CredentialDetail from '../components/CredentialDetail';
import Onboarding from '../components/Onboarding';

export default function HomePage() {
    const [credentials, setCredentials] = useState<Credential[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
    const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [storageError, setStorageError] = useState<string | null>(null);

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            // Check if this is first launch
            const isFirstLaunch = await storage.isFirstLaunch();

            if (isFirstLaunch) {
                setShowOnboarding(true);
                setIsLoading(false);
                return;
            }

            // Try to load credentials
            await loadCredentials();
        } catch (error) {
            console.error('Failed to initialize:', error);
            setStorageError('Failed to initialize storage. Please restart the app.');
            setIsLoading(false);
        }
    };

    const loadCredentials = async () => {
        setIsLoading(true);
        try {
            const data = await storage.getAll();
            setCredentials(data);
            setStorageError(null);
        } catch (error) {
            console.error('Error loading credentials:', error);
            setStorageError('Failed to load credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveCredential = async (credential: Credential) => {
        let success;
        if (editingCredential) {
            success = await storage.update(credential.id, credential);
        } else {
            success = await storage.add(credential);
        }

        if (success) {
            await loadCredentials();
            setModalVisible(false);
            setEditingCredential(null);
        }
    };

    const handleDeleteCredential = async (id: string) => {
        Alert.alert(
            'Delete Credential',
            'Are you sure you want to delete this credential?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await storage.delete(id);
                        if (success) {
                            await loadCredentials();
                            if (selectedCredential?.id === id) {
                                setSelectedCredential(null);
                            }
                        }
                    }
                }
            ]
        );
    };

    const handleOnboardingContinue = async () => {
        setShowOnboarding(false);

        // Mark as initialized
        await storage.markInitialized();

        // Add a welcome credential
        const welcomeCredential: Credential = {
            id: 'welcome-' + Date.now(),
            name: 'Welcome to PassVault!',
            createdAt: Date.now(),
            fields: [
                {
                    id: '1',
                    label: 'Getting Started',
                    value: 'Tap the + button to add your first credential',
                    type: 'text'
                },
                {
                    id: '2',
                    label: 'Features',
                    value: '• Add custom fields\n• Search credentials\n• Export data\n• All stored locally',
                    type: 'multiline'
                }
            ]
        };

        const success = await storage.add(welcomeCredential);
        if (success) {
            await loadCredentials();
        }
    };

    const handleRetry = () => {
        setStorageError(null);
        setIsLoading(true);
        initializeApp();
    };

    if (storageError) {
        return (
            <View className="flex-1 items-center justify-center bg-white p-4">
                <Text className="text-red-500 text-lg mb-4 text-center">{storageError}</Text>
                <TouchableOpacity
                    onPress={handleRetry}
                    className="bg-blue-600 px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-bold">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-4 text-gray-600">Loading your vault...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <Onboarding
                visible={showOnboarding}
                onContinue={handleOnboardingContinue}
            />

            {selectedCredential ? (
                <CredentialDetail
                    credential={selectedCredential}
                    onBack={() => setSelectedCredential(null)}
                    onEdit={() => {
                        setEditingCredential(selectedCredential);
                        setSelectedCredential(null);
                        setModalVisible(true);
                    }}
                    onDelete={() => {
                        handleDeleteCredential(selectedCredential.id);
                        setSelectedCredential(null);
                    }}
                />
            ) : (
                <>
                    <CredentialsList
                        credentials={credentials}
                        onSelect={setSelectedCredential}
                        onDelete={handleDeleteCredential}
                        onEdit={(cred) => {
                            setEditingCredential(cred);
                            setModalVisible(true);
                        }}
                    />

                    <TouchableOpacity
                        onPress={() => {
                            setEditingCredential(null);
                            setModalVisible(true);
                        }}
                        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
                    >
                        <Text className="text-white text-3xl">+</Text>
                    </TouchableOpacity>
                </>
            )}

            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => {
                    setModalVisible(false);
                    setEditingCredential(null);
                }}
            >
                <CredentialForm
                    onSave={handleSaveCredential}
                    onCancel={() => {
                        setModalVisible(false);
                        setEditingCredential(null);
                    }}
                    initialData={editingCredential || undefined}
                />
            </Modal>
        </View>
    );
}