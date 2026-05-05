.PHONY: build clean package install check-node

PLUGIN_ID := com.hadikhanian.mattermost-rtl
PLUGIN_VERSION := $(shell node -p "require('./plugin.json').version" 2>/dev/null || echo "1.0.0")
BUNDLE_NAME := $(PLUGIN_ID)-$(PLUGIN_VERSION).zip

# ── Dependency check ──────────────────────────────────────────────────────────
check-node:
	@command -v node >/dev/null 2>&1 || { echo "Node.js is required. https://nodejs.org/"; exit 1; }
	@command -v npm  >/dev/null 2>&1 || { echo "npm is required."; exit 1; }

# ── Install npm deps ──────────────────────────────────────────────────────────
webapp/node_modules: webapp/package.json
	cd webapp && npm install
	@touch webapp/node_modules

# ── Build the webapp bundle ───────────────────────────────────────────────────
webapp/dist/main.js: webapp/node_modules $(shell find webapp/src -type f 2>/dev/null)
	cd webapp && npm run build

# ── Package for upload ────────────────────────────────────────────────────────
build: check-node webapp/dist/main.js
	@rm -rf dist
	@mkdir -p dist/$(PLUGIN_ID)
	@cp plugin.json dist/$(PLUGIN_ID)/
	@cp -r webapp/dist dist/$(PLUGIN_ID)/webapp/
	@cd dist && zip -r ../$(BUNDLE_NAME) $(PLUGIN_ID)
	@rm -rf dist
	@echo ""
	@echo "✅  Plugin package ready: $(BUNDLE_NAME)"
	@echo "    Upload to: System Console → Plugin Management → Upload Plugin"

# ── Dev: watch mode ──────────────────────────────────────────────────────────
dev: check-node webapp/node_modules
	cd webapp && npm run build:dev

# ── Clean ─────────────────────────────────────────────────────────────────────
clean:
	rm -rf webapp/node_modules webapp/dist dist *.zip
