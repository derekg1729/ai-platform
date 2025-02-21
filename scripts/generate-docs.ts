const fs = require('fs');
const matter = require('gray-matter');
const path = require('path');

async function generateReadme() {
  try {
    // Read the main introduction content
    const introPath = path.join(process.cwd(), 'src/content/docs/index.mdx');
    const introContent = fs.readFileSync(introPath, 'utf-8');
    const { content: introMarkdown } = matter(introContent);

    // Extract the getting started section from the intro content
    const gettingStartedSection = introMarkdown.split('## Getting Started')[1]?.split('##')[0]?.trim() || '';

    const readmeContent = `# AI Agent Hub

> ⚠️ This README is auto-generated from the documentation in \`src/content/docs\`. Please edit the source files instead.
> To regenerate this file, run: \`npx ts-node scripts/generate-docs.ts\`

${introMarkdown.split('## Getting Started')[0].trim()}

## Getting Started

${gettingStartedSection}

## Documentation

For complete documentation, please visit our [documentation page](/docs).

## License

MIT License - see LICENSE for more details.
`;

    // Write the README.md file
    fs.writeFileSync('README.md', readmeContent);
    console.info('✅ README.md has been generated successfully!');
  } catch (error) {
    console.error('Error generating README:', error);
    process.exit(1);
  }
}

generateReadme(); 