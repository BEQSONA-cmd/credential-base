import { Text, TouchableOpacity, View, ScrollView, Alert, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../../utils/storage';
import { Credential } from '../../types';
import { useStatic } from '../../components/shared/useStatic';

interface CredentialFieldProps {
    field: Credential['fields'][0];
    index: number;
    credential: Credential;
}

function EditingCredentialField({ field, index, credential }: CredentialFieldProps) {
    const [credentials, setCredentials] = useStatic<Credential[]>('credentials');
    const [value, setValue] = useState(field.value);
    const [selectedType, setSelectedType] = useState(field.type);
    const [isEditing, setIsEditing] = useStatic<{ [key: string]: boolean }>('editingFields');

    const handleSave = async () => {
        const updatedCredential = {
            ...credential,
            fields: credential.fields.map(f =>
                f.id === field.id ? { ...f, value, type: selectedType } : f
            )
        };
        await storage.update(credential.id, updatedCredential);
        setIsEditing(prev => ({ ...prev, [field.id]: false }));
        setCredentials(credentials.map(c => c.id === credential.id ? updatedCredential : c));
    };

    const handleCancel = () => {
        setValue(field.value);
        setSelectedType(field.type);
        setIsEditing(prev => ({ ...prev, [field.id]: false }));
    };

    const getFieldIcon = (type: string) => {
        switch (type) {
            case 'email': return 'mail-outline';
            case 'password': return 'lock-closed-outline';
            default: return 'document-text-outline';
        }
    };

    return (
        <View key={field.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3">
                    <Ionicons name={getFieldIcon(selectedType)} size={16} color="#3B82F6" />
                </View>
                <View className="flex-1 flex-row">
                    {(['text', 'email', 'password'] as const).map((type) => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setSelectedType(type)}
                            className={`mr-2 px-3 py-1 rounded-full ${selectedType === type
                                ? 'bg-blue-500'
                                : 'bg-gray-100'
                                }`}
                        >
                            <Text className={`text-xs capitalize ${selectedType === type
                                ? 'text-white'
                                : 'text-gray-600'
                                }`}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity
                    onPress={handleCancel}
                    className="w-8 h-8 items-center justify-center"
                >
                    <Ionicons name="close-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>

            <View className="flex-row items-center">
                <TextInput
                    placeholder={`Enter ${selectedType}`}
                    value={value}
                    onChangeText={setValue}
                    secureTextEntry={selectedType === 'password'}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-base text-gray-800"
                    placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                    onPress={handleSave}
                    className="ml-3 w-8 h-8 items-center justify-center rounded-full bg-green-50"
                >
                    <Ionicons name="checkmark-outline" size={20} color="#10B981" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function CredentialField({ field, index, credential }: CredentialFieldProps) {
    const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
    const [isEditing, setIsEditing] = useStatic<{ [key: string]: boolean }>('editingFields');
    const togglePassword = (fieldId: string) => {
        setShowPassword(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));
    };

    const handleCopy = (text: string) => {
        Alert.alert('Copied!', `${field.type} copied to clipboard`);
    };

    const handleEdit = () => {
        setIsEditing(prev => ({ ...prev, [field.id]: true }));
    }

    const getIconName = (type: string) => {
        switch (type) {
            case 'email': return 'mail-outline';
            case 'password': return 'lock-closed-outline';
            default: return 'document-text-outline';
        }
    };

    return (
        <View
            key={field.id}
            className={`p-4 ${index !== credential.fields.length - 1 ? 'border-b border-gray-100' : ''}`}
        >
            <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3">
                    <Ionicons name={getIconName(field.type)} size={16} color="#3B82F6" />
                </View>
                <Text className="text-sm font-medium text-gray-500 capitalize flex-1">
                    {field.type}
                </Text>
                <TouchableOpacity onPress={handleEdit}
                    className="p-2"
                >
                    <Ionicons name="create-outline" size={20} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            <View className="flex-row items-center ml-11">
                <Text className="flex-1 text-base text-gray-800">
                    {field.type === 'password' && !showPassword[field.id]
                        ? '••••••••'
                        : field.value
                    }
                </Text>
                <View className="flex-row">
                    {field.type === 'password' && (
                        <TouchableOpacity
                            onPress={() => togglePassword(field.id)}
                            className="p-2 mr-2"
                        >
                            <Ionicons
                                name={showPassword[field.id] ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color="#9CA3AF"
                            />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={() => handleCopy(field.value)}
                        className="p-2"
                    >
                        <Ionicons name="copy-outline" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default function CredentialPage() {
    const router = useRouter();
    const [credentials, setCredentials] = useStatic<Credential[]>('credentials');
    const params = useLocalSearchParams<{ id?: string }>();
    const [credential, setCredential] = useState<Credential | null>(null);
    const [fields, setFields] = useState<Credential['fields']>([]);
    const [isEditing, setIsEditing] = useStatic<{ [key: string]: boolean }>('editingFields', {});

    const handleDelete = () => {
        Alert.alert(
            'Delete Credential',
            'Are you sure you want to delete this credential?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        if (credential?.id) {
                            await storage.delete(credential.id);
                            const updatedCredentials = credentials.filter((c) => c.id !== credential.id);
                            setCredentials(updatedCredentials);
                            router.back();
                        }
                    }
                }
            ]
        );
    };

    const handleAddField = async () => {
        const newField = {
            id: `${Date.now()}`,
            type: 'text',
            value: ''
        };
        const updatedCredential = {
            ...credential,
            fields: [...fields, newField]
        } as Credential;
        await storage.update(credential!.id, updatedCredential);
        setFields(updatedCredential.fields);
        setCredentials(credentials.map(c => c.id === credential!.id ? updatedCredential : c));
        setIsEditing(prev => ({ ...prev, [newField.id]: true }));
    };
    const handleLongPressField = (fieldId: string) => {
        Alert.alert(
            'Field Options',
            'What would you like to do with this field?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const updatedCredential = {
                            ...credential,
                            fields: fields.filter(f => f.id !== fieldId)
                        } as Credential;
                        await storage.update(credential!.id, updatedCredential);
                        setFields(updatedCredential.fields);
                        setCredentials(credentials.map(c => c.id === credential!.id ? updatedCredential : c));
                    }
                }
            ]
        );
    };

    useEffect(() => {
        async function getCredential() {
            if (params.id) {
                const newCredential = await storage.get(params.id);
                if (newCredential != null) {
                    setCredential(newCredential);
                    setFields(newCredential.fields);
                } else {
                    router.back();
                }
            }
        }
        getCredential();
    }, [params.id, isEditing]);



    if (!credential) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <View className="bg-white p-8 rounded-2xl shadow-sm">
                    <Text className="text-base text-gray-400">Loading credential...</Text>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white border-b border-gray-100">
                <View className="flex-row items-center px-4 py-3">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
                    >
                        <Ionicons name="arrow-back" size={20} color="#374151" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-lg font-semibold text-gray-800 ml-2" numberOfLines={1}>
                        {credential.name}
                    </Text>
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="w-10 h-10 items-center justify-center rounded-full bg-red-50"
                    >
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Credential Fields */}
                <View className="bg-white rounded-xl overflow-hidden border border-gray-100">
                    {fields.map((field, index) => (
                        <TouchableOpacity
                            key={field.id}
                            onLongPress={() => handleLongPressField(field.id)}
                        >
                            {
                                isEditing[field.id] ? (
                                    <EditingCredentialField key={field.id} field={field} index={index} credential={credential} />
                                ) : (
                                    <CredentialField key={field.id} field={field} index={index} credential={credential} />
                                )
                            }
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    onPress={handleAddField}
                    className="flex-row items-center justify-center py-3 mb-6"
                >
                    <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
                        <Ionicons name="add" size={20} color="#3B82F6" />
                    </View>
                    <Text className="text-blue-500 font-medium">Add another field</Text>
                </TouchableOpacity>

                {/* Metadata */}
                <View className="mt-4 mb-16 bg-white rounded-xl p-4 border border-gray-100">
                    <Text className="text-xs text-gray-400">
                        Created: {new Date(credential.createdAt).toLocaleDateString()}
                    </Text>
                    <Text className="text-xs text-gray-400 mt-1">
                        ID: {credential.id.slice(0, 8)}...
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}