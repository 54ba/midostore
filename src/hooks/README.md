# Theme-Aware Styling Hooks

This directory contains utility hooks for creating theme-aware, consistent styling across your application. These hooks automatically adapt to light and dark themes, providing a seamless user experience.

## 🎨 Available Hooks

### 1. `useThemeStyles()` - Full-Featured Styling

The most comprehensive hook that provides complete theme-aware styling objects.

```tsx
import { useThemeStyles } from '@/hooks/useThemeStyles';

function MyComponent() {
  const styles = useThemeStyles();

  return (
    <div className={`${styles.bg.primary} ${styles.text.primary}`}>
      <h1 className={styles.text.accent}>Hello World</h1>
      <button className={styles.components.button.primary}>
        Click me
      </button>
    </div>
  );
}
```

#### Available Properties

- **Backgrounds**: `bg.primary`, `bg.secondary`, `bg.tertiary`, `bg.card`, `bg.input`, `bg.overlay`
- **Text**: `text.primary`, `text.secondary`, `text.tertiary`, `text.accent`, `text.muted`, `text.inverse`
- **Borders**: `border.primary`, `border.secondary`, `border.accent`, `border.muted`
- **Shadows**: `shadow.sm`, `shadow.md`, `shadow.lg`, `shadow.xl`, `shadow.colored(color)`
- **Gradients**: `gradient.primary`, `gradient.secondary`, `gradient.accent`, `gradient.success`, `gradient.warning`, `gradient.error`
- **Components**: `components.button.*`, `components.input`, `components.card`, `components.modal`
- **Utilities**: `utils.getContrastText()`, `utils.getHoverState()`, `utils.getFocusRing()`

### 2. `useThemeClasses()` - Simple Class Names

A simplified hook that returns basic theme-aware class names.

```tsx
import { useThemeClasses } from '@/hooks/useThemeStyles';

function MyComponent() {
  const classes = useThemeClasses();

  return (
    <div className={classes.bg.card}>
      <h1 className={classes.text.primary}>Simple Styling</h1>
      <button className={classes.components.button.primary}>
        Simple Button
      </button>
    </div>
  );
}
```

### 3. `themeStyles` - Predefined Style Combinations

A collection of predefined, theme-aware style combinations that you can use directly.

```tsx
import { themeStyles } from '@/hooks/useThemeStyles';

function MyComponent() {
  return (
    <div className={themeStyles.container('narrow')}>
      <h1 className={themeStyles.text('h1')}>Large Heading</h1>
      <div className={themeStyles.card('elevated')}>
        <p>Elevated card content</p>
      </div>
      <button className={themeStyles.button('primary', 'lg')}>
        Large Primary Button
      </button>
      <input className={themeStyles.input('default')} placeholder="Input field" />
    </div>
  );
}
```

## 🚀 Usage Examples

### Basic Component Styling

```tsx
import { useThemeStyles } from '@/hooks/useThemeStyles';

export function ProductCard({ product }) {
  const styles = useThemeStyles();

  return (
    <div className={`${styles.bg.card} ${styles.border.primary} rounded-lg p-6 ${styles.shadow.md}`}>
      <h3 className={`${styles.text.primary} text-xl font-bold mb-2`}>
        {product.name}
      </h3>
      <p className={styles.text.secondary}>
        {product.description}
      </p>
      <button className={`${styles.components.button.primary} mt-4`}>
        Add to Cart
      </button>
    </div>
  );
}
```

### Form Styling

```tsx
import { themeStyles } from '@/hooks/useThemeStyles';

export function ContactForm() {
  return (
    <form className={themeStyles.container('narrow')}>
      <div className="space-y-4">
        <div>
          <label className={themeStyles.text('label')}>Name</label>
          <input
            type="text"
            className={`${themeStyles.input('default')} mt-1`}
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className={themeStyles.text('label')}>Email</label>
          <input
            type="email"
            className={`${themeStyles.input('error')} mt-1`}
            placeholder="Enter your email"
          />
        </div>
        <button className={themeStyles.button('primary', 'lg')}>
          Submit
        </button>
      </div>
    </form>
  );
}
```

### Layout and Grid

```tsx
import { themeStyles } from '@/hooks/useThemeStyles';

export function ProductGrid({ products }) {
  return (
    <section className={`${themeStyles.section('lg')} ${themeStyles.container()}`}>
      <h2 className={themeStyles.text('h2')}>Our Products</h2>
      <div className={themeStyles.grid(3, 'lg')}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
```

### Dynamic Styling with Utilities

