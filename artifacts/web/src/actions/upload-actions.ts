import { runAction } from "@workspace/api-client-react"
import {
  postUploadsAppLogo,
  postUploadsAppIcon,
  postUploadsAvatar,
  postUploadsUserManual,
} from "@workspace/api-client-react/generated/uploads/uploads"
import type { RawApiResponse } from "@workspace/api-client-react"
import type { FileUploadInput } from "@workspace/api-client-react/generated/index.schemas"
import type { ActionResult } from "@/types/action-result"

type UploadFn = (input: FileUploadInput) => Promise<RawApiResponse>

async function uploadTo(
  call: UploadFn,
  formData: FormData,
  fallback: string
): Promise<ActionResult & { path?: string }> {
  const file = formData.get("file")
  if (!(file instanceof Blob)) {
    return { success: false, error: "No file provided" }
  }
  const result = await runAction<{ path: string }>(
    () => call({ file }),
    fallback
  )
  if (result.success) {
    return { success: true, path: result.data?.path }
  }
  return result
}

export async function uploadAppLogoAction(
  formData: FormData
): Promise<ActionResult & { path?: string }> {
  return uploadTo(postUploadsAppLogo, formData, "Failed to upload logo")
}

export async function uploadAppIconAction(
  formData: FormData
): Promise<ActionResult & { path?: string }> {
  return uploadTo(postUploadsAppIcon, formData, "Failed to upload icon")
}

export async function uploadAvatarFileAction(
  formData: FormData
): Promise<ActionResult & { path?: string }> {
  return uploadTo(postUploadsAvatar, formData, "Failed to upload avatar")
}

export async function uploadUserManualAction(
  formData: FormData
): Promise<ActionResult & { path?: string }> {
  return uploadTo(
    postUploadsUserManual,
    formData,
    "Failed to upload user manual"
  )
}
