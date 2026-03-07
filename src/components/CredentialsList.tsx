import { useState } from 'react';
import { View } from 'react-native';
import { storage } from '../utils/storage';
import { useStatic } from '../components/shared/useStatic';
import { Credential } from '../types';
import { Text } from 'react-native';
import { TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import CustomAlert from './shared/CustomAlert';

export default function CredentialsList({ credentialList }: { credentialList: Credential[] }) {
    const { isDark } = useTheme();
    const [credentials, setCredentials] = useStatic<Credential[]>('credentials');
    const router = useRouter();

    const [deleteAlert, setDeleteAlert] = useState<{ visible: boolean; id?: string }>({ visible: false });
    const [manageAlert, setManageAlert] = useState<{ visible: boolean; credential?: Credential }>({ visible: false });

    const onEdit = (credential: Credential) => {
        router.push(`/credential?id=${credential.id}`);
    };

    const handleDelete = async (id: string) => {
        await storage.delete(id);
        setCredentials(credentials.filter(c => c.id !== id));
        setDeleteAlert({ visible: false });
    };

    const handleLongPress = (credential: Credential) => {
        setManageAlert({ visible: true, credential });
    };

    const renderItem = ({ item }: { item: Credential }) => (
        <TouchableOpacity
            onPress={() => onEdit(item)}
            onLongPress={() => handleLongPress(item)}
            className={`p-4 mb-2 rounded-lg shadow-sm border ${isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
                }`}
        >
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {item.name}
                    </Text>
                    <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(item.createdAt).toLocaleDateString()} • {item.fields.length} fields
                    </Text>
                </View>
                <Text className="text-blue-500 text-xs">Tap to view</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <FlatList
                data={credentialList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerClassName="p-4"
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center py-20">
                        <Text className={`text-lg ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            No credentials yet
                        </Text>
                        <Text className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Tap + to add your first credential
                        </Text>
                    </View>
                }
            />

            {/* Delete Confirmation Alert */}
            <CustomAlert
                visible={deleteAlert.visible}
                title="Delete Credential"
                message="Are you sure you want to delete this credential?"
                buttons={[
                    { text: 'Cancel', style: 'cancel', onPress: () => setDeleteAlert({ visible: false }) },
                    { text: 'Delete', style: 'destructive', onPress: () => deleteAlert.id && handleDelete(deleteAlert.id) }
                ]}
                onClose={() => setDeleteAlert({ visible: false })}
            />

            {/* Manage Credential Alert */}
            <CustomAlert
                visible={manageAlert.visible}
                title="Manage Credential"
                message={manageAlert.credential ? `What would you like to do with "${manageAlert.credential.name}"?` : ''}
                buttons={[
                    { text: 'Cancel', style: 'cancel', onPress: () => setManageAlert({ visible: false }) },
                    {
                        text: 'Edit',
                        onPress: () => {
                            if (manageAlert.credential) {
                                onEdit(manageAlert.credential);
                                setManageAlert({ visible: false });
                            }
                        }
                    },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                            if (manageAlert.credential) {
                                setDeleteAlert({ visible: true, id: manageAlert.credential.id });
                                setManageAlert({ visible: false });
                            }
                        }
                    }
                ]}
                onClose={() => setManageAlert({ visible: false })}
            />
        </>
    );
}