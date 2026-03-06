import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

type Props = {
    visible: boolean;
    onContinue: () => void;
};

export default function Onboarding({ visible, onContinue }: Props) {
    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View className="flex-1 bg-black/50 justify-center items-center p-4">
                <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
                    <Text className="text-2xl font-bold text-center mb-4">
                        🔐 Welcome to PassVault
                    </Text>

                    <Text className="text-gray-600 mb-6 text-center">
                        Your personal password manager that stores all data locally on your device.
                    </Text>

                    <View className="bg-blue-50 p-4 rounded-xl mb-6">
                        <Text className="font-semibold mb-2">📱 Local Storage:</Text>
                        <Text className="text-gray-600">
                            • All passwords stay on your phone{'\n'}
                            • No cloud or internet required{'\n'}
                            • You have full control
                        </Text>
                    </View>

                    <View className="bg-yellow-50 p-4 rounded-xl mb-6">
                        <Text className="font-semibold mb-2">⚠️ Important:</Text>
                        <Text className="text-gray-600">
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