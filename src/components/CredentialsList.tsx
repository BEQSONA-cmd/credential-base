import { View } from 'react-native';
import { storage } from '../utils/storage';
import { useStatic } from '../components/shared/useStatic';
import { Credential } from '../types';
import { Text, Alert } from 'react-native';
import { TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

export default function CredentialsList({ credentialList }: { credentialList: Credential[] }) {
    const [credentials, setCredentials] = useStatic<Credential[]>('credentials');
    const router = useRouter();

    const onEdit = (credential: Credential) => {
        router.push(`/credential?id=${credential.id}`);
    };
    const onDelete = async (id: string) => {
        Alert.alert(
            'Delete Credential',
            'Are you sure you want to delete this credential?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive', onPress: async () => {
                        await storage.delete(id);
                        setCredentials(credentials.filter(c => c.id !== id));
                    }
                }
            ]
        );
    }

    const handleLongPress = (credential: Credential) => {
        Alert.alert(
            'Manage Credential',
            `What would you like to do with "${credential.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Edit', onPress: () => onEdit(credential) },
                { text: 'Delete', onPress: () => onDelete(credential.id), style: 'destructive' }
            ]
        );
    };

    const renderItem = ({ item }: { item: Credential }) => (
        <TouchableOpacity
            onPress={() => onEdit(item)}
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
            data={credentialList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
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