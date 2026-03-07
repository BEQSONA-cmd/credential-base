import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
    const { toggleTheme, isDark } = useTheme();

    return (
        <View className={`${isDark ? 'bg-gray-900' : 'bg-blue-600'} p-4 shadow-lg`}>
            <View className="flex-row items-center justify-between mt-10">
                <Text className={`text-white text-2xl font-bold text-center flex-1`}>
                    PassVault 🔐
                </Text>
                <TouchableOpacity
                    onPress={toggleTheme}
                    className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
                >
                    <Ionicons
                        name={isDark ? 'sunny-outline' : 'moon-outline'}
                        size={20}
                        color="white"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}