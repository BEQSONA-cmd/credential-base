import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '../utils/storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useColorScheme();
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        const savedTheme = await storage.getTheme();
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            // Use system theme as default
            setTheme(systemColorScheme as Theme || 'light');
        }
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        await storage.saveTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            toggleTheme,
            isDark: theme === 'dark'
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}