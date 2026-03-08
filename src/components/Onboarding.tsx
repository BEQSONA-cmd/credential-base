import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Props = {
    visible: boolean;
    onContinue: () => void;
};

export default function Onboarding({ visible, onContinue }: Props) {
    const { isDark } = useTheme();

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View className="flex-1 bg-black/50 justify-center items-center p-4">
                <View className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-sm`}>
                    <Text className={`text-2xl font-bold text-center mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        🔐 Welcome to PassVault
                    </Text>

                    <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 text-center`}>
                        Your personal password manager that stores all data locally on your device.
                    </Text>

                    <View className={`${isDark ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-xl mb-6`}>
                        <Text className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            📱 Local Storage:
                        </Text>
                        <Text className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            • All passwords stay on your phone{'\n'}
                            • No cloud or internet required{'\n'}
                            • You have full control
                        </Text>
                    </View>

                    <View className={`${isDark ? 'bg-gray-700' : 'bg-yellow-50'} p-4 rounded-xl mb-6`}>
                        <Text className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            ⚠️ Important:
                        </Text>
                        <Text className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            This app needs permission to store data on your device. All data is encrypted locally.
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={onContinue}
                        className="bg-blue-600 py-4 rounded-xl"
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}