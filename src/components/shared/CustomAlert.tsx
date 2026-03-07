import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface AlertButton {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    buttons: AlertButton[];
    onClose: () => void;
}

export default function CustomAlert({ visible, title, message, buttons, onClose }: CustomAlertProps) {
    const { isDark } = useTheme();

    const getButtonColor = (style?: string) => {
        if (style === 'destructive') return '#EF4444';
        if (style === 'cancel') return isDark ? '#9CA3AF' : '#6B7280';
        return '#3B82F6';
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center items-center p-4">
                <View className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-sm overflow-hidden`}>
                    {/* Header */}
                    <View className="p-6 pb-4">
                        <Text className={`text-xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {title}
                        </Text>
                    </View>

                    {/* Message */}
                    <View className="px-6 pb-6">
                        <Text className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {message}
                        </Text>
                    </View>

                    {/* Buttons */}
                    <View className={`flex-row border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        {buttons.map((button, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    button.onPress?.();
                                    onClose();
                                }}
                                className={`flex-1 py-4 ${index < buttons.length - 1 ? `border-r ${isDark ? 'border-gray-700' : 'border-gray-200'}` : ''}`}
                            >
                                <Text
                                    className={`text-center font-semibold`}
                                    style={{ color: getButtonColor(button.style) }}
                                >
                                    {button.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
}