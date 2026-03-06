import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Credential } from '../types';

type Props = {
    credential: Credential;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export default function CredentialDetail({ credential, onBack, onEdit, onDelete }: Props) {
    const [hiddenFields, setHiddenFields] = useState<Set<string>>(
        new Set(credential.fields.filter(f => f.type === 'password').map(f => f.id))
    );

    const toggleField = (fieldId: string) => {
        const newHidden = new Set(hiddenFields);
        if (newHidden.has(fieldId)) {
            newHidden.delete(fieldId);
        } else {
            newHidden.add(fieldId);
        }
        setHiddenFields(newHidden);
    };

    const copyToClipboard = async (text: string) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied!', 'Value copied to clipboard');
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="bg-white p-4 shadow-sm">
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity onPress={onBack} className="mr-4">
                        <Text className="text-blue-500 text-lg">← Back</Text>
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold flex-1">{credential.name}</Text>
                </View>

                <View className="flex-row justify-end space-x-2">
                    <TouchableOpacity onPress={onEdit} className="bg-green-500 px-4 py-2 rounded-lg mr-2">
                        <Text className="text-white font-bold">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDelete} className="bg-red-500 px-4 py-2 rounded-lg">
                        <Text className="text-white font-bold">Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="p-4">
                <Text className="text-sm text-gray-500 mb-2">
                    Created: {new Date(credential.createdAt).toLocaleString()}
                </Text>

                {credential.fields.map((field) => (
                    <View key={field.id} className="bg-white p-4 mb-3 rounded-lg shadow-sm">
                        <Text className="text-sm text-gray-500 mb-1">{field.label}</Text>
                        <View className="flex-row items-center justify-between">
                            <Text className="text-base flex-1 mr-2">
                                {field.type === 'password' && hiddenFields.has(field.id)
                                    ? '••••••••'
                                    : field.value || '(empty)'}
                            </Text>
                            <View className="flex-row">
                                {field.type === 'password' && (
                                    <TouchableOpacity
                                        onPress={() => toggleField(field.id)}
                                        className="mr-2"
                                    >
                                        <Text className="text-blue-500">
                                            {hiddenFields.has(field.id) ? '👁️' : '👁️‍🗨️'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity onPress={() => copyToClipboard(field.value)}>
                                    <Text className="text-blue-500">📋</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}