# Contributing Guidelines

Thank you for your interest in contributing to AFFILIATE! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, personal or political attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Setup Development Environment

1. **Fork the Repository**
   - Go to https://github.com/vishxtr/AFFILIATE
   - Click "Fork" button in top right

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/AFFILIATE.git
   cd AFFILIATE
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/vishxtr/AFFILIATE.git
   ```

4. **Install Dependencies**
   ```bash
   pnpm install
   ```

5. **Create Environment File**
   ```bash
   cp .env.example .env
   # Add your Supabase credentials
   ```

6. **Start Development Server**
   ```bash
   pnpm dev
   ```

---

## Development Workflow

### 1. Create a Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/product-filters`)
- `fix/` - Bug fixes (e.g., `fix/login-error`)
- `docs/` - Documentation updates (e.g., `docs/api-documentation`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-context`)
- `test/` - Test additions/changes (e.g., `test/product-card`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### 2. Make Your Changes

- Write clean, maintainable code
- Follow the [Coding Standards](#coding-standards)
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run linter
pnpm lint

# Run type check
pnpm type-check

# Build project
pnpm build

# Test build locally
pnpm preview
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add product filtering feature"
```

Follow the [Commit Guidelines](#commit-guidelines)

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Fill out the PR template
- Wait for review

---

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console.log() or debugging code
- [ ] Tests pass locally
- [ ] Build succeeds without errors

### PR Title Format

Follow conventional commits format:

```
type(scope): brief description

Examples:
feat(products): add category filter
fix(auth): resolve login redirect issue
docs(readme): update installation steps
refactor(components): simplify ProductCard logic
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally
```

### Review Process

1. **Automated Checks** - CI/CD runs linting, type checking, and builds
2. **Code Review** - Maintainers review your code
3. **Feedback** - Address any requested changes
4. **Approval** - Once approved, maintainer will merge

### After Merge

- Delete your feature branch
- Update your local main branch
- Celebrate! 🎉

---

## Coding Standards

### TypeScript

```typescript
// ✅ Good
interface Product {
  id: string
  title: string
  price: number
}

const fetchProducts = async (): Promise<Product[]> => {
  // Implementation
}

// ❌ Avoid
const fetchProducts = async () => {
  // No return type
}
```

### React Components

```typescript
// ✅ Good - Functional component with TypeScript
interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart 
}) => {
  return (
    <div className="product-card">
      {/* Component content */}
    </div>
  )
}

// ❌ Avoid - No type definitions
export const ProductCard = ({ product, onAddToCart }) => {
  // ...
}
```

### Naming Conventions

**Variables & Functions:**
```typescript
// camelCase
const productList = []
const fetchProducts = () => {}
const isLoading = false
```

**Components:**
```typescript
// PascalCase
const ProductCard = () => {}
const AdminDashboard = () => {}
```

**Constants:**
```typescript
// UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_PRODUCTS_PER_PAGE = 20
```

**Types & Interfaces:**
```typescript
// PascalCase
interface User {}
type ProductStatus = 'active' | 'inactive'
```

### File Naming

```
// Components
ProductCard.tsx
AdminDashboard.tsx

// Pages
HomePage.tsx
AdminProductsPage.tsx

// Utilities
formatPrice.ts
validateEmail.ts

// Types
product.types.ts
api.types.ts

// Hooks
useProducts.ts
useAuth.ts

// Contexts
AuthContext.tsx
ThemeContext.tsx
```

### Code Organization

```typescript
// 1. Imports - External first, then internal
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { formatPrice } from '@/utils/formatPrice'
import type { Product } from '@/types/product.types'

// 2. Type definitions
interface ComponentProps {
  // ...
}

// 3. Component
export const Component: React.FC<ComponentProps> = () => {
  // 4. Hooks
  const [state, setState] = useState()
  const navigate = useNavigate()
  
  // 5. Effects
  useEffect(() => {
    // ...
  }, [])
  
  // 6. Handlers
  const handleClick = () => {
    // ...
  }
  
  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### Tailwind CSS

```tsx
// ✅ Good - Organized classes
<div className="flex items-center justify-between p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
  {/* Content */}
</div>

// ❌ Avoid - Random order, hard to read
<div className="hover:shadow-lg bg-white p-4 flex shadow-md transition-shadow rounded-lg items-center justify-between">
  {/* Content */}
</div>

// 💡 Recommended class order:
// 1. Layout (flex, grid, block)
// 2. Positioning (absolute, relative, top, left)
// 3. Sizing (w-, h-, max-w-)
// 4. Spacing (m-, p-)
// 5. Typography (text-, font-)
// 6. Visual (bg-, border-, rounded-, shadow-)
// 7. Effects (opacity-, transition-, transform-)
// 8. Interactive (hover:, focus:, active:)
```

### Comments

```typescript
// ✅ Good - Explain WHY, not WHAT
// Debounce search to avoid excessive API calls
const debouncedSearch = useDebounce(searchTerm, 300)

// ❌ Avoid - Stating the obvious
// Set loading to true
setLoading(true)

// ✅ Good - Document complex logic
/**
 * Calculate discount percentage and format for display
 * Returns "X% OFF" or empty string if no discount
 */
const getDiscountLabel = (price: number, originalPrice: number): string => {
  // Implementation
}
```

---

## Commit Guidelines

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, no logic change)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `ci` - CI/CD changes
- `build` - Build system changes

### Examples

```bash
# Feature
git commit -m "feat(products): add category filter dropdown"

# Bug fix
git commit -m "fix(auth): resolve token refresh issue"

# Documentation
git commit -m "docs(readme): update installation steps"

# With body
git commit -m "feat(analytics): add user event tracking

Implements comprehensive event tracking for:
- Page views
- Product clicks
- Search queries
- Form submissions

Closes #123"
```

### Rules

1. Use imperative mood ("add" not "added" or "adds")
2. Don't capitalize first letter
3. No period at the end
4. Keep subject under 50 characters
5. Separate subject from body with blank line
6. Wrap body at 72 characters
7. Use body to explain what and why, not how

---

## Testing Guidelines

### Unit Tests

```typescript
// ProductCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ProductCard } from './ProductCard'

describe('ProductCard', () => {
  it('displays product title', () => {
    const product = {
      id: '1',
      title: 'Test Product',
      price: 99.99
    }
    
    render(<ProductCard product={product} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })
  
  it('calls onAddToCart when button clicked', () => {
    const mockOnAddToCart = jest.fn()
    const product = { id: '1', title: 'Test', price: 99.99 }
    
    render(<ProductCard product={product} onAddToCart={mockOnAddToCart} />)
    
    const button = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(button)
    
    expect(mockOnAddToCart).toHaveBeenCalledWith('1')
  })
})
```

### Test Coverage

Aim for:
- 80%+ coverage for critical paths
- 100% coverage for utility functions
- All edge cases covered

```bash
# Run tests with coverage
pnpm test:coverage
```

---

## Documentation

### Code Documentation

```typescript
/**
 * Fetches products from the API with optional filtering
 * 
 * @param category - Optional category filter
 * @param limit - Maximum number of products to return
 * @returns Promise resolving to array of products
 * @throws Error if API request fails
 * 
 * @example
 * const products = await fetchProducts('electronics', 10)
 */
export async function fetchProducts(
  category?: string,
  limit: number = 20
): Promise<Product[]> {
  // Implementation
}
```

### README Updates

When adding features:
- Update main README.md
- Add to relevant documentation files
- Include usage examples
- Update screenshots if UI changed

### API Documentation

Document new endpoints in `docs/API.md`:

```markdown
### New Endpoint

```http
GET /api/products/:id
```

**Parameters:**
- `id` - Product UUID

**Response:**
```json
{
  "id": "uuid",
  "title": "Product Name"
}
```
```

---

## Getting Help

### Resources

- 📚 [Project Documentation](../README.md)
- 🐛 [Issue Tracker](https://github.com/vishxtr/AFFILIATE/issues)
- 💬 [Discussions](https://github.com/vishxtr/AFFILIATE/discussions)

### Questions?

- Check existing issues and discussions first
- Open a new discussion for questions
- Join our community chat (if available)

---

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (if applicable)

Thank you for contributing to AFFILIATE! 🎉

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
