"use client";

import React from 'react';
import { useThemeStyles, themeStyles, useThemeClasses } from '@/hooks/useThemeStyles';
import { useTheme } from '@/app/contexts/ThemeContext';
import { Sun, Moon, Monitor, Star, Heart, Zap } from 'lucide-react';

export default function ThemeStylesDemo() {
    const { theme, toggleTheme, setTheme } = useTheme();
    const styles = useThemeStyles();
    const classes = useThemeClasses();

    return (
        <div className={`${styles.bg.primary} ${styles.text.primary} min-h-screen p-8`}>
            <div className={themeStyles.container('narrow')}>
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className={themeStyles.text('h1')}>Theme-Aware Styling Demo</h1>
                    <p className={`${styles.text.secondary} text-lg mt-4`}>
                        This component demonstrates how to use the theme-aware styling hooks
                    </p>

                    {/* Theme Controls */}
                    <div className="flex items-center justify-center space-x-4 mt-6">
                        <button
                            onClick={() => setTheme('light')}
                            className={`p-2 rounded-lg ${theme === 'light' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}
                        >
                            <Sun className="w-5 h-5 text-yellow-600" />
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}
                        >
                            <Moon className="w-5 h-5 text-blue-600" />
                        </button>
                        <button
                            onClick={() => setTheme('system')}
                            className={`p-2 rounded-lg ${theme === 'system' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}
                        >
                            <Monitor className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Demo Sections */}
                <div className="space-y-12">
                    {/* Cards Section */}
                    <section>
                        <h2 className={themeStyles.text('h2')}>Card Variants</h2>
                        <div className={themeStyles.grid(3, 'md')}>
                            <div className={themeStyles.card('default')}>
                                <h3 className={themeStyles.text('h3')}>Default Card</h3>
                                <p className={styles.text.secondary}>Standard card with border and background</p>
                            </div>
                            <div className={themeStyles.card('elevated')}>
                                <h3 className={themeStyles.text('h3')}>Elevated Card</h3>
                                <p className={styles.text.secondary}>Card with enhanced shadow</p>
                            </div>
                            <div className={themeStyles.card('outlined')}>
                                <h3 className={themeStyles.text('h3')}>Outlined Card</h3>
                                <p className={styles.text.secondary}>Transparent background with border</p>
                            </div>
                        </div>
                    </section>

                    {/* Buttons Section */}
                    <section>
                        <h2 className={themeStyles.text('h2')}>Button Variants</h2>
                        <div className="flex flex-wrap gap-4">
                            <button className={themeStyles.button('primary', 'md')}>
                                Primary Button
                            </button>
                            <button className={themeStyles.button('secondary', 'md')}>
                                Secondary Button
                            </button>
                            <button className={themeStyles.button('outline', 'md')}>
                                Outline Button
                            </button>
                            <button className={themeStyles.button('ghost', 'md')}>
                                Ghost Button
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-4">
                            <button className={themeStyles.button('primary', 'sm')}>Small</button>
                            <button className={themeStyles.button('primary', 'md')}>Medium</button>
                            <button className={themeStyles.button('primary', 'lg')}>Large</button>
                        </div>
                    </section>

                    {/* Form Elements */}
                    <section>
                        <h2 className={themeStyles.text('h2')}>Form Elements</h2>
                        <div className={themeStyles.grid(2, 'md')}>
                            <div>
                                <label className={themeStyles.text('label')}>Default Input</label>
                                <input
                                    type="text"
                                    placeholder="Enter text here..."
                                    className={`${themeStyles.input('default')} mt-2`}
                                />
                            </div>
                            <div>
                                <label className={themeStyles.text('label')}>Error Input</label>
                                <input
                                    type="text"
                                    placeholder="Error state..."
                                    className={`${themeStyles.input('error')} mt-2`}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Using useThemeStyles Hook */}
                    <section>
                        <h2 className={themeStyles.text('h2')}>Using useThemeStyles Hook</h2>
                        <div className={themeStyles.grid(2, 'md')}>
                            <div className={`${styles.bg.card} ${styles.border.primary} rounded-lg p-6`}>
                                <h3 className={styles.text.accent}>Dynamic Background</h3>
                                <p className={styles.text.secondary}>
                                    This card uses the useThemeStyles hook for dynamic styling
                                </p>
                                <div className={`${styles.shadow.colored('blue')} mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/20`}>
                                    <p className={styles.text.primary}>Colored shadow example</p>
                                </div>
                            </div>

                            <div className={`${styles.bg.secondary} ${styles.border.secondary} rounded-lg p-6`}>
                                <h3 className={styles.text.primary}>Secondary Background</h3>
                                <p className={styles.text.secondary}>
                                    Different background with appropriate text contrast
                                </p>
                                <button className={`${styles.components.button.primary} mt-4`}>
                                    Styled Button
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Using useThemeClasses Hook */}
                    <section>
                        <h2 className={themeStyles.text('h2')}>Using useThemeClasses Hook</h2>
                        <div className={themeStyles.grid(2, 'md')}>
                            <div className={`${classes.components.card} rounded-lg p-6`}>
                                <h3 className={classes.text.primary}>Simple Classes</h3>
                                <p className={classes.text.secondary}>
                                    Using the simplified useThemeClasses hook
                                </p>
                                <div className={`${classes.shadow.md} mt-4 p-3 rounded ${classes.bg.secondary}`}>
                                    <p className={classes.text.primary}>Shadow and background</p>
                                </div>
                            </div>

                            <div className={`${classes.bg.secondary} ${classes.border.primary} rounded-lg p-6`}>
                                <h3 className={classes.text.primary}>Secondary Background</h3>
                                <p className={classes.text.secondary}>
                                    Another example with different styling
                                </p>
                                <button className={`${classes.components.button.secondary} mt-4`}>
                                    Secondary Button
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Utility Functions */}
                    <section>
                        <h2 className={themeStyles.text('h2')}>Utility Functions</h2>
                        <div className={themeStyles.grid(3, 'md')}>
                            <div className={`${styles.bg.primary} ${styles.utils.getContrastText(styles.bg.primary)} rounded-lg p-6`}>
                                <h3 className="text-lg font-semibold">Contrast Text</h3>
                                <p>Automatically determines text color for background</p>
                            </div>

                            <div className={`${styles.bg.secondary} ${styles.utils.getContrastText(styles.bg.secondary)} rounded-lg p-6`}>
                                <h3 className="text-lg font-semibold">Hover States</h3>
                                <p className={`${styles.utils.getHoverState(styles.bg.secondary)} cursor-pointer`}>
                                    Hover over me to see the effect
                                </p>
                            </div>

                            <div className={`${styles.bg.tertiary} ${styles.utils.getContrastText(styles.bg.tertiary)} rounded-lg p-6`}>
                                <h3 className="text-lg font-semibold">Focus Ring</h3>
                                <button className={`${styles.utils.getFocusRing('purple')} px-4 py-2 rounded bg-blue-600 text-white`}>
                                    Focus me
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Gradients */}
                    <section>
                        <h2 className={themeStyles.text('h2')}>Gradient Backgrounds</h2>
                        <div className={themeStyles.grid(2, 'md')}>
                            <div className={`bg-gradient-to-r ${styles.gradient.primary} rounded-lg p-6 text-white`}>
                                <h3 className="text-lg font-semibold">Primary Gradient</h3>
                                <p>Beautiful gradient background</p>
                            </div>

                            <div className={`bg-gradient-to-r ${styles.gradient.accent} rounded-lg p-6 text-white`}>
                                <h3 className="text-lg font-semibold">Accent Gradient</h3>
                                <p>Accent color gradient</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}