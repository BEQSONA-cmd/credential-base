import { View, ViewProps } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface ThemedViewProps extends ViewProps {
    className?: string;
}

export default function ThemedView({ className = '', children, ...props }: ThemedViewProps) {
    const { isDark } = useTheme();

    return (
        <View
            className={`${className} ${isDark ? 'dark' : ''}`}
            {...props}
        >
            {children}
        </View>
    );
}