export type ElicitationOption = {
  id: string
  label: string
  /** Defaults to the option's 1-based position in the list. Pass 'edit' for a pencil icon badge. */
  badge?: number | 'edit'
  /** When true, clicking the option reveals an inline text field instead of firing immediately. */
  requiresText?: boolean
  textPlaceholder?: string
}

export type ElicitationSelection =
  | { type: 'option'; option: ElicitationOption }
  | { type: 'text'; option: ElicitationOption; text: string }

export type ConversationMessage = {
  id: string
  role: 'assistant' | 'user'
  content: string
}

export type ProductItem = {
  id: string
  brand: string
  name: string
  description: string
}
