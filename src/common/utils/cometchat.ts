// src/common/utils/cometchat.ts
import { CometChatUIKit, UIKitSettingsBuilder } from "@cometchat/chat-uikit-react"

export async function initCometChat(appId: string, region = "us", authKey?: string) {
  if (CometChatUIKit.isInitialized?.()) return // skip double-init
  const settings = new UIKitSettingsBuilder()
    .setAppId(appId)
    .setRegion(region)
    .setAuthKey(authKey ?? "")
    .subscribePresenceForAllUsers()
    .build()
  await CometChatUIKit.init(settings)
}

export async function loginCometChat(uid: string, authKey: string) {
  /* typings in 6.0.x say `login(uid: string): Promise<User>` but the real
     method is  `login(uid: string, secret: string)` – cast to <any> to appease TS. */
  return (CometChatUIKit as any).login(uid, authKey)
}
