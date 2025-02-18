import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface ESLintMessage {
  line: number
  column: number
  message: string
  ruleId: string
}

interface ESLintResult {
  filePath: string
  messages: ESLintMessage[]
}

interface LintCheckResult {
  success: boolean
  errors: Array<{
    filePath: string
    messages: ESLintMessage[]
  }>
}

describe('Code Quality Checks', () => {
  const runEslint = async (files: string[]): Promise<LintCheckResult> => {
    try {
      const command = files
        .map(pattern => `"${pattern}"`)
        .join(' ')
      await execAsync(`npx eslint ${command} --format json`)
      return { success: true, errors: [] }
    } catch (error) {
      if (error instanceof Error && 'stdout' in error) {
        const results = JSON.parse(error.stdout as string) as ESLintResult[]
        return {
          success: false,
          errors: results.map((result) => ({
            filePath: result.filePath.split('ai-platform/')[1],
            messages: result.messages.map((msg) => ({
              line: msg.line,
              column: msg.column,
              message: msg.message,
              ruleId: msg.ruleId
            }))
          }))
        }
      }
      throw error
    }
  }

  const runTypeCheck = async (options: string[] = []): Promise<string> => {
    try {
      await execAsync(`npx tsc --noEmit ${options.join(' ')}`)
      return ''
    } catch (error) {
      if (error instanceof Error) {
        // Capture both stdout and stderr for TypeScript errors
        const stdout = 'stdout' in error ? error.stdout as string : ''
        const stderr = 'stderr' in error ? error.stderr as string : ''
        return stderr || stdout || error.message
      }
      throw error
    }
  }

  describe('TypeScript Compilation', () => {
    it('should compile without type errors', async () => {
      const errors = await runTypeCheck(['--pretty'])
      
      // Log the full error output for debugging
      if (errors) {
        console.log('\nTypeScript Compilation Errors:')
        console.log(errors)
      }
      
      expect(errors).toBe('')
    })

    it('should not have any explicit "any" types in source files', async () => {
      const { errors } = await runEslint(['src/**/*.{ts,tsx}'])
      
      const anyTypeErrors = errors.flatMap(error =>
        error.messages
          .filter(msg => msg.ruleId === '@typescript-eslint/no-explicit-any')
          .map(msg => `${error.filePath} Line ${msg.line}: ${msg.message}`)
      )

      expect(anyTypeErrors).toHaveLength(0)
    })

    it('should not have unsafe type assertions in source files', async () => {
      const { errors } = await runEslint(['src/**/*.{ts,tsx}'])
      
      const unsafeAssertions = errors.flatMap(error =>
        error.messages
          .filter(msg => [
            '@typescript-eslint/no-unsafe-assignment',
            '@typescript-eslint/no-unsafe-member-access',
            '@typescript-eslint/no-unsafe-call',
            '@typescript-eslint/no-unsafe-return'
          ].includes(msg.ruleId))
          .map(msg => `${error.filePath} Line ${msg.line}: ${msg.message}`)
      )

      expect(unsafeAssertions).toHaveLength(0)
    })
  })

  describe('Next.js Specific Checks', () => {
    it('should not have client-side imports in server components', async () => {
      const { errors } = await runEslint(['src/app/**/page.tsx', 'src/app/**/layout.tsx'])
      
      const clientImportErrors = errors.flatMap(error =>
        error.messages
          .filter(msg => 
            msg.ruleId === 'next/no-client-import' ||
            msg.message.includes('Component cannot be used on the server')
          )
          .map(msg => `${error.filePath} Line ${msg.line}: ${msg.message}`)
      )

      expect(clientImportErrors).toHaveLength(0)
    })

    it('should have proper metadata exports in pages', async () => {
      const { errors } = await runEslint(['src/app/**/page.tsx'])
      
      const metadataErrors = errors.flatMap(error =>
        error.messages
          .filter(msg => msg.ruleId === 'next/missing-page-file-export')
          .map(msg => `${error.filePath} Line ${msg.line}: ${msg.message}`)
      )

      expect(metadataErrors).toHaveLength(0)
    })
  })

  describe('Linting', () => {
    it('should not have linting errors in test files', async () => {
      const testFiles = [
        'src/__tests__/unit/components/NavBar.test.tsx',
        'src/__tests__/unit/pages/AgentsPage.test.tsx',
        'src/__tests__/unit/pages/AnalyticsPage.test.tsx',
        'src/__tests__/unit/pages/DocsPage.test.tsx'
      ]

      const { success } = await runEslint(testFiles)
      expect(success).toBe(true)
    })

    it('should not have unused imports in test files', async () => {
      const testFiles = [
        'src/__tests__/unit/components/NavBar.test.tsx',
        'src/__tests__/unit/pages/AgentsPage.test.tsx',
        'src/__tests__/unit/pages/AnalyticsPage.test.tsx'
      ]

      const { errors } = await runEslint(testFiles)
      const unusedImports = errors.flatMap(error =>
        error.messages
          .filter(msg => msg.ruleId === '@typescript-eslint/no-unused-vars')
          .map(msg => `${error.filePath}: ${msg.message}`)
      )

      expect(unusedImports).toHaveLength(0)
    })

    it('should have display names in all React components', async () => {
      const testFiles = ['src/__tests__/unit/pages/DocsPage.test.tsx']
      
      const { errors } = await runEslint(testFiles)
      const displayNameErrors = errors.flatMap(error =>
        error.messages
          .filter(msg => msg.ruleId === 'react/display-name')
          .map(msg => `${error.filePath} Line ${msg.line}: ${msg.message}`)
      )

      expect(displayNameErrors).toHaveLength(0)
    })
  })
}) 