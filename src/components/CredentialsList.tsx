import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Credential } from '../types';

type Props = {
    credentials: Credential[];
    onSelect: (credential: Credential) => void;
    onDelete: (id: string) => void;
    onEdit: (credential: Credential) => void;
};

export default function CredentialsList({ credentials, onSelect, onDelete, onEdit }: Props) {
    const handleLongPress = (credential: Credential) => {
        Alert.alert(
            'Manage Credential',
            `What would you like to do with "${credential.name}"?`,
            [
                { text: 'View', onPress: () => onSelect(credential) },
                { text: 'Edit', onPress: () => onEdit(credential) },
                { text: 'Delete', onPress: () => onDelete(credential.id), style: 'destructive' },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const renderItem = ({ item }: { item: Credential }) => (
        <TouchableOpacity
            onPress={() => onSelect(item)}
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
            data={credentials.sort((a, b) => b.createdAt - a.createdAt)}
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