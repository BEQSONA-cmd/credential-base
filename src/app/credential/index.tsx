import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { storage } from '../../utils/storage';
import { Credential } from '../../types';

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

    const onBack = () => {
        router.back();
    };

    if (!credential) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-5xl text-blue-500 font-bold">Loading...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-5xl text-blue-500 font-bold">Hello from Credential</Text>
            <Text className="text-2xl text-gray-500 mt-4">{credential.id}</Text>
            <TouchableOpacity
                onPress={onBack}
                className="mt-6 px-4 py-2 bg-blue-500 rounded"
            >
                <Text className="text-white text-lg">Go Back</Text>
            </TouchableOpacity>
        </View>
    );
}