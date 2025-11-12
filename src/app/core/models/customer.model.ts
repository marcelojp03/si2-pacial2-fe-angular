// ========================================
// CUSTOMER PROFILE MODELS
// ========================================

export interface CustomerProfile {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    date_joined: string;
    last_login?: string;
    avatar?: string;
    avatar_s3_key?: string | null;
    avatar_s3_bucket?: string | null;
  };
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  avatar?: string;
  avatar_s3_key?: string | null;
  avatar_s3_bucket?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface UploadAvatarRequest {
  image: string; // Base64 string (can include data:image/type;base64, prefix)
  extension?: string; // jpg, png, webp, gif
}

export interface UploadAvatarResponse {
  message: string;
  avatar_url: string;
  avatar_s3_bucket: string;
  avatar_s3_key: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    avatar: string;
    avatar_s3_key: string;
    avatar_s3_bucket: string;
    is_staff: boolean;
    is_superuser: boolean;
  };
}
