import { View, Text, TouchableOpacity } from 'react-native';
import { useStatic } from '../shared/useStatic';

export default function HomePage() {
    const [modalVisible, setModalVisible] = useStatic('addModalVisible');

    return (
        <TouchableOpacity
            onPress={() => {
                setModalVisible(true);
            }}
            className="absolute bottom-16 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        >
            <Text className="text-white text-3xl">+</Text>
        </TouchableOpacity>
    );
}
