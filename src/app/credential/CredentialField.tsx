import { Text, TouchableOpacity, View, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../../utils/storage';
import { Credential } from '../../types';
import { useStatic } from '../../components/shared/useStatic';
import { useTheme } from '../../context/ThemeContext';
import { Clipboard } from 'react-native';


interface CredentialFieldProps {
    field: Credential['fields'][0];
    index: number;
    credential: Credential;
}

export function EditingCredentialField({ field, index, credential }: CredentialFieldProps) {
    const [credentials, setCredentials] = useStatic<Credential[]>('credentials');
    const [value, setValue] = useState(field.value);
    const [selectedType, setSelectedType] = useState(field.type);
    const [isEditing, setIsEditing] = useStatic<{ [key: string]: boolean }>('editingFields');
    const { isDark } = useTheme();

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
        <View key={field.id} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-4`}>
            <View className="flex-row items-center mb-3">
                <View className={`w-8 h-8 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} items-center justify-center mr-3`}>
                    <Ionicons name={getFieldIcon(selectedType)} size={16} color="#3B82F6" />
                </View>
                <View className="flex-1 flex-row">
                    {(['text', 'email', 'password'] as const).map((type) => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setSelectedType(type)}
                            className={`mr-2 px-3 py-1 rounded-full ${selectedType === type
                                ? 'bg-blue-500'
                                : isDark ? 'bg-gray-700' : 'bg-gray-100'
                                }`}
                        >
                            <Text className={`text-xs capitalize ${selectedType === type
                                ? 'text-white'
                                : isDark ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity
                    onPress={handleCancel}
                    className={`w-8 h-8 items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
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
                    className={`flex-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'} border rounded-lg px-3 py-2 text-base`}
                    placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                />
                <TouchableOpacity
                    onPress={handleSave}
                    className={`ml-3 w-8 h-8 items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                    <Ionicons name="checkmark-outline" size={20} color="#10B981" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export function CredentialField({ field, index, credential }: CredentialFieldProps) {
    const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
    const [isEditing, setIsEditing] = useStatic<{ [key: string]: boolean }>('editingFields');
    const { isDark } = useTheme();

    const togglePassword = (fieldId: string) => {
        setShowPassword(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));
    };

    const handleCopy = (text: string) => {
        Clipboard.setString(text);
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
            className={`p-4 ${index !== credential.fields.length - 1 ? `border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}` : ''}`}
        >
            <View className="flex-row items-center mb-2">
                <View className={`w-8 h-8 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} items-center justify-center mr-3`}>
                    <Ionicons name={getIconName(field.type)} size={16} color="#3B82F6" />
                </View>
                <Text className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} capitalize flex-1`}>
                    {field.type}
                </Text>
                <TouchableOpacity onPress={handleEdit}
                    className="p-2"
                >
                    <Ionicons name="create-outline" size={20} color={isDark ? "#6B7280" : "#9CA3AF"} />
                </TouchableOpacity>
            </View>

            <View className="flex-row items-center ml-11">
                <Text className={`flex-1 text-base ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
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
                                color={isDark ? "#6B7280" : "#9CA3AF"}
                            />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={() => handleCopy(field.value)}
                        className="p-2"
                    >
                        <Ionicons name="copy-outline" size={20} color={isDark ? "#6B7280" : "#9CA3AF"} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}