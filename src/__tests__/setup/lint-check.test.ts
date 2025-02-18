import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

describe('Linting', () => {
  const runEslint = async (files: string[]) => {
    try {
      await execAsync(`npx eslint ${files.join(' ')} --format json`)
      return { success: true, errors: [] }
    } catch (error: any) {
      if (error.stdout) {
        const results = JSON.parse(error.stdout)
        return {
          success: false,
          errors: results.map((result: any) => ({
            filePath: result.filePath.split('ai-platform/')[1],
            messages: result.messages.map((msg: any) => ({
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

  it('should not have linting errors in test files', async () => {
    const testFiles = [
      'src/__tests__/unit/components/NavBar.test.tsx',
      'src/__tests__/unit/pages/AgentsPage.test.tsx',
      'src/__tests__/unit/pages/AnalyticsPage.test.tsx',
      'src/__tests__/unit/pages/DocsPage.test.tsx'
    ]

    const { success, errors } = await runEslint(testFiles)
    const errorMessages = errors.map(error => 
      `${error.filePath}:\n${error.messages
        .map(msg => `  ${msg.line}:${msg.column}  ${msg.message}  ${msg.ruleId}`)
        .join('\n')}`
    )

    expect(success).toBe(true,
      'Linting errors found:\n' + errorMessages.join('\n\n'))
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

    expect(unusedImports).toEqual([],
      'Unused imports found:\n' + unusedImports.join('\n'))
  })

  it('should have display names in all React components', async () => {
    const testFiles = ['src/__tests__/unit/pages/DocsPage.test.tsx']
    
    const { errors } = await runEslint(testFiles)
    const displayNameErrors = errors.flatMap(error =>
      error.messages
        .filter(msg => msg.ruleId === 'react/display-name')
        .map(msg => `${error.filePath} Line ${msg.line}: ${msg.message}`)
    )

    expect(displayNameErrors).toEqual([],
      'Missing display names:\n' + displayNameErrors.join('\n'))
  })
}) 