import { useState, useEffect } from 'react';
import { View, Modal, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../utils/storage';
import { useStatic } from './shared/useStatic';
import { Credential } from '../types';
import { useTheme } from '../context/ThemeContext';

interface AddFieldProps {
    field: Credential['fields'][0];
    updateField: (id: string, key: 'type' | 'value', value: string) => void;
    removeField: (id: string) => void;
}

export function AddField({ field, updateField, removeField }: AddFieldProps) {
    const { isDark } = useTheme();

    const getFieldIcon = (type: string) => {
        switch (type) {
            case 'email': return 'mail-outline';
            case 'password': return 'lock-closed-outline';
            default: return 'document-text-outline';
        }
    };

    return (
        <View key={field.id} className={`mb-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-4`}>
            <View className="flex-row items-center mb-3">
                <View className={`w-8 h-8 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} items-center justify-center mr-3`}>
                    <Ionicons name={getFieldIcon(field.type)} size={16} color="#3B82F6" />
                </View>
                <View className="flex-1 flex-row">
                    {['text', 'email', 'password'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => updateField(field.id, 'type', type)}
                            className={`mr-2 px-3 py-1 rounded-full ${field.type === type
                                ? 'bg-blue-500'
                                : isDark ? 'bg-gray-700' : 'bg-gray-100'
                                }`}
                        >
                            <Text className={`text-xs capitalize ${field.type === type
                                ? 'text-white'
                                : isDark ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity
                    onPress={() => removeField(field.id)}
                    className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>

            <TextInput
                placeholder={`Enter ${field.type}`}
                value={field.value}
                onChangeText={value => updateField(field.id, 'value', value)}
                secureTextEntry={field.type === 'password'}
                className={`${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'} border rounded-lg px-3 py-2 text-base`}
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
            />
        </View>
    );
}

export default function AddCredentialModal() {
    const [credentials, setCredentials] = useStatic<Credential[]>('credentials');
    const [modalVisible, setModalVisible] = useStatic('addModalVisible', false);
    const [name, setName] = useState('');
    const [fields, setFields] = useState<Credential['fields']>([
        { id: Date.now().toString(), value: '', type: 'email' },
        { id: (Date.now() + 1).toString(), value: '', type: 'password' }
    ]);
    const { isDark } = useTheme();

    const handleAddField = () => {
        setFields([...fields, { id: Date.now().toString(), value: '', type: 'text' }]);
    };

    const updateField = (id: string, key: 'type' | 'value', value: string) => {
        setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
    };

    const removeField = (id: string) => {
        if (fields.length > 1) {
            setFields(fields.filter(f => f.id !== id));
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a credential name');
            return;
        }

        const emptyFields = fields.filter(f => !f.value.trim());
        if (emptyFields.length > 0) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const credential: Credential = {
            id: Date.now().toString(),
            name: name.trim(),
            createdAt: new Date(),
            fields: fields.map(f => ({ ...f, value: f.value.trim() }))
        };

        await storage.add(credential);
        setCredentials([...credentials, credential]);
        setModalVisible(false);
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
        <Modal
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
            presentationStyle="pageSheet"
        >
            <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                {/* Modal Header */}
                <View className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} px-6 py-4 border-b flex-row justify-between items-center`}>
                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        className={`w-10 h-10 items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                    >
                        <Ionicons name="close" size={20} color={isDark ? "#9CA3AF" : "#374151"} />
                    </TouchableOpacity>
                    <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        New Credential
                    </Text>
                    <View className="w-10" />
                </View>

                <ScrollView className="flex-1 p-6">
                    {/* Credential Name */}
                    <View className="mb-6">
                        <Text className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                            Credential Name
                        </Text>
                        <TextInput
                            placeholder="e.g., My Facebook Account"
                            value={name}
                            onChangeText={setName}
                            className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'} border rounded-xl px-4 py-3 text-base`}
                            placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                        />
                    </View>

                    {/* Fields */}
                    <Text className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
                        Fields
                    </Text>

                    {fields.map((field, index) => (
                        <AddField
                            key={field.id}
                            field={field}
                            updateField={updateField}
                            removeField={removeField}
                        />
                    ))}

                    {/* Add Field Button */}
                    <TouchableOpacity
                        onPress={handleAddField}
                        className={`mt-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl border p-4 flex-row items-center justify-center`}
                    >
                        <View className={`w-8 h-8 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} items-center justify-center mr-3`}>
                            <Ionicons name="add" size={20} color="#3B82F6" />
                        </View>
                        <Text className="text-blue-500 font-semibold">Add another field</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Save Button */}
                <View className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-t px-6 py-4`}>
                    <TouchableOpacity
                        onPress={handleSave}
                        className="bg-blue-500 py-3 px-4 rounded-xl flex-row items-center justify-center"
                    >
                        <Ionicons name="save-outline" size={20} color="white" />
                        <Text className="text-white font-semibold ml-2">Save Credential</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}