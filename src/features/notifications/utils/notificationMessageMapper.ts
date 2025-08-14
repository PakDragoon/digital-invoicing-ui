// src/features/notifications/utils/notificationMessageMapper.ts

import { NotificationType } from "../constants/notificationTypes"

interface NotificationContent {
  title: string
  description: string
}

export function getNotificationContent(
  type: NotificationType,
  message: string
): NotificationContent {
  switch (type) {
    case NotificationType.CUSTOMER_VISIT:
      return { title: "New Customer Visit", description: message }
    case NotificationType.SALESPERSON_AVAILABLE:
      return { title: "Salesperson Available", description: message }
    case NotificationType.DEAL_ASSIGN:
      return { title: "New Deal Assigned", description: message }
    case NotificationType.ACCEPT_DEAL:
      return { title: "Deal Accepted", description: message }
    case NotificationType.DECLINE_DEAL:
      return { title: "Deal Declined", description: message }
    case NotificationType.PRIORITY_DEAL_ASSIGN:
      return { title: "Priority Deal Assigned", description: message }
    case NotificationType.PRIORITY_DEAL_DECLINE:
      return { title: "Priority Deal Declined", description: message }
    case NotificationType.PRIORITY_DEAL_ACCEPT:
      return { title: "Priority Deal Accepted", description: message }
    case NotificationType.MAKE_READY_UPDATE:
      return { title: "Make Ready Updated", description: message }
    case NotificationType.MAKE_READY_HOLD:
      return { title: "Make Ready Hold", description: message }
    case NotificationType.MAKE_READY_COMMENT:
      return { title: "New Comment on Make Ready", description: message }
    case NotificationType.MAKE_READY_COMPLETE:
      return { title: "Make Ready Completed", description: message }
    case NotificationType.DEAL_DOCUMENT_ADDED:
      return { title: "Deal Document Added", description: message }
    case NotificationType.DEAL_DOCUMENT_RECEIVED:
      return { title: "Deal Document Received", description: message }
    case NotificationType.DEAL_DOCUMENT_DELETED:
      return { title: "Deal Document Deleted", description: message }
    case NotificationType.SALESPERSON_UPDATE:
      return { title: "Salesperson Updated", description: message }
    case NotificationType.NEW_MAKE_READY:
      return { title: "New Make Ready Created", description: message }
    case NotificationType.CUSTOMER_SIGNED_DEAL:
      return { title: "Customer Signed Deal", description: message }
    case NotificationType.DEAL_COMMENT:
      return { title: "New Deal Comment", description: message }
    case NotificationType.RETURNED_TO_FINANCE:
      return { title: "Deal Returned to Finance", description: message }
    case NotificationType.DEAL_COMPLETED:
      return { title: "Deal Completed", description: message }
    case NotificationType.ACCOUNTING_COMPLETED:
      return { title: "Accounting Completed", description: message }
    default:
      return { title: "Notification", description: message }
  }
}
