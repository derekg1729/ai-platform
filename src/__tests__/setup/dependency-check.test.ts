import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

describe('Package Dependencies', () => {
  const packageJson = (() => {
    try {
      return JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'))
    } catch (error) {
      console.error('Failed to read package.json:', error)
      return { dependencies: {}, devDependencies: {} }
    }
  })()

  const nextConfig = (() => {
    const nextConfigPath = join(process.cwd(), 'next.config.js')
    if (existsSync(nextConfigPath)) {
      return readFileSync(nextConfigPath, 'utf8')
    }
    return null
  })()

  const parseVersion = (version: string) => {
    // Remove any leading ^ or ~ 
    const cleanVersion = version.replace(/[\^~]/, '')
    const [major, minor, patch] = cleanVersion.split('.').map(Number)
    return { major, minor, patch }
  }

  const isVersionSupported = (version: string, requirement: string): boolean => {
    const installed = parseVersion(version)
    const required = parseVersion(requirement)

    // If major versions don't match, it's definitely not supported
    if (installed.major !== required.major) {
      return false
    }

    // For React 18, we know it's the latest stable version
    // Any version above 18 is not officially supported yet
    if (installed.major > 18) {
      return false
    }

    return true
  }

  it('should use a supported React version', () => {
    const reactVersion = packageJson.dependencies?.react
    if (reactVersion === undefined) {
      throw new Error('React dependency is required')
    }
    const supportedReactVersion = '18.0.0'
    
    expect(
      isVersionSupported(reactVersion, supportedReactVersion)
    ).toBe(true)
  })

  it('should have compatible testing library dependencies', () => {
    const reactVersion = packageJson.dependencies?.react
    if (reactVersion === undefined) {
      throw new Error('React dependency is required')
    }
    const testingLibraryVersion = packageJson.devDependencies?.['@testing-library/react']
    
    if (testingLibraryVersion === undefined) {
      throw new Error('@testing-library/react is required for testing')
    }

    // Testing Library React 14.x requires React 18
    expect(
      isVersionSupported(reactVersion, '18.0.0')
    ).toBe(true)
  })

  it('should have matching React runtime and type versions', () => {
    const reactVersion = packageJson.dependencies?.react
    if (reactVersion === undefined) {
      throw new Error('React dependency is required')
    }
    const reactTypes = packageJson.devDependencies?.['@types/react']
    const reactDomTypes = packageJson.devDependencies?.['@types/react-dom']

    if (reactTypes === undefined || reactDomTypes === undefined) {
      throw new Error('React type definitions are required')
    }

    const reactMajor = parseVersion(reactVersion).major
    const typesMajor = parseVersion(reactTypes).major
    const domTypesMajor = parseVersion(reactDomTypes).major

    expect(typesMajor).toBe(reactMajor)
    expect(domTypesMajor).toBe(reactMajor)
  })

  it('should have compatible peer dependencies', () => {
    const peerDependencies = {
      '@testing-library/react': {
        react: '^18.0.0',
        'react-dom': '^18.0.0'
      },
      '@mdx-js/react': {
        react: '>=16.8.0'
      }
    }

    Object.entries(peerDependencies).forEach(([pkg, peers]) => {
      if (packageJson.devDependencies?.[pkg] !== undefined) {
        Object.entries(peers).forEach(([peerPkg, requiredVersion]) => {
          const installedVersion = packageJson.dependencies?.[peerPkg]
          if (installedVersion === undefined) {
            throw new Error(`Missing peer dependency: ${peerPkg} is required by ${pkg}`)
          }

          expect(
            isVersionSupported(installedVersion, requiredVersion.replace('^', ''))
          ).toBe(true)
        })
      }
    })
  })

  it('should have compatible Next.js dependencies', () => {
    const nextVersion = packageJson.dependencies?.next
    if (nextVersion === undefined) {
      throw new Error('Next.js dependency is required')
    }
    const reactVersion = packageJson.dependencies?.react
    if (reactVersion === undefined) {
      throw new Error('React dependency is required')
    }
    const nextConfigVersion = packageJson.devDependencies?.['eslint-config-next']
    if (nextConfigVersion === undefined) {
      throw new Error('eslint-config-next devDependency is required')
    }

    // Next.js 15.x requires React 18
    expect(isVersionSupported(reactVersion, '18.0.0')).toBe(true)
    
    // Next.js and its ESLint config should be on the same version
    expect(parseVersion(nextVersion).major).toBe(parseVersion(nextConfigVersion).major)
  })

  it('should have compatible Node.js types for Vercel deployment', () => {
    const nodeTypes = packageJson.devDependencies?.['@types/node']
    if (nodeTypes === undefined) {
      throw new Error('@types/node is required for Vercel deployment')
    }

    // Vercel currently supports Node.js 18.x and 20.x
    const nodeTypesVersion = parseVersion(nodeTypes).major
    expect([18, 20]).toContain(nodeTypesVersion)
  })

  // Only run MDX-related tests if the dependencies are present
  if (packageJson.dependencies?.['@mdx-js/react'] !== undefined) {
    it('should have required MDX dependencies for documentation', () => {
      const requiredMdxDeps = ['@mdx-js/loader', '@mdx-js/react', '@next/mdx']
      requiredMdxDeps.forEach(dep => {
        expect(packageJson.dependencies?.[dep]).toBeDefined()
      })
    })

    it('should have MDX configured in Next.js config', () => {
      if (nextConfig !== null) {
        expect(nextConfig).toContain('@next/mdx')
        expect(nextConfig).toContain('pageExtensions')
      }
    })
  }
}) 