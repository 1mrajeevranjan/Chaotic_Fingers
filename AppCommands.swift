// App-wide menu commands for starting and stopping blocking, plus a Help item
// listing the recovery gestures.

import SwiftUI
import AppKit
import Carbon.HIToolbox
import ChaoticFingersCore

struct AppCommands: Commands {
    private var delegate: AppDelegate? { AppDelegate.shared }

    var body: some Commands {
        CommandMenu("Blocking") {
            Button("Start Keyboard Blocking") { AppCommands.start(.keyboard) }
                .keyboardShortcut("k", modifiers: [.command, .shift])

            Button("Start Trackpad Blocking") { AppCommands.start(.trackpad) }
                .keyboardShortcut("t", modifiers: [.command, .shift])

            Button("Start Both") { AppCommands.start(.both) }
                .keyboardShortcut("b", modifiers: [.command, .shift])

            Divider()

            Button("Stop Blocking") { delegate?.stopBlocking() }
                .keyboardShortcut(".", modifiers: .command)
        }

        // Without this the dashboard is unreachable from the menu bar once it
        // has been closed — the status item menu was the only way back.
        CommandGroup(before: .windowList) {
            Button("Dashboard") { delegate?.showMainWindow() }
                .keyboardShortcut("0", modifiers: .command)
            Divider()
        }

        // Replaces the stock Help item — a second `CommandMenu("Help")` would
        // add a duplicate Help menu next to the one AppKit already installs.
        CommandGroup(replacing: .help) {
            Button("Chaotic Fingers Help") { AppCommands.showGestureHelp() }
                .keyboardShortcut("?", modifiers: .command)
        }
    }

    /// Shortcuts only start blocking from idle, like the dashboard, which locks
    /// its mode picker while blocking. Switching mid-lock would release what the
    /// old mode held — in trackpad mode the keyboard is live, so a stray ⇧⌘K
    /// would unlock the trackpad.
    @MainActor
    static func start(_ mode: BlockingMode) {
        guard let delegate = AppDelegate.shared, !delegate.blocker.isBlocking else { return }
        delegate.startBlocking(mode: mode)
        // From another app the dashboard's permission warning is out of sight,
        // so a missing Accessibility grant would otherwise fail silently.
        if delegate.blocker.permissionDenied {
            delegate.showMainWindow()
        }
    }

    static func showGestureHelp() {
        let alert = NSAlert()
        alert.messageText = "Recovery gestures"
        alert.informativeText = """
        If this window is hidden while inputs are locked, hold the pair for \
        3 seconds:

        • Keyboard mode — both Shift keys
        • Trackpad mode — both Option keys
        • Both mode — both Command keys

        Last resort: press Esc, Esc, Return, Return to quit the app.
        """
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.runModal()
    }
}

/// The Blocking menu shortcuts only fire while the app is frontmost, which a
/// menu bar app rarely is. Register the three start shortcuts system-wide as
/// well. Carbon hot keys need no Accessibility access. Should the menu item
/// also see a press while the app is frontmost, `AppCommands.start` ignores
/// the second call because blocking has already begun.
@MainActor
enum GlobalHotKeys {
    private static let bindings: [(key: Int, mode: BlockingMode)] = [
        (kVK_ANSI_K, .keyboard),
        (kVK_ANSI_T, .trackpad),
        (kVK_ANSI_B, .both)
    ]
    private static var refs: [EventHotKeyRef] = []

    static func register() {
        guard refs.isEmpty else { return }

        var pressed = EventTypeSpec(eventClass: OSType(kEventClassKeyboard),
                                    eventKind: UInt32(kEventHotKeyPressed))
        InstallEventHandler(GetApplicationEventTarget(), { _, event, _ in
            var id = EventHotKeyID()
            GetEventParameter(event, EventParamName(kEventParamDirectObject),
                              EventParamType(typeEventHotKeyID), nil,
                              MemoryLayout<EventHotKeyID>.size, nil, &id)
            // Application-target handlers run on the main thread.
            MainActor.assumeIsolated { GlobalHotKeys.fire(Int(id.id)) }
            return noErr
        }, 1, &pressed, nil, nil)

        let signature = OSType(0x4346_4E47) // 'CFNG'
        for (index, binding) in bindings.enumerated() {
            var ref: EventHotKeyRef?
            let status = RegisterEventHotKey(UInt32(binding.key), UInt32(cmdKey | shiftKey),
                                             EventHotKeyID(signature: signature, id: UInt32(index)),
                                             GetApplicationEventTarget(), 0, &ref)
            if status == noErr, let ref {
                refs.append(ref)
            } else {
                NSLog("Failed to register global shortcut for \(binding.mode): \(status)")
            }
        }
    }

    private static func fire(_ index: Int) {
        guard bindings.indices.contains(index) else { return }
        AppCommands.start(bindings[index].mode)
    }
}
