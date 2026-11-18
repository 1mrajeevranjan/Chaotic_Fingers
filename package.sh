#!/bin/bash
# =============================================================================
# package.sh — Archive Chaotic Fingers with Xcode and wrap it in a DMG
#
#   bash package.sh                      archive + DMG (Apple Development signed)
#   bash package.sh path/to/Exported.app DMG an app exported from Xcode Organizer
#
# Bundle id, version, team and signing all come from ChaoticFingers.xcodeproj —
# change them in Xcode, not here.
# =============================================================================
set -e

APP_NAME="Chaotic Fingers"
DMG_NAME="ChaoticFingers-Installer.dmg"
VOLUME_NAME="Chaotic Fingers"
ARCHIVE="build/ChaoticFingers.xcarchive"
DIST_DIR="dist"

if [ -n "$1" ]; then
    APP_PATH="$1"
else
    echo "🔨 Archiving Universal release build..."
    rm -rf "${ARCHIVE}"
    xcodebuild -project ChaoticFingers.xcodeproj -scheme ChaoticFingers \
        -configuration Release -archivePath "${ARCHIVE}" \
        -allowProvisioningUpdates -quiet archive
    APP_PATH="${ARCHIVE}/Products/Applications/${APP_NAME}.app"
fi

codesign --verify --strict "${APP_PATH}"
echo "   ✅ $(codesign -dvv "${APP_PATH}" 2>&1 | grep '^Authority' | head -1)"

# ── DMG ───────────────────────────────────────────────────────────────────────
echo "📀 Creating DMG installer..."
mkdir -p "${DIST_DIR}"
rm -f "${DIST_DIR}/${DMG_NAME}"

STAGING_DIR=$(mktemp -d)
cp -R "${APP_PATH}" "${STAGING_DIR}/${APP_NAME}.app"
ln -s /Applications "${STAGING_DIR}/Applications"

hdiutil create \
    -volname "${VOLUME_NAME}" \
    -srcfolder "${STAGING_DIR}" \
    -ov \
    -format UDZO \
    -imagekey zlib-level=9 \
    "${DIST_DIR}/${DMG_NAME}"

rm -rf "${STAGING_DIR}"

echo ""
echo "✅ Done: ${DIST_DIR}/${DMG_NAME}"
