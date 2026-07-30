import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import type {
  PermissionValidationQuery,
  PermissionValidationAnswer,
  PermissionValidationRequestItem,
  PermissionValidationResponseItem,
} from './types';

export const PERMISSIONS_VALIDATE_PATH = '/api/authz/v1/permissions/validate/me';

export const validatePermissions = async <Query extends PermissionValidationQuery>(
  apiBaseUrl: string,
  query: Query,
): Promise<PermissionValidationAnswer<Query>> => {
  const request: PermissionValidationRequestItem[] = Object.values(query);

  const response = await getAuthenticatedHttpClient().post(
    `${apiBaseUrl}${PERMISSIONS_VALIDATE_PATH}`,
    request,
  );
  const data = response.data as PermissionValidationResponseItem[];

  const result = {} as PermissionValidationAnswer<Query>;

  for (const [key, reqItem] of Object.entries(query) as [keyof Query, PermissionValidationRequestItem][]) {
    const match = data.find(
      (item) => item.action === reqItem.action && item.scope === reqItem.scope,
    );
    result[key] = match ? match.allowed : false;
  }
  return result;
};
