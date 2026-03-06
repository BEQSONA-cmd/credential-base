import { View, Text } from 'react-native';

export default function Header() {
    return (
        < View className="bg-blue-600 p-4 shadow-lg" >
            <Text className="text-white text-2xl font-bold text-center">
                My App Header
            </Text>
        </View >

    );
}