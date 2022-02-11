export interface SecretType {
  id: string
  username: string
  updated_at: string
  secret_name: string
  created_by: string
  messages: number
}

export interface MessageType {
  id: number
  content: string
  inserted_at: string
  secret_id: string
}
