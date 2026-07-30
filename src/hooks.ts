import { skipToken, useQuery } from '@tanstack/react-query';
import { getConfig } from '@edx/frontend-platform';
import type { PermissionValidationQuery, PermissionValidationAnswer } from './types';
import { validatePermissions } from './api';

export const permissionsQueryKeys = {
  all: ['authz'] as const,
  validate: (query: PermissionValidationQuery, apiBaseUrl: string = getConfig().LMS_BASE_URL) => [...permissionsQueryKeys.all, 'validatePermissions', apiBaseUrl, query] as const,
};

export interface UsePermissionsOptions {
  /** Default false — authz returns definitive answers; retrying 403s wastes requests. */
  retry?: boolean | number,
  /**
   * Base URL of the backend running openedx-authz.
   * Defaults to getConfig().LMS_BASE_URL when omitted.
   */
  apiBaseUrl?: string,
  /**
   * How long (in ms) the cached result is considered fresh before TanStack Query refetches.
   * Defaults to 5 minutes.
   */
  staleTime?: number,
}

export type UsePermissionsResult<Query extends PermissionValidationQuery> = {
  isLoading: boolean,
  isError: boolean,
  isAuthzEnabled: boolean,
} & Record<keyof Query, boolean | undefined>;

/**
 * Queries the openedx-authz service for the given permissions.
 *
 * When `featureEnabled` is false: no API call is made; all permission keys return true,
 * preserving pre-authz behavior during gradual rollout.
 * When `featureEnabled` is true: posts to the authz API and maps each key in the query
 * to the allowed boolean from the server response. Keys absent from the response default
 * to false. Keys are undefined while the request is in flight (check isLoading first).
 *
 * For the full list of available actions and scopes supported by openedx-authz, see:
 * https://docs.openedx.org/projects/openedx-authz/en/latest/concepts/core_roles_and_permissions/index.html
 *
 * @param query          - Key/value map of permission check descriptors.
 * @param featureEnabled - Pass the result of your waffle flag check here.
 * @param options        - Optional retry, apiBaseUrl, and staleTime settings.
 */
export const usePermissions = <Query extends PermissionValidationQuery>(
  query: Query,
  featureEnabled: boolean,
  options: UsePermissionsOptions = {},
): UsePermissionsResult<Query> => {
  const {
    retry = false,
    apiBaseUrl = getConfig().LMS_BASE_URL,
    staleTime = 5 * 60 * 1000,
  } = options;

  const { isLoading, isError, data } = useQuery<PermissionValidationAnswer<Query>, Error>({
    queryKey: permissionsQueryKeys.validate(query, apiBaseUrl),
    queryFn: featureEnabled ? () => validatePermissions(apiBaseUrl, query) : skipToken,
    retry,
    staleTime,
  });

  const permissionResults = isLoading
    ? ({} as PermissionValidationAnswer<Query>)
    : (Object.keys(query) as (keyof Query)[]).reduce(
      (acc, key) => {
        acc[key] = featureEnabled ? (data?.[key] ?? false) : true;
        return acc;
      },
      {} as PermissionValidationAnswer<Query>,
    );

  return {
    isLoading: featureEnabled ? isLoading : false,
    isError: featureEnabled ? isError : false,
    isAuthzEnabled: featureEnabled,
    ...permissionResults,
  } as UsePermissionsResult<Query>;
};
