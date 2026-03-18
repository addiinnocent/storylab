# Building & Deployment

## Building for Production

### Prerequisites

- All code committed to git
- No uncommitted changes
- Dependencies installed: `npm install && npm install --prefix server`

### Build Command

```bash
npm run build
```

This runs the complete build pipeline:

1. **TypeScript Check** → `tsc` (no emit, type checking only)
2. **Vite Build** → Builds React frontend to `dist/`
3. **Server Build** → `npm run build:ts --prefix server` (compiles to `server/dist/`)
4. **Cargo Build** → Compiles Rust backend and bundles everything

### Build Output

Build artifacts are created in:

```
src-tauri/target/release/bundle/
├── dmg/               # macOS disk image (for distribution)
│   └── storylab_0.1.0_x64.dmg
├── msi/               # Windows installer
│   └── storylab_0.1.0_x64_en-US.msi
└── app/               # Standalone executables
    ├── storylab.exe   # Windows
    ├── storylab       # Linux
    └── storylab.app   # macOS (app bundle)
```

### macOS Specific

On macOS, the build creates:

1. **DMG** (Disk Image) → For distribution/installation
   - File: `target/release/bundle/dmg/storylab_0.1.0_x64.dmg`
   - Double-click to mount, drag to Applications folder

2. **App Bundle** → Direct executable
   - Location: `target/release/bundle/app/storylab.app`
   - Run: Double-click or `open storylab.app`

### Windows Specific

On Windows, the build creates:

1. **MSI** (Windows Installer) → For distribution
   - File: `target/release/bundle/msi/storylab_0.1.0_x64_en-US.msi`
   - Double-click to install

2. **EXE** → Standalone executable
   - Location: `target/release/bundle/app/storylab.exe`
   - Run: Double-click

### Linux Specific

On Linux, the build creates:

1. **AppImage** → Portable executable
2. **Deb** → Debian/Ubuntu package (if configured)

## Release Builds vs Debug

### Debug Build (Development)

```bash
npm run tauri dev
```

- Large binary with debug symbols
- Slower startup
- Full logging output
- For testing/development only

### Release Build (Production)

```bash
npm run build
```

- Optimized binary (smaller, faster)
- Minimal logging
- Suitable for distribution
- 2-3x smaller than debug binary

## Build Configuration

### Version

Edit `package.json` to bump version:

```json
{
  "version": "0.1.1"  // Increment this
}
```

Version is used in:
- App title
- Windows installer filename
- macOS DMG filename
- App metadata

### App Metadata

Edit `src-tauri/tauri.conf.json`:

```json
{
  "productName": "storylab",
  "version": "0.1.0",
  "identifier": "com.yannik.storylab"
}
```

- `productName` → App display name
- `identifier` → Unique app identifier (reverse domain)
- `version` → Semantic version

### Window Configuration

Edit `src-tauri/tauri.conf.json`:

```json
"app": {
  "windows": [{
    "title": "storylab",
    "width": 800,
    "height": 600
  }]
}
```

## Bundled Resources

The build bundles:

1. **Frontend Assets** → React build output
2. **Server Files** → Compiled Fastify server
3. **Icons** → App icons for different platforms

Specified in `src-tauri/tauri.conf.json`:

```json
"bundle": {
  "resources": ["../server/dist/**/*"]
}
```

This copies all server files into the app bundle.

## Signing & Notarization

### macOS Code Signing

For distribution on macOS, apps must be signed.

Configure in `src-tauri/tauri.conf.json`:

```json
"bundle": {
  "macOS": {
    "signingIdentity": "Developer ID Application: Your Name",
    "entitlements": "src-tauri/entitlements.plist"
  }
}
```

### macOS Notarization

Required for macOS 10.15+ (Catalina+).

1. Create signing certificate from Apple Developer Program
2. Set up in Xcode
3. Configure in tauri.conf.json
4. Build and notarize

