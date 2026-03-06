import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Credential, CredentialField } from '../types';

type Props = {
    onSave: (credential: Credential) => void;
    onCancel: () => void;
    initialData?: Credential;
};

export default function CredentialForm({ onSave, onCancel, initialData }: Props) {
    const [name, setName] = useState(initialData?.name || '');
    const [fields, setFields] = useState<CredentialField[]>(
        initialData?.fields || [
            { id: uuidv4(), label: 'Username/Email', value: '', type: 'text' },
            { id: uuidv4(), label: 'Password', value: '', type: 'password' },
        ]
    );

    const addField = () => {
        const newField: CredentialField = {
            id: uuidv4(),
            label: 'New Field',
            value: '',
            type: 'text',
        };
        setFields([...fields, newField]);
    };

    const updateField = (id: string, updates: Partial<CredentialField>) => {
        setFields(fields.map(field =>
            field.id === id ? { ...field, ...updates } : field
        ));
    };

    const removeField = (id: string) => {
        setFields(fields.filter(field => field.id !== id));
    };

    const handleSave = () => {
        if (!name.trim()) return;

        const credential: Credential = {
            id: initialData?.id || uuidv4(),
            name: name.trim(),
            createdAt: initialData?.createdAt || Date.now(),
            fields: fields.filter(f => f.label.trim() && f.value.trim()),
        };

        onSave(credential);
    };

    return (
        <ScrollView className="flex-1 bg-gray-50 p-4">
            <View className="bg-white rounded-lg p-4 shadow-sm">
                <Text className="text-lg font-bold mb-4">Credential Name</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg p-3 mb-6"
                    placeholder="e.g., My Facebook"
                    value={name}
                    onChangeText={setName}
                />

                <Text className="text-lg font-bold mb-4">Fields</Text>
                {fields.map((field) => (
                    <View key={field.id} className="mb-4 border-b border-gray-200 pb-4">
                        <View className="flex-row items-center mb-2">
                            <TextInput
                                className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
                                placeholder="Field label"
                                value={field.label}
                                onChangeText={(text) => updateField(field.id, { label: text })}
                            />
                            <TouchableOpacity
                                onPress={() => removeField(field.id)}
                                className="bg-red-500 px-3 py-2 rounded-lg"
                            >
                                <Text className="text-white">✕</Text>
                            </TouchableOpacity>
                        </View>

                        {field.type === 'multiline' ? (
                            <TextInput
                                className="border border-gray-300 rounded-lg p-3 h-24"
                                placeholder="Value"
                                value={field.value}
                                onChangeText={(text) => updateField(field.id, { value: text })}
                                multiline
                                textAlignVertical="top"
                            />
                        ) : (
                            <TextInput
                                className="border border-gray-300 rounded-lg p-3"
                                placeholder="Value"
                                value={field.value}
                                onChangeText={(text) => updateField(field.id, { value: text })}
                                secureTextEntry={field.type === 'password'}
                            />
                        )}
                    </View>
                ))}

                <View className="flex-row justify-between mt-4">
                    <TouchableOpacity
                        onPress={addField}
                        className="bg-green-500 px-4 py-3 rounded-lg flex-1 mr-2"
                    >
                        <Text className="text-white text-center font-bold">+ Add Field</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            const newField: CredentialField = {
                                id: uuidv4(),
                                label: 'Multi-line Field',
                                value: '',
                                type: 'multiline',
                            };
                            setFields([...fields, newField]);
                        }}
                        className="bg-purple-500 px-4 py-3 rounded-lg flex-1 ml-2"
                    >
                        <Text className="text-white text-center font-bold">+ Add Text Area</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-between mt-6">
                    <TouchableOpacity
                        onPress={onCancel}
                        className="bg-gray-500 px-6 py-3 rounded-lg flex-1 mr-2"
                    >
                        <Text className="text-white text-center font-bold">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSave}
                        className="bg-blue-600 px-6 py-3 rounded-lg flex-1 ml-2"
                    >
                        <Text className="text-white text-center font-bold">Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}