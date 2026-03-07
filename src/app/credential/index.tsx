import { Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../../utils/storage';
import { Credential } from '../../types';

function CredentialField({ field, index, credential }: { field: Credential['fields'][0], index: number, credential: Credential }) {
    const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
    const togglePassword = (fieldId: string) => {
        setShowPassword(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));
    };

    const handleCopy = (text: string) => {
        Alert.alert('Copied!', `${field.type} copied to clipboard`);
    };

    const handleEdit = () => {
        Alert.alert('Edit Field', 'Edit functionality coming soon!');
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
    const params = useLocalSearchParams<{ id?: string }>();
    const [credential, setCredential] = useState<Credential | null>(null);

    useEffect(() => {
        async function getCredential() {
            if (params.id) {
                const newCredential = await storage.get(params.id);
                if (newCredential != null) {
                    setCredential(newCredential);
                } else {
                    router.back();
                }
            }
        }
        getCredential();
    }, [params.id]);

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
                            router.back();
                        }
                    }
                }
            ]
        );
    };

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
                    {credential.fields.map((field, index) => (
                        <CredentialField key={field.id} field={field} index={index} credential={credential} />
                    ))}
                </View>

                {/* Edit Button */}
                <TouchableOpacity
                    className="mt-6 bg-blue-500 py-3 px-4 rounded-xl flex-row items-center justify-center"
                    onPress={() => Alert.alert('Edit', 'Edit functionality coming soon!')}
                >
                    <Ionicons name="create-outline" size={20} color="white" />
                    <Text className="text-white font-semibold ml-2">Edit Credential</Text>
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