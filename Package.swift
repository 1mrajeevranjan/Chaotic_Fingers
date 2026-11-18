// swift-tools-version: 5.9
import PackageDescription

// The app itself is built by ChaoticFingers.xcodeproj. This package only exists
// so the pure logic in Core can be checked from the command line.
let package = Package(
    name: "ChaoticFingers",
    platforms: [
        .macOS(.v14)
    ],
    targets: [
        // Pure gesture/blocking logic, free of AppKit so it can be exercised
        // by the SelfCheck executable.
        .target(name: "ChaoticFingersCore", path: "Core"),

        // `swift run SelfCheck` — assert-based checks for ChaoticFingersCore.
        .executableTarget(
            name: "SelfCheck",
            dependencies: ["ChaoticFingersCore"],
            path: "Tests/SelfCheck"
        )
    ]
)
