import { useTheme } from '@/app/contexts/ThemeContext';

export interface ThemeStyles {
    // Background colors
    bg: {
        primary: string;
        secondary: string;
        tertiary: string;
        card: string;
        input: string;
        overlay: string;
    };

    // Text colors
    text: {
        primary: string;
        secondary: string;
        tertiary: string;
        accent: string;
        muted: string;
        inverse: string;
    };

    // Border colors
    border: {
        primary: string;
        secondary: string;
        accent: string;
        muted: string;
    };

    // Shadow styles
    shadow: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        colored: (color: string) => string;
    };

    // Gradient backgrounds
    gradient: {
        primary: string;
        secondary: string;
        accent: string;
        success: string;
        warning: string;
        error: string;
    };

    // Common component styles
    components: {
        button: {
            primary: string;
            secondary: string;
            outline: string;
            ghost: string;
        };
        input: string;
        card: string;
        modal: string;
    };

    // Utility functions
    utils: {
        getContrastText: (bgColor: string) => string;
        getHoverState: (baseColor: string) => string;
        getFocusRing: (color?: string) => string;
    };
}

export function useThemeStyles(): ThemeStyles {
    const { isDark } = useTheme();

    if (isDark) {
        return {
            bg: {
                primary: 'bg-gray-900',
                secondary: 'bg-gray-800',
                tertiary: 'bg-gray-700',
                card: 'bg-gray-800',
                input: 'bg-gray-700',
                overlay: 'bg-black/50',
            },
            text: {
                primary: 'text-white',
                secondary: 'text-gray-300',
                tertiary: 'text-gray-400',
                accent: 'text-blue-400',
                muted: 'text-gray-500',
                inverse: 'text-gray-900',
            },
            border: {
                primary: 'border-gray-700',
                secondary: 'border-gray-600',
                accent: 'border-blue-500',
                muted: 'border-gray-800',
            },
            shadow: {
                sm: 'shadow-sm shadow-gray-900/20',
                md: 'shadow-md shadow-gray-900/30',
                lg: 'shadow-lg shadow-gray-900/40',
                xl: 'shadow-xl shadow-gray-900/50',
                colored: (color: string) => `shadow-lg shadow-${color}/25`,
            },
            gradient: {
                primary: 'from-gray-800 to-gray-900',
                secondary: 'from-gray-700 to-gray-800',
                accent: 'from-blue-600 to-indigo-700',
                success: 'from-green-600 to-emerald-700',
                warning: 'from-yellow-600 to-orange-600',
                error: 'from-red-600 to-pink-700',
            },
            components: {
                button: {
                    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg',
                    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
                    outline: 'border border-gray-600 text-gray-300 hover:bg-gray-700',
                    ghost: 'text-gray-300 hover:bg-gray-700',
                },
                input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500',
                card: 'bg-gray-800 border border-gray-700 shadow-lg',
                modal: 'bg-gray-800 border border-gray-700 shadow-2xl',
            },
            utils: {
                getContrastText: (bgColor: string) => {
                    if (bgColor.includes('gray-900') || bgColor.includes('gray-800')) return 'text-white';
                    if (bgColor.includes('gray-700') || bgColor.includes('gray-600')) return 'text-white';
                    return 'text-gray-900';
                },
                getHoverState: (baseColor: string) => {
                    if (baseColor.includes('gray-800')) return 'hover:bg-gray-700';
                    if (baseColor.includes('gray-700')) return 'hover:bg-gray-600';
                    if (baseColor.includes('blue-600')) return 'hover:bg-blue-700';
                    return 'hover:opacity-90';
                },
                getFocusRing: (color = 'blue-500') => `focus:ring-2 focus:ring-${color} focus:ring-offset-2 focus:ring-offset-gray-900`,
            },
        };
    }

    // Light theme styles
    return {
        bg: {
            primary: 'bg-white',
            secondary: 'bg-gray-50',
            tertiary: 'bg-gray-100',
            card: 'bg-white',
            input: 'bg-white',
            overlay: 'bg-black/20',
        },
        text: {
            primary: 'text-gray-900',
            secondary: 'text-gray-700',
            tertiary: 'text-gray-500',
            accent: 'text-blue-600',
            muted: 'text-gray-400',
            inverse: 'text-white',
        },
        border: {
            primary: 'border-gray-200',
            secondary: 'border-gray-300',
            accent: 'border-blue-500',
            muted: 'border-gray-100',
        },
        shadow: {
            sm: 'shadow-sm shadow-gray-200/50',
            md: 'shadow-md shadow-gray-200/50',
            lg: 'shadow-lg shadow-gray-200/50',
            xl: 'shadow-xl shadow-gray-200/50',
            colored: (color: string) => `shadow-lg shadow-${color}/25`,
        },
        gradient: {
            primary: 'from-blue-50 to-indigo-100',
            secondary: 'from-gray-50 to-gray-100',
            accent: 'from-blue-500 to-indigo-600',
            success: 'from-green-500 to-emerald-600',
            warning: 'from-yellow-500 to-orange-500',
            error: 'from-red-500 to-pink-600',
        },
        components: {
            button: {
                primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg',
                secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
                outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
                ghost: 'text-gray-700 hover:bg-gray-100',
            },
            input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500',
            card: 'bg-white border border-gray-200 shadow-lg',
            modal: 'bg-white border border-gray-200 shadow-2xl',
        },
        utils: {
            getContrastText: (bgColor: string) => {
                if (bgColor.includes('white') || bgColor.includes('gray-50')) return 'text-gray-900';
                if (bgColor.includes('gray-100') || bgColor.includes('gray-200')) return 'text-gray-900';
                return 'text-white';
            },
            getHoverState: (baseColor: string) => {
                if (baseColor.includes('white')) return 'hover:bg-gray-50';
                if (baseColor.includes('gray-50')) return 'hover:bg-gray-100';
                if (baseColor.includes('blue-600')) return 'hover:bg-blue-700';
                return 'hover:opacity-90';
            },
            getFocusRing: (color = 'blue-500') => `focus:ring-2 focus:ring-${color} focus:ring-offset-2 focus:ring-offset-white`,
        },
    };
}

