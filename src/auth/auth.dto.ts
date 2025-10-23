export enum ProviderType {
  LOCAL = "local",
  GOOGLE = "google",
}

export interface AuthUserDTO {
  id?: number;
  email: string;
  password: string | null;
  nickname?: string | null;
  profileImage?: string | null;
  provider?: ProviderType | null;
  providerId?: string | null;
}