See [Tauri macOS Documentation](https://v2.tauri.app/develop/building/) for detailed steps.

### Windows Code Signing

For Windows, you may want to sign with your organization's certificate to avoid SmartScreen warnings.

Configure in `src-tauri/tauri.conf.json`:

```json
"bundle": {
  "windows": {
    "certificatePath": null,
    "certificatePassword": null,
    "signerPath": null,
    "sign": []
  }
}
```

## Troubleshooting Builds

### "cargo not found"

Rust not installed:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
npm run build
```

### "TypeScript errors"

Resolve type errors before building:
```bash
npm run build  # Shows errors
# Fix errors in src/
npm run build
```

### "Server build failed"

Recompile server:
```bash
cd server
npm install
npm run build:ts
cd ..
npm run build
```

### "Module not found"

Clear caches and rebuild:
```bash
rm -rf node_modules server/node_modules src-tauri/target
npm install
npm install --prefix server
npm run build
```

### "Build hangs or takes very long"

Rust compilation can be slow. Wait or:

1. Close other applications
2. Check disk space (needs ~2GB for Rust toolchain)
3. Check if antivirus is scanning build files (add to exclusion list)

### "Different binary size on rebuild"

Normal—depends on:
- Compiler optimizations
- Rust version
- System state

Consistent sizes expected within 5-10%.

## Distribution

### macOS Distribution

1. Build: `npm run build`
2. File: `target/release/bundle/dmg/storylab_0.1.0_x64.dmg`
3. Share the `.dmg` file
4. Users: Double-click to mount, drag app to Applications

### Windows Distribution

1. Build: `npm run build`
2. File: `target/release/bundle/msi/storylab_0.1.0_x64_en-US.msi`
3. Share the `.msi` file
4. Users: Double-click to install

### Update Strategy

For updates, you have options:

1. **Manual Distribution** → New DMG/MSI file
2. **Update Server** → Tauri update checks
3. **App Store** → macOS App Store, Microsoft Store

For now, manual distribution is simplest.

## Performance Considerations

### Binary Size

Current build sizes (approximate):

- **macOS DMG** → 60-80 MB
- **Windows MSI** → 70-90 MB
- **Linux AppImage** → 70-90 MB

Includes:
- Rust runtime
- Node.js interpreter
- Fastify server code
- React frontend
- Assets

### Startup Time

On modern machines:
- **Cold start** → 1-2 seconds
- **Warm start** → 1 second

Bottlenecks:
- Node.js startup (~500ms)
- Tauri initialization (~300ms)
- React hydration (~200ms)

### Optimization Tips

1. **Lazy-load routes** → React code splitting
2. **Compress assets** → Vite build optimization
3. **Minimize server startup** → Remove unused middleware

## CI/CD Integration

For automated builds (GitHub Actions, GitLab CI, etc.):

```yaml
# Example GitHub Actions
- name: Build app
  run: npm run build

- name: Upload artifacts
  uses: actions/upload-artifact@v2
  with:
    name: storylab-app
    path: src-tauri/target/release/bundle/
```

For details, see [Tauri CI/CD Guide](https://v2.tauri.app/develop/building/).

## Security Best Practices

1. **Only distribute official builds** → Never modify executable after building
2. **Code signing** → Sign binaries on supported platforms
3. **Keep dependencies updated** → Regularly update Rust, Node.js, npm packages
4. **Audit dependencies** → Check for known vulnerabilities: `npm audit`
5. **Review logs** → Ensure no sensitive data in logs before release

## Rollback / Downgrade

If a release has issues:

1. Build previous version from git tag
2. Distribute old version
3. Users can downgrade by installing old version

```bash
git checkout v0.1.0
npm run build
# Distribute build
```

## Next Steps

- [ ] Set up code signing for distribution
- [ ] Configure update mechanism (if needed)
- [ ] Test builds on all target platforms
- [ ] Set up CI/CD for automated builds
- [ ] Document release process for your team
