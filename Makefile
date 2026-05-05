.PHONY: build bundle clean dev check-node

PLUGIN_ID := com.hadikhanian.mattermost-rtl
PLUGIN_VERSION := $(shell node -p "require('./plugin.json').version" 2>/dev/null || echo "1.0.0")
BUNDLE_NAME := $(PLUGIN_ID)-$(PLUGIN_VERSION).tar.gz

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
# Mirrors the official mattermost-plugin-starter-template layout:
#   <plugin-id>/
#     plugin.json
#     webapp/dist/main.js   ← MUST match plugin.json's bundle_path
#
# CRITICAL: we mkdir webapp/ BEFORE the cp, so that `cp -r webapp/dist …`
# copies the `dist` folder *into* webapp/, producing webapp/dist/main.js.
# Without the pre-mkdir, cp would create webapp/ AS a copy of dist/ and
# the bundle would end up at webapp/main.js — Mattermost would then fail
# to load the webapp module.
build bundle: check-node webapp/dist/main.js
	rm -rf dist
	mkdir -p dist/$(PLUGIN_ID)
	cp plugin.json dist/$(PLUGIN_ID)/
	mkdir -p dist/$(PLUGIN_ID)/webapp
	cp -r webapp/dist dist/$(PLUGIN_ID)/webapp/
ifeq ($(shell uname),Darwin)
	cd dist && tar --disable-copyfile -czf ../$(BUNDLE_NAME) $(PLUGIN_ID)
else
	cd dist && tar -czf ../$(BUNDLE_NAME) $(PLUGIN_ID)
endif
	@echo ""
	@echo "Plugin bundle ready: $(BUNDLE_NAME)"
	@echo "Upload via: System Console -> Plugin Management -> Upload Plugin"
	@echo ""
	@echo "Bundle contents:"
	@tar -tzf $(BUNDLE_NAME)

# ── Dev: watch mode ──────────────────────────────────────────────────────────
dev: check-node webapp/node_modules
	cd webapp && npm run build:dev

# ── Clean ─────────────────────────────────────────────────────────────────────
clean:
	rm -rf webapp/node_modules webapp/dist dist *.tar.gz *.zip
