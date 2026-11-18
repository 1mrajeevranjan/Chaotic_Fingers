// End-to-end check of the global ⇧⌘K / ⇧⌘T / ⇧⌘B shortcuts against a built app.
//
//   swiftc -O -o /tmp/shortcuts-e2e Tests/ShortcutsE2E.swift
//   /tmp/shortcuts-e2e "build/dd/Build/Products/Debug/Chaotic Fingers.app" /tmp/cf.log [scenario]
//
// Needs Accessibility for the terminal (to post keys) and for the app under test.
// It really locks input for a few seconds per scenario; the app is SIGKILLed
// after each one (its taps die with it), with a 120 s watchdog on top.
import Foundation
import AppKit
import CoreGraphics
import Carbon.HIToolbox

let app = CommandLine.arguments[1]
let exe = app + "/Contents/MacOS/Chaotic Fingers"
let logPath = CommandLine.arguments[2]
let only = CommandLine.arguments.count > 3 ? CommandLine.arguments[3] : nil
let marker: Int64 = 0x4346_5445

final class Seen { var keys = 0; var moves = 0 }
let seen = Seen()
let listen: CGEventTapCallBack = { _, type, event, ctx in
    if event.getIntegerValueField(.eventSourceUserData) == marker, let ctx {
        let s = Unmanaged<Seen>.fromOpaque(ctx).takeUnretainedValue()
        if type == .keyDown { s.keys += 1 } else if type == .mouseMoved { s.moves += 1 }
    }
    return Unmanaged.passUnretained(event)
}
let listenMask = CGEventMask(1 << CGEventType.keyDown.rawValue | 1 << CGEventType.mouseMoved.rawValue)
guard let tap = CGEvent.tapCreate(tap: .cgAnnotatedSessionEventTap, place: .tailAppendEventTap, options: .listenOnly,
                                  eventsOfInterest: listenMask, callback: listen,
                                  userInfo: Unmanaged.passUnretained(seen).toOpaque()) else { fatalError("cannot create listen tap") }
CFRunLoopAddSource(CFRunLoopGetCurrent(), CFMachPortCreateRunLoopSource(nil, tap, 0), .commonModes)

let source = CGEventSource(stateID: .privateState)
func spin(_ s: Double) { RunLoop.current.run(until: Date().addingTimeInterval(s)) }

func press(_ code: Int, _ flags: CGEventFlags) {
    for down in [true, false] {
        let e = CGEvent(keyboardEventSource: source, virtualKey: CGKeyCode(code), keyDown: down)!
        e.flags = flags
        e.setIntegerValueField(.eventSourceUserData, value: marker)
        e.post(tap: .cghidEventTap)
        spin(0.03)
    }
    spin(0.5)
}
let cmdShift: CGEventFlags = [.maskCommand, .maskShift]

func appWindows(_ pid: pid_t) -> [CGRect] {
    let info = CGWindowListCopyWindowInfo([.optionOnScreenOnly], kCGNullWindowID) as? [[String: Any]] ?? []
    return info.filter { ($0[kCGWindowOwnerPID as String] as? pid_t) == pid }.compactMap {
        guard let b = $0[kCGWindowBounds as String] as? NSDictionary else { return nil }
        return CGRect(dictionaryRepresentation: b)
    }
}

func tapCount(_ pid: pid_t) -> Int {
    var n: UInt32 = 0
    CGGetEventTapList(0, nil, &n)
    var list = [CGEventTapInformation](repeating: CGEventTapInformation(), count: Int(n))
    CGGetEventTapList(n, &list, &n)
    return list.filter { $0.tappingProcess == pid && $0.enabled }.count
}

func mode(_ pid: pid_t) -> String {
    let k0 = seen.keys, m0 = seen.moves
    press(kVK_F19, [])
    // A move to where the cursor already is; nudged off the app's own windows,
    // which the pointer tap deliberately lets through.
    var p = CGEvent(source: nil)!.location
    let wins = appWindows(pid)
    if wins.contains(where: { $0.contains(p) }) {
        let screen = CGDisplayBounds(CGMainDisplayID())
        p = [CGPoint(x: screen.midX, y: screen.maxY - 120), CGPoint(x: 40, y: screen.midY), CGPoint(x: screen.maxX - 40, y: screen.midY)]
            .first { q in !wins.contains { $0.contains(q) } } ?? p
    }
    let m = CGEvent(mouseEventSource: source, mouseType: .mouseMoved, mouseCursorPosition: p, mouseButton: .left)!
    m.setIntegerValueField(.eventSourceUserData, value: marker)
    m.post(tap: .cghidEventTap)
    spin(0.5)
    let keysPass = seen.keys > k0, pointerPass = seen.moves > m0
    let name: String
    switch (keysPass, pointerPass) {
    case (true, true): name = "none"
    case (false, true): name = "keyboard"
    case (true, false): name = "trackpad"
    case (false, false): name = "both"
    }
    return "\(name)/\(tapCount(pid))"
}

let expectedTaps = ["none": 0, "keyboard": 1, "trackpad": 2, "both": 2]
var failures = 0
var current: Process?
let userFront = NSWorkspace.shared.frontmostApplication
let cursorHome = CGEvent(source: nil)!.location

func kill() {
    if let p = current, p.isRunning { Darwin.kill(p.processIdentifier, SIGKILL); p.waitUntilExit() }
    current = nil
}
// Watchdog: never leave the machine with input locked.
DispatchQueue.global().asyncAfter(deadline: .now() + 120) {
    if let p = current { Darwin.kill(p.processIdentifier, SIGKILL) }
    print("WATCHDOG: aborted"); exit(2)
}

func launch(front: Bool) -> pid_t {
    let p = Process()
    p.executableURL = URL(fileURLWithPath: exe)
    FileManager.default.createFile(atPath: logPath, contents: nil)
    let log = FileHandle(forWritingAtPath: logPath)!
    log.seekToEndOfFile()
    p.standardError = log; p.standardOutput = log
    try! p.run()
    current = p
    spin(3.0)
    if !front { userFront?.activate(); spin(0.6) }
    return p.processIdentifier
}

func expect(_ label: String, _ pid: pid_t, _ want: String) {
    let got = mode(pid)
    let wantFull = "\(want)/\(expectedTaps[want]!)"
    let ok = got == wantFull
    if !ok { failures += 1 }
    print("\(ok ? "PASS" : "FAIL")  \(label): want \(wantFull), got \(got)")
}

struct Scenario { let name: String; let front: Bool; let steps: [(String, Int, CGEventFlags, String)] }
let K = kVK_ANSI_K, T = kVK_ANSI_T, B = kVK_ANSI_B
let scenarios: [Scenario] = [
    Scenario(name: "bg-trackpad", front: false, steps: [
        ("⇧⌘T from another app", T, cmdShift, "trackpad"),
        ("⇧⌘T again", T, cmdShift, "trackpad"),
        ("⇧⌘K while trackpad locked", K, cmdShift, "trackpad"),
        ("⇧⌘B while trackpad locked", B, cmdShift, "trackpad")]),
    Scenario(name: "bg-keyboard", front: false, steps: [
        ("⇧⌘K from another app", K, cmdShift, "keyboard"),
        ("⇧⌘T while keyboard locked", T, cmdShift, "keyboard"),
        ("⇧⌘B while keyboard locked", B, cmdShift, "keyboard")]),
    Scenario(name: "bg-both", front: false, steps: [
        ("⇧⌘B from another app", B, cmdShift, "both"),
        ("⇧⌘K while both locked", K, cmdShift, "both")]),
    Scenario(name: "front-keyboard", front: true, steps: [
        ("⇧⌘K with app frontmost", K, cmdShift, "keyboard")]),
    Scenario(name: "front-trackpad", front: true, steps: [
        ("⇧⌘T with app frontmost", T, cmdShift, "trackpad")]),
    Scenario(name: "front-both", front: true, steps: [
        ("⇧⌘B with app frontmost", B, cmdShift, "both")]),
    Scenario(name: "wrong-modifiers", front: true, steps: [
        ("⌥⇧⌘K (extra modifier)", K, [.maskCommand, .maskShift, .maskAlternate], "none"),
        ("⌃⇧⌘T (extra modifier)", T, [.maskCommand, .maskShift, .maskControl], "none")]),
]

for s in scenarios where only == nil || only == s.name {
    print("— \(s.name)")
    let pid = launch(front: s.front)
    expect("idle after launch", pid, "none")
    for (label, code, flags, want) in s.steps {
        press(code, flags)
        expect(label, pid, want)
    }
    kill()
    spin(0.5)
}
CGWarpMouseCursorPosition(cursorHome)
userFront?.activate()
let log = (try? String(contentsOfFile: logPath, encoding: .utf8)) ?? ""
let regFailures = log.components(separatedBy: "\n").filter { $0.contains("Failed to register") }
print(regFailures.isEmpty ? "PASS  no hot key registration errors" : "FAIL  \(regFailures)")
if !regFailures.isEmpty { failures += 1 }
print(failures == 0 ? "ALL PASS" : "\(failures) FAILED")
exit(failures == 0 ? 0 : 1)
