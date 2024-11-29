const ejs = require('ejs');
const fs = require('fs-extra');
const path = require('path');

async function generateApp() {
    // Prompt user for project name
    const projectName = "demo"; // Hardcoded for testing; replace with inquirer.prompt for dynamic input

    const templateDir = path.join(__dirname, 'templates');
    const outputDir = path.join(__dirname, 'generated-apps', projectName);

    // Ensure the output directory exists
    fs.ensureDirSync(outputDir);

    // Process templates
    processTemplates(templateDir, outputDir, { projectName });

    console.log(`Project "${projectName}" has been generated at ${outputDir}`);
}

// Recursive function to process templates
function processTemplates(templateDir, outputDir, context) {
    fs.readdirSync(templateDir).forEach(entry => {
        const templatePath = path.join(templateDir, entry);
        const outputPath = path.join(outputDir, entry.replace('.ejs', '.ts')); // Replace only for `.ejs` files

        if (fs.statSync(templatePath).isDirectory()) {
            // If it's a directory, recursively process it
            fs.ensureDirSync(outputPath); // Ensure the corresponding output directory exists
            processTemplates(templatePath, outputPath, context);
        } else {
            // If it's a file, render and output it
            const template = fs.readFileSync(templatePath, 'utf-8');
            const rendered = ejs.render(template, context);
            fs.outputFileSync(outputPath, rendered);
        }
    });
}

generateApp().catch(err => console.error(err));
