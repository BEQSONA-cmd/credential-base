import React, { useState, useEffect, use } from 'react';
import { View, Modal, Pressable } from 'react-native';
import { storage } from '../utils/storage';
import Onboarding from '../components/Onboarding';
import { useStatic } from '../components/shared/useStatic';
import { Credential } from '../types';
import { Text, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';


export function CredentialsList({ credentialList }: { credentialList: Credential[] }) {
    const [credentials, setCredentials] = useStatic<Credential[]>('credentials');
    const router = useRouter();

    const onEdit = (credential: Credential) => {
        router.push(`/credential?id=${credential.id}`);
    };
    const onDelete = async (id: string) => {
        Alert.alert(
            'Delete Credential',
            'Are you sure you want to delete this credential?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive', onPress: async () => {
                        await storage.delete(id);
                        setCredentials(credentials.filter(c => c.id !== id));
                    }
                }
            ]
        );
    }

    const handleLongPress = (credential: Credential) => {
        Alert.alert(
            'Manage Credential',
            `What would you like to do with "${credential.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Edit', onPress: () => onEdit(credential) },
                { text: 'Delete', onPress: () => onDelete(credential.id), style: 'destructive' }
            ]
        );
    };

    const renderItem = ({ item }: { item: Credential }) => (
        <TouchableOpacity
            onPress={() => onEdit(item)}
            onLongPress={() => handleLongPress(item)}
            className="bg-white p-4 mb-2 rounded-lg shadow-sm border border-gray-200"
        >
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
                    <Text className="text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()} • {item.fields.length} fields
                    </Text>
                </View>
                <Text className="text-blue-500 text-xs">Tap to view</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={credentialList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerClassName="p-4"
            ListEmptyComponent={
                <View className="flex-1 items-center justify-center py-20">
                    <Text className="text-gray-400 text-lg">No credentials yet</Text>
                    <Text className="text-gray-400">Tap + to add your first credential</Text>
                </View>
            }
        />
    );
}

function AddCredentialModal() {
    const [credentials, setCredentials] = useStatic<Credential[]>('credentials');
    const [modalVisible, setModalVisible] = useStatic('addModalVisible', false);
    const [name, setName] = useState('');
    const [fields, setFields] = useState<Credential['fields']>([
        { id: Date.now().toString(), value: '', type: 'email' },
        { id: (Date.now() + 1).toString(), value: '', type: 'password' }
    ]);

    const handleAddField = () => {
        setFields([...fields, { id: Date.now().toString(), value: '', type: 'text' }]);
    };

    const updateField = (id: string, key: 'type' | 'value', value: string) => {
        setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
    };

    const handleSave = async () => {
        if (name.trim() && fields.every(f => f.value.trim())) {
            const credential: Credential = {
                id: Date.now().toString(),
                name,
                createdAt: new Date(),
                fields
            };
            await storage.add(credential);
            setCredentials([...credentials, credential]);
            setName('');
            setFields([]);
            setModalVisible(false);
        } else {
            Alert.alert('Error', 'Fill all fields');
        }
    };

    useEffect(() => {
        if (!modalVisible) {
            setName('');
            setFields([
                { id: Date.now().toString(), value: '', type: 'email' },
                { id: (Date.now() + 1).toString(), value: '', type: 'password' }
            ]);
        }
    }, [modalVisible]);

    return (
        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
            <View className="p-5 flex-1">
                <Text className="text-l font-bold mb-4">Credential Name:</Text>
                <TextInput
                    placeholder="Credential Name"
                    value={name}
                    onChangeText={setName}
                    className="border p-2.5 mb-5"
                />

                {fields.map(field => (
                    <View key={field.id} className="mb-4">
                        <Picker
                            selectedValue={field.type}
                            onValueChange={value => updateField(field.id, 'type', value)}
                        >
                            <Picker.Item label="Email" value="email" />
                            <Picker.Item label="Password" value="password" />
                            <Picker.Item label="Text" value="text" />
                        </Picker>
                        <TextInput
                            placeholder={`Enter ${field.type}`}
                            value={field.value}
                            onChangeText={value => updateField(field.id, 'value', value)}
                            secureTextEntry={field.type === 'password'}
                            className="border p-2.5 mt-1"
                        />
                    </View>
                ))}

                <Pressable onPress={handleAddField} className="bg-blue-500 p-2.5 mb-2.5">
                    <Text className="text-white">Add Field</Text>
                </Pressable>
                <Pressable onPress={handleSave} className="bg-green-500 p-2.5">
                    <Text className="text-white">Save</Text>
                </Pressable>
            </View>
        </Modal>
    );
}

export default function HomePage() {
    const [credentials, setCredentials] = useStatic<Credential[]>('credentials', []);
    const [showOnboarding, setShowOnboarding] = useState(false);

    const handleOnboardingContinue = async () => {
        setShowOnboarding(false);
        await storage.markInitialized();
    };

    useEffect(() => {
        const loadCredentials = async () => {
            const creds = await storage.getAll();
            setCredentials(creds);
        };
        loadCredentials();
    }, []);

    return (
        <View className="flex-1 bg-gray-50">
            <Onboarding
                visible={showOnboarding}
                onContinue={handleOnboardingContinue}
            />

            {!showOnboarding && (
                <CredentialsList
                    credentialList={credentials}
                />
            )}

            <AddCredentialModal />
        </View>
    );
}