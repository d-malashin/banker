# Mobile home-screen cashback widget

Checked 2026-11-02 against primary platform documentation.

## Decision

Skip the widget, as requested when native development is required. Banker remains a website/PWA that can be opened from its home-screen app icon. No widget implementation or native project was added.

## Findings

| Platform | Can Banker’s pure website/PWA create the requested home-screen widget? | Native scrolling support |
| --- | --- | --- |
| iOS / iPadOS | No supported web route identified. Apple’s widget route requires a WidgetKit extension target in an app project. | Apple says widgets do not generally support scrolling lists; supported interaction includes buttons and toggles. A fixed list of the best rates could fit, but would still require native work. |
| Android | No supported web route identified. App widgets require Android app components and manifest registration, using AppWidgetProvider or Glance. | Native collection widgets support vertical scrolling. Glance provides LazyColumn, translated into ListView. |

The web-only conclusion is an inference from the documented native widget requirements and the web manifest’s supported installation/launch features; neither platform provides the required mobile widget registration through those web features. A home-screen launch icon is a supported PWA feature, separate from an embedded, live home-screen list. Sorting cashback data by descending rate is straightforward application behavior; it does not remove the platform requirement for native widgets.

## Primary evidence

- [Apple: Creating a widget extension](https://developer.apple.com/documentation/widgetkit/creating-a-widget-extension) instructs developers to add a Widget Extension target to an existing app in Xcode and states the scrolling-list limitation. [Machine-readable version](https://developer.apple.com/documentation/widgetkit/creating-a-widget-extension.md), also checked.
- [Apple WWDC26: WidgetKit foundations](https://developer.apple.com/videos/play/wwdc2026/277/) confirms the current WidgetKit/SwiftUI model for iOS 27 and the supported button/toggle interactions through App Intents; widget views are archived and rendered by the system.
- [Android: Create a basic widget](https://developer.android.com/develop/ui/views/appwidgets) specifies AppWidgetProviderInfo, provider/receiver, Android manifest declaration and layout resources.
- [Android: Use collection widgets](https://developer.android.com/develop/ui/views/appwidgets/collections) documents vertically scrollable ListView/GridView collections.
- [Android: Build UI with Glance](https://developer.android.com/develop/ui/compose/glance/build-ui#use-scrollable-layouts) documents LazyColumn for a scrollable app-widget container and its ListView translation.
- [W3C: Web Application Manifest](https://www.w3.org/TR/appmanifest/) defines install/launch metadata, icons and shortcuts; it does not define the required iOS/Android widget provider integration.
- [WebKit: Safari 26 home-screen web apps](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/) documents the Open as Web App installation behavior, which launches a website as an app rather than embedding its list in the home screen.
