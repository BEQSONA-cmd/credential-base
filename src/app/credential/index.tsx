import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../../utils/storage';
import { Credential } from '../../types';
import { useStatic } from '../../components/shared/useStatic';
import { useTheme } from '../../context/ThemeContext';
import CustomAlert from '../../components/shared/CustomAlert';
import { CredentialField, EditingCredentialField } from './CredentialField';

export default function CredentialPage() {
    const router = useRouter();
    const [credentials, setCredentials] = useStatic<Credential[]>('credentials');
    const params = useLocalSearchParams<{ id?: string }>();
    const [credential, setCredential] = useState<Credential | null>(null);
    const [fields, setFields] = useState<Credential['fields']>([]);
    const [isEditing, setIsEditing] = useStatic<{ [key: string]: boolean }>('editingFields', {});
    const { isDark } = useTheme();

    // Alert states
    const [deleteAlert, setDeleteAlert] = useState<{ visible: boolean }>({ visible: false });
    const [fieldOptionsAlert, setFieldOptionsAlert] = useState<{ visible: boolean; fieldId?: string }>({ visible: false });

    const handleDelete = () => {
        setDeleteAlert({ visible: true });
    };

    const confirmDelete = async () => {
        if (credential?.id) {
            await storage.delete(credential.id);
            const updatedCredentials = credentials.filter((c) => c.id !== credential.id);
            setCredentials(updatedCredentials);
            router.back();
        }
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
        setFieldOptionsAlert({ visible: true, fieldId });
    };

    const confirmDeleteField = async (fieldId: string) => {
        const updatedCredential = {
            ...credential,
            fields: fields.filter(f => f.id !== fieldId)
        } as Credential;
        await storage.update(credential!.id, updatedCredential);
        setFields(updatedCredential.fields);
        setCredentials(credentials.map(c => c.id === credential!.id ? updatedCredential : c));
        setFieldOptionsAlert({ visible: false });
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
            <View className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <View className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl shadow-sm`}>
                    <Text className={`text-base ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Loading credential...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <View className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-b`}>
                <View className="flex-row items-center px-4 py-3">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className={`w-10 h-10 items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                    >
                        <Ionicons name="arrow-back" size={20} color={isDark ? "#9CA3AF" : "#374151"} />
                    </TouchableOpacity>
                    <Text className={`flex-1 text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} ml-2`} numberOfLines={1}>
                        {credential.name}
                    </Text>
                    <TouchableOpacity
                        onPress={handleDelete}
                        className={`w-10 h-10 items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                    >
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Credential Fields */}
                <View className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl overflow-hidden border`}>
                    {fields.map((field, index) => (
                        <TouchableOpacity
                            key={field.id}
                            onLongPress={() => handleLongPressField(field.id)}
                            activeOpacity={0.7}
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

                {/* add Button */}
                <TouchableOpacity
                    onPress={handleAddField}
                    className={`mt-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl border p-4 flex-row items-center justify-center`}
                >
                    <View className={`w-8 h-8 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} items-center justify-center mr-3`}>
                        <Ionicons name="add" size={20} color="#3B82F6" />
                    </View>
                    <Text className="text-blue-500 font-semibold">Add another field</Text>
                </TouchableOpacity>

                {/* Metadata */}
                <View className={`mt-4 mb-16 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl p-4 border`}>
                    <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Created: {new Date(credential.createdAt).toLocaleDateString()}
                    </Text>
                    <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                        ID: {credential.id.slice(0, 8)}...
                    </Text>
                </View>
            </ScrollView>

            {/* Delete Confirmation Alert */}
            <CustomAlert
                visible={deleteAlert.visible}
                title="Delete Credential"
                message="Are you sure you want to delete this credential?"
                buttons={[
                    { text: 'Cancel', style: 'cancel', onPress: () => setDeleteAlert({ visible: false }) },
                    { text: 'Delete', style: 'destructive', onPress: confirmDelete }
                ]}
                onClose={() => setDeleteAlert({ visible: false })}
            />

            {/* Field Options Alert */}
            <CustomAlert
                visible={fieldOptionsAlert.visible}
                title="Field Options"
                message="What would you like to do with this field?"
                buttons={[
                    { text: 'Cancel', style: 'cancel', onPress: () => setFieldOptionsAlert({ visible: false }) },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => fieldOptionsAlert.fieldId && confirmDeleteField(fieldOptionsAlert.fieldId)
                    }
                ]}
                onClose={() => setFieldOptionsAlert({ visible: false })}
            />
        </View>
    );
}