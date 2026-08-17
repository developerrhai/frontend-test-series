const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

function processDirectory(dir, isSubdir = false) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Process subdirectories
            if (file !== 'node_modules' && file !== '.git') {
                processDirectory(fullPath, true);
            }
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Check if it already has config.js
            if (!content.includes('config.js')) {
                const scriptSrc = isSubdir ? '../config.js' : 'config.js';
                const scriptTag = `\n<script src="${scriptSrc}"></script>\n`;

                // Try to inject before the first <script> tag
                const scriptIndex = content.indexOf('<script');
                if (scriptIndex !== -1) {
                    content = content.slice(0, scriptIndex) + scriptTag + content.slice(scriptIndex);
                } else {
                    // Inject before </body>
                    const bodyEndIndex = content.indexOf('</body>');
                    if (bodyEndIndex !== -1) {
                        content = content.slice(0, bodyEndIndex) + scriptTag + content.slice(bodyEndIndex);
                    }
                }
                
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(rootDir);
console.log("Done updating HTML files!");
