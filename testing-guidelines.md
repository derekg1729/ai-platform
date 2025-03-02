# AI Platform Testing Guidelines - Core Focus

<metadata>
{
  "version": "1.0",
  "framework": {
    "frontend": "react",
    "backend": "python",
    "middleware": "firebase"
  }
}
</metadata>

## Critical Test Paths (90% Coverage Required)
1. Authentication flows
2. Data mutations
3. API endpoints
4. User sessions

## Core Test Patterns

### React Component Tests (75% Coverage)
```javascript
// Most components only need these three tests
describe('<ComponentName />', () => {
  it('renders without crashing', () => {
    render(<ComponentName />);
  });

  it('handles user interactions', () => {
    render(<ComponentName />);
    // Click buttons, fill forms, etc.
  });

  it('shows error states', () => {
    render(<ComponentName error={new Error('Test error')} />);
  });
});
```

### Firebase/Auth Mocking (Essential)
```javascript
// This mock handles 90% of auth test cases
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn()
  }))
}));
```

### API/Database Tests (85% Coverage)
```javascript
// Cover these three scenarios for each endpoint
describe('API Endpoint', () => {
  it('succeeds with valid input', async () => {
    // Happy path
  });

  it('handles invalid input', async () => {
    // Validation errors
  });

  it('handles server errors', async () => {
    // 500, network errors, etc.
  });
});
```

## Test Directory Structure (Minimum Viable)
```
src/
├── __tests__/
    ├── auth/       # Authentication tests
    ├── api/        # API endpoint tests
    └── components/ # Core component tests
```

## Essential Commands
```bash
# Install dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test                    # Run all tests
npm test -- --coverage     # Check coverage
npm test ComponentName     # Test specific component
```

## Core Best Practices
1. Test user interactions over implementation
2. Mock external services (Firebase, APIs)
3. Test error states
4. Verify data mutations

---

## Guidelines Not Mentioned
The following areas, while important, are not part of the core 20%:
- Performance testing
- Accessibility testing
- Mobile-specific tests
- Snapshot testing
- E2E testing
- Visual regression
- Load testing
- Security testing
- Browser compatibility
- State management tests
- Route testing
- WebSocket testing
- File upload testing
- Cache testing
- Offline functionality
- Animation testing
- SEO testing
- Cross-browser testing
- Memory leak testing
- Internationalization testing

Note: Add these as needed based on specific feature requirements.

<!-- END OF CORE TESTING GUIDELINES --> 