import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Share } from 'react-native';
import { storage } from '../../utils/storage';
import { Credential } from '../../types';

export default function Page1() {
    const [searchTerm, setSearchTerm] = useState('');
    const [credentials, setCredentials] = useState<Credential[]>([]);
    const [filtered, setFiltered] = useState<Credential[]>([]);

    useEffect(() => {
        loadCredentials();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFiltered([]);
        } else {
            const term = searchTerm.toLowerCase();
            const results = credentials.filter(cred =>
                cred.name.toLowerCase().includes(term) ||
                cred.fields.some(field =>
                    field.label.toLowerCase().includes(term) ||
                    field.value.toLowerCase().includes(term)
                )
            );
            setFiltered(results);
        }
    }, [searchTerm, credentials]);

    const loadCredentials = async () => {
        const data = await storage.getAll();
        setCredentials(data);
    };

    const exportData = async () => {
        try {
            const data = JSON.stringify(credentials, null, 2);
            await Share.share({
                message: data,
                title: 'PassVault Export',
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to export data');
        }
    };

    const handleClearAllData = async () => {
        const success = await storage.clearAll();
        if (success) {
            await loadCredentials();
            Alert.alert('Success', 'All data has been cleared');
        }
    };

    const getStats = () => {
        const total = credentials.length;
        const totalFields = credentials.reduce((acc, cred) => acc + cred.fields.length, 0);
        return { total, totalFields };
    };

    const stats = getStats();

    return (
        <ScrollView className="flex-1 bg-gray-50 p-4">
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <Text className="text-lg font-bold mb-2">Search Credentials</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg p-3"
                    placeholder="Search by name or content..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>

            {searchTerm !== '' && (
                <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                    <Text className="font-bold mb-2">Search Results ({filtered.length})</Text>
                    {filtered.length === 0 ? (
                        <Text className="text-gray-400">No matches found</Text>
                    ) : (
                        filtered.map(cred => (
                            <View key={cred.id} className="border-b border-gray-200 py-2">
                                <Text className="font-bold text-blue-600">{cred.name}</Text>
                                {cred.fields.map(field => (
                                    <Text key={field.id} className="text-sm text-gray-600 ml-2">
                                        {field.label}: {field.value.substring(0, 20)}...
                                    </Text>
                                ))}
                            </View>
                        ))
                    )}
                </View>
            )}

            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <Text className="text-lg font-bold mb-2">Statistics</Text>
                <View className="flex-row justify-between">
                    <View>
                        <Text className="text-gray-500">Total Credentials</Text>
                        <Text className="text-3xl font-bold text-blue-600">{stats.total}</Text>
                    </View>
                    <View>
                        <Text className="text-gray-500">Total Fields</Text>
                        <Text className="text-3xl font-bold text-green-600">{stats.totalFields}</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                onPress={exportData}
                className="bg-purple-600 p-4 rounded-lg shadow-sm mb-4"
            >
                <Text className="text-white text-center font-bold text-lg">📤 Export Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleClearAllData}
                className="bg-red-600 p-4 rounded-lg shadow-sm"
            >
                <Text className="text-white text-center font-bold text-lg">🗑️ Clear All Data</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}