# GitHub Copilot Instructions for Skinstric App

## Code Style Guidelines

### General Principles

- Always use arrow functions for components and utilities
- Use React functional components with hooks (no class components)
- Prefer TypeScript for type safety
- Add concise comments for non-trivial logic only
- Keep functions small and focused (single responsibility)

### Styling

- Style with Tailwind CSS classes exclusively
- Avoid inline styles unless absolutely necessary
- Use consistent spacing and color schemes, as found in /.figma/Skinstric-Canvas.svg
- Ensure responsive design (mobile-first approach)
- Use React Icons for consistent iconography
- Use GSAP for animations and transitions
- UI/UX design should match the provided Figma designs closely

### React Patterns

- Use `useState` and `useEffect` hooks appropriately
- Implement proper TypeScript types for props and state
- Handle loading and error states explicitly
- Prefer composition over prop drilling

### Accessibility

- Include aria-labels for interactive elements
- Ensure keyboard navigation support
- Use semantic HTML elements
- Provide alt text for images

### Performance

- Memoize expensive calculations with `useMemo`
- Optimize re-renders with `useCallback` when needed
- Avoid inline function definitions in JSX when performance matters

### Testing

- Write clear, descriptive test names
- Test user behavior, not implementation details
- Include edge cases and error scenarios

# Copilot Instructions

- Use React functional components with arrow functions and hooks.
- Write Typescript types or interfaces for all component props and state.
- Style components using Tailwind CSS classes, avoiding inline styles.
- Add short, meaningful comments for logic that isn't obvious.
- Prefer accessibility-first HTML (semantic elements and labelled inputs).
- Form inputs: use label + id + aria-describedby; include error text with role="alert".
- Components over ~25 lines: extract helpers; keep render paths simple and readable.
- Prefer composition over prop drilling; create small utilities/hooks for repeated logic.