```tsx
import { useThemeStyles } from '@/hooks/useThemeStyles';

export function StatusCard({ status, message }) {
  const styles = useThemeStyles();

  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return {
          bg: styles.bg.success,
          text: styles.text.inverse,
          border: styles.border.success
        };
      case 'error':
        return {
          bg: styles.bg.error,
          text: styles.text.inverse,
          border: styles.border.error
        };
      default:
        return {
          bg: styles.bg.secondary,
          text: styles.text.primary,
          border: styles.border.secondary
        };
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <div className={`${statusStyles.bg} ${statusStyles.text} ${statusStyles.border} rounded-lg p-4 ${styles.shadow.md}`}>
      <p>{message}</p>
    </div>
  );
}
```

## 🎯 Best Practices

### 1. **Consistent Usage**
Use the same hook throughout your component to ensure consistency:

```tsx
// ✅ Good - Consistent styling
function Component() {
  const styles = useThemeStyles();
  return (
    <div className={`${styles.bg.primary} ${styles.text.primary}`}>
      <button className={styles.components.button.primary}>Click</button>
    </div>
  );
}

// ❌ Avoid - Mixed styling approaches
function Component() {
  const styles = useThemeStyles();
  return (
    <div className="bg-white dark:bg-gray-900"> {/* Mixed approach */}
      <button className={styles.components.button.primary}>Click</button>
    </div>
  );
}
```

### 2. **Component Composition**
Create reusable styled components:

```tsx
// Create a styled button component
function StyledButton({ variant = 'primary', size = 'md', children, ...props }) {
  const buttonClass = themeStyles.button(variant, size);
  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}

// Use it throughout your app
<StyledButton variant="primary" size="lg">
  Submit Form
</StyledButton>
```

### 3. **Conditional Styling**
Use the utility functions for dynamic styling:

```tsx
function DynamicCard({ type, content }) {
  const styles = useThemeStyles();

  const getCardStyles = () => {
    if (type === 'featured') {
      return `${styles.bg.accent} ${styles.text.inverse} ${styles.shadow.xl}`;
    }
    return `${styles.bg.card} ${styles.text.primary} ${styles.shadow.md}`;
  };

  return (
    <div className={`${getCardStyles()} rounded-lg p-6`}>
      {content}
    </div>
  );
}
```

## 🔧 Customization

### Adding New Theme Variants

You can extend the hooks by adding new theme variants:

```tsx
// In your component
const customStyles = {
  ...useThemeStyles(),
  custom: {
    special: 'bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600',
    accent: 'text-purple-600 dark:text-purple-400'
  }
};
```

### Creating Theme-Specific Components

```tsx
function ThemedComponent({ children }) {
  const styles = useThemeStyles();

  return (
    <div className={`${styles.bg.primary} ${styles.text.primary} min-h-screen`}>
      <div className={styles.bg.card}>
        {children}
      </div>
    </div>
  );
}
```

## 📱 Responsive Design

The hooks work seamlessly with Tailwind's responsive utilities:

```tsx
function ResponsiveGrid() {
  const styles = useThemeStyles();

  return (
    <div className={`${styles.bg.primary} ${themeStyles.grid(1, 'md')} lg:grid-cols-3`}>
      {/* Grid content */}
    </div>
  );
}
```

## 🎨 Theme Switching

The hooks automatically adapt when the theme changes:

```tsx
function ThemeAwareComponent() {
  const styles = useThemeStyles();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`${styles.bg.primary} ${styles.text.primary} p-6`}>
      <p>Current theme: {theme}</p>
      <button
        onClick={toggleTheme}
        className={styles.components.button.secondary}
      >
        Toggle Theme
      </button>
    </div>
  );
}
```

## 🚀 Performance

- **Hooks are memoized**: The styling objects are only recalculated when the theme changes
- **No unnecessary re-renders**: Components only re-render when the theme actually changes
- **Efficient class generation**: Uses Tailwind's optimized class generation

## 🔍 Troubleshooting

### Common Issues

1. **Theme not updating**: Ensure your component is wrapped in `ThemeProvider`
2. **Styles not applying**: Check that Tailwind CSS is properly configured with `darkMode: 'class'`
3. **Type errors**: Make sure you're importing from the correct path

### Debug Mode

You can add debug logging to see when themes change:

```tsx
function DebugComponent() {
  const styles = useThemeStyles();
  const { isDark, theme } = useTheme();

  console.log('Current theme:', theme, 'Is dark:', isDark);
  console.log('Available styles:', styles);

  return <div>Debug info in console</div>;
}
```

## 📚 Related Files

- `src/app/contexts/ThemeContext.tsx` - Theme context provider
- `src/components/ThemeToggle.tsx` - Theme toggle component
- `src/components/ThemeStylesDemo.tsx` - Interactive demo component

This comprehensive styling system ensures your application maintains consistent, beautiful styling across all themes while providing the flexibility to create unique, engaging user experiences.