// Predefined theme-aware style combinations
export const themeStyles = {
    // Common card styles
    card: (variant: 'default' | 'elevated' | 'outlined' = 'default') => {
        const base = 'rounded-lg p-6 transition-all duration-200';
        const variants = {
            default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
            elevated: 'bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/30',
            outlined: 'bg-transparent border-2 border-gray-200 dark:border-gray-700',
        };
        return `${base} ${variants[variant]}`;
    },

    // Button variants
    button: (variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => {
        const base = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
        const sizes = {
            sm: 'px-3 py-2 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg',
        };
        const variants = {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg',
            secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
            outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
            ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
        };
        return `${base} ${sizes[size]} ${variants[variant]}`;
    },

    // Input styles
    input: (variant: 'default' | 'error' | 'success' = 'default') => {
        const base = 'w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
        const variants = {
            default: 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500',
            error: 'bg-white dark:bg-gray-700 border-red-300 dark:border-red-600 text-gray-900 dark:text-white focus:border-red-500 focus:ring-red-500',
            success: 'bg-white dark:bg-gray-700 border-green-300 dark:border-green-600 text-gray-900 dark:text-white focus:border-green-500 focus:ring-green-500',
        };
        return `${base} ${variants[variant]}`;
    },

    // Text styles
    text: (variant: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label' = 'body') => {
        const variants = {
            h1: 'text-4xl font-bold text-gray-900 dark:text-white',
            h2: 'text-3xl font-bold text-gray-900 dark:text-white',
            h3: 'text-2xl font-semibold text-gray-900 dark:text-white',
            body: 'text-base text-gray-700 dark:text-gray-300',
            caption: 'text-sm text-gray-500 dark:text-gray-400',
            label: 'text-sm font-medium text-gray-700 dark:text-gray-300',
        };
        return variants[variant];
    },

    // Layout containers
    container: (variant: 'default' | 'narrow' | 'wide' = 'default') => {
        const variants = {
            default: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
            narrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
            wide: 'max-w-full mx-auto px-4 sm:px-6 lg:px-8',
        };
        return variants[variant];
    },

    // Section spacing
    section: (size: 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
        const sizes = {
            sm: 'py-8',
            md: 'py-16',
            lg: 'py-20',
            xl: 'py-24',
        };
        return sizes[size];
    },

    // Grid layouts
    grid: (cols: 1 | 2 | 3 | 4 | 5 | 6 = 3, gap: 'sm' | 'md' | 'lg' = 'md') => {
        const colVariants = {
            1: 'grid-cols-1',
            2: 'grid-cols-1 md:grid-cols-2',
            3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
            5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
            6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
        };
        const gapVariants = {
            sm: 'gap-4',
            md: 'gap-6',
            lg: 'gap-8',
        };
        return `grid ${colVariants[cols]} ${gapVariants[gap]}`;
    },
};

// Hook for getting common theme-aware classes
export function useThemeClasses() {
    const { isDark } = useTheme();

    return {
        // Background classes
        bg: {
            primary: isDark ? 'bg-gray-900' : 'bg-white',
            secondary: isDark ? 'bg-gray-800' : 'bg-gray-50',
            card: isDark ? 'bg-gray-800' : 'bg-white',
            overlay: isDark ? 'bg-black/50' : 'bg-black/20',
        },

        // Text classes
        text: {
            primary: isDark ? 'text-white' : 'text-gray-900',
            secondary: isDark ? 'text-gray-300' : 'text-gray-700',
            muted: isDark ? 'text-gray-400' : 'text-gray-500',
        },

        // Border classes
        border: {
            primary: isDark ? 'border-gray-700' : 'border-gray-200',
            secondary: isDark ? 'border-gray-600' : 'border-gray-300',
        },

        // Shadow classes
        shadow: {
            sm: isDark ? 'shadow-sm shadow-gray-900/20' : 'shadow-sm shadow-gray-200/50',
            md: isDark ? 'shadow-md shadow-gray-900/30' : 'shadow-md shadow-gray-200/50',
            lg: isDark ? 'shadow-lg shadow-gray-900/40' : 'shadow-lg shadow-gray-200/50',
        },

        // Common component classes
        components: {
            card: isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
            input: isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900',
            button: {
                primary: 'bg-blue-600 hover:bg-blue-700 text-white',
                secondary: isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
            },
        },
    };
}