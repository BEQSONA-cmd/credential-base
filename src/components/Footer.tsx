import { View, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

export default function Footer() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <View className="bg-white border-t border-gray-200 flex-row py-3 mb-16">
            <Text
                onPress={() => router.push('/')}
                className={`flex-1 text-center font-semibold ${pathname === '/' ? 'text-blue-600' : 'text-gray-500'
                    }`}
            >
                🔐 Vault
            </Text>
            <Text
                onPress={() => router.push('/page_1')}
                className={`flex-1 text-center font-semibold ${pathname === '/page_1' ? 'text-blue-600' : 'text-gray-500'
                    }`}
            >
                🔍 Search
            </Text>
        </View>
    );
}