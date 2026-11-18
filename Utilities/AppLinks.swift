import Foundation

/// Outbound destinations for the More menu.
///
/// Fill one in to enable its menu item. Anything left `nil` still appears in
/// the menu but stays disabled, so the app never ships a link that goes
/// nowhere.
enum AppLinks {
    /// Product page. Also what "Share App" hands to the share sheet.
    static let website = URL(string: "https://www.mishorastudio.com/apps/chaotic-fingers")

    /// Frequently asked questions.
    static let faq = URL(string: "https://www.mishorastudio.com/apps/chaotic-fingers#faq")

    /// Support contact — a web form, or `mailto:you@example.com`.
    static let support = URL(string: "https://www.mishorastudio.com/contact")

    /// Where people leave a rating. Not on the App Store, so the product page.
    static let rateApp = URL(string: "https://www.mishorastudio.com/apps/chaotic-fingers")

    /// Your other apps — a developer page or App Store profile.
    static let moreApps = URL(string: "https://www.mishorastudio.com/apps")
}
