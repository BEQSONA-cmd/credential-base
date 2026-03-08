import { View, Text, TouchableOpacity, TextInput, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
    const { toggleTheme, isDark } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isOpening, setIsOpening] = useState(false);

    const searchWidth = useRef(new Animated.Value(40)).current;

    const toggleSearch = () => {
        if (isSearchActive) {
            // Close search
            setIsOpening(true);
            Animated.parallel([
                Animated.timing(searchWidth, {
                    toValue: 40,
                    duration: 300,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                setIsSearchActive(false);
                setIsOpening(false);
            });
            setSearchQuery('');
        } else {
            // Open search
            setIsSearchActive(true);
            setIsOpening(true);
            Animated.parallel([
                Animated.timing(searchWidth, {
                    toValue: 200,
                    duration: 300,
                    useNativeDriver: false,
                }),

            ]).start(() => {
                setIsOpening(false);
            });
        }
    };

    return (
        <View className={`${isDark ? 'bg-gray-900' : 'bg-blue-600'} p-4 shadow-lg`}>
            <View className="flex-row items-center justify-between mt-10 gap-3">
                {/* Logo and Title with animation */}
                <View
                    className="flex-row items-center gap-2"
                >
                    <Ionicons
                        name="shield-checkmark-outline"
                        size={28}
                        color="white"
                    />
                    <Text className="text-white text-xl font-bold">PassVault</Text>
                </View>

                {/* Search Container */}
                <View className="flex-1 flex-row items-center justify-end">
                    {isSearchActive ? (
                        <Animated.View
                            className="flex-row items-center bg-white/20 rounded-full px-3"
                            style={{ width: searchWidth }}
                        >
                            <Ionicons name="search-outline" size={20} color="white" />
                            <TextInput
                                placeholder="Search..."
                                placeholderTextColor="rgba(255,255,255,0.6)"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                className="flex-1 ml-2 text-white text-sm"
                                autoFocus={true}
                            />
                            {!isOpening && (
                                <TouchableOpacity onPress={toggleSearch}>
                                    <Ionicons name="close-outline" size={20} color="white" />
                                </TouchableOpacity>
                            )}
                        </Animated.View>
                    ) : (
                        <TouchableOpacity
                            onPress={toggleSearch}
                            className="w-11 h-11 items-center justify-center rounded-full bg-white/20"
                        >
                            <Ionicons name="search-outline" size={20} color="white" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Theme Toggle */}
                <TouchableOpacity
                    onPress={toggleTheme}
                    className="w-11 h-11 items-center justify-center rounded-full bg-white/20"
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