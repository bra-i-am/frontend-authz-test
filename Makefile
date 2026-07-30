build:
	rm -rf ./dist
	./node_modules/.bin/fedx-scripts babel src --out-dir dist --source-maps --ignore **/*.test.tsx,**/*.test.ts,**/*.test.jsx,**/*.test.js --copy-files
	@find dist -name '*.test.*' -delete
	cp ./package.json ./dist/package.json
	cp ./LICENSE ./dist/LICENSE
	cp ./README.rst ./dist/README.rst

precommit:
	npm run lint
	npm audit

requirements:
	npm ci
