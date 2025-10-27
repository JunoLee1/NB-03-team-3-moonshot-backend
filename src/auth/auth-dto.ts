export enum ProviderType {
  LOCAL = "local",
  GOOGLE = "google",
}

export interface AuthUserDTO {
  id?: number;
  email: string;
  password?: string | null;
  nickname?: string | null;
  profile_image?: string | null;
  provider?: ProviderType | null;
  provider_id?: string | null;
}
