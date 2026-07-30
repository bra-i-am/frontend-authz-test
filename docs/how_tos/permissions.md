# How to: Query Permissions from openedx-authz

## Overview

`@openedx/frontend-authz` provides hooks and utilities to validate user permissions against the
`openedx-authz` service. Results are cached automatically via TanStack Query to minimize calls
to the backend.

## Available permissions

The full list of actions and scopes supported by the `openedx-authz` service is documented here:
https://docs.openedx.org/projects/openedx-authz/en/latest/concepts/core_roles_and_permissions/index.html

Use those action strings in your `PermissionValidationQuery` values.

## Prerequisites

Ensure your app root is wrapped with a `QueryClientProvider` from `@tanstack/react-query`.

---

## Core Concepts

### Permission query shape

Permissions are expressed as a key/value map where:
- **keys** are arbitrary semantic names you choose (e.g. `canEditGrading`)
- **values** describe the `action` string and optional `scope` (resource identifier)

```typescript
import type { PermissionValidationQuery } from '@openedx/frontend-authz';

const query: PermissionValidationQuery = {
  canViewGrading: {
    action: 'courses.view_grading_settings',
    scope: 'course-v1:org+course+run',
  },
  canEditGrading: {
    action: 'courses.edit_grading_settings',
    scope: 'course-v1:org+course+run',
  },
};
```

### Caching

Results are cached using TanStack Query. The cache key includes the query object and the
resolved `apiBaseUrl`, so different backends and different permission sets are cached
independently. Results are reused across components that request the same permissions within
one session.

---

## `usePermissions`

The single hook for querying permissions. Requires a `featureEnabled` boolean — always
pass the resolved waffle flag value so the caller explicitly opts in or out of authz.
Permission keys are spread at the top level — no nested `.permissions` object.

```typescript
import { usePermissions } from '@openedx/frontend-authz';
import { getConfig } from '@edx/frontend-platform';

// featureEnabled is required — always pass the resolved waffle flag boolean:
const { enableAuthz } = useWaffleFlags(resourceId);
const { isLoading, isError, isAuthzEnabled, canViewGrading, canEditGrading } = usePermissions(
  {
    canViewGrading: { action: 'courses.view_grading_settings', scope: resourceId },
    canEditGrading: { action: 'courses.edit_grading_settings', scope: resourceId },
  },
  enableAuthz ?? false,
  { apiBaseUrl: getConfig().LMS_BASE_URL },
);

if (isLoading) { return <LoadingSpinner />; }
if (isError) { return <ErrorAlert />; }
if (!canViewGrading) { return <PermissionDeniedAlert />; }
```

When `featureEnabled` is `false`: no API call is made and all keys return `true`,
preserving the pre-authz behavior during rollout.

> **Service unavailability:** if the authz API call fails, `isError` is `true` and all
> permission keys resolve to `false`. Always check `isLoading` and `isError` before
> rendering gated UI to avoid incorrectly denying access during transient failures.

---

## Recommended: create an MFE-specific wrapper

Avoid calling `usePermissions` directly in every component. Create a single MFE-level
wrapper that encapsulates the waffle flag check and base URL:

```typescript
import { usePermissions } from '@openedx/frontend-authz';
import { getConfig } from '@edx/frontend-platform';
import { useWaffleFlags } from './waffleHooks'; // your MFE's waffle flag hook
import type { PermissionValidationQuery } from '@openedx/frontend-authz';

export const useResourcePermissions = <Query extends PermissionValidationQuery>(
  resourceId: string,
  permissions: Query,
) => {
  const { enableAuthz } = useWaffleFlags(resourceId);
  return usePermissions(
    permissions,
    enableAuthz ?? false,
    { apiBaseUrl: getConfig().LMS_BASE_URL },
  );
};

export const getResourcePermissions = (resourceId: string): PermissionValidationQuery => ({
  canView: { action: 'resources.view', scope: resourceId },
  canEdit: { action: 'resources.edit', scope: resourceId },
});

// Usage in any component:
const { isLoading, canView, canEdit } =
  useResourcePermissions(resourceId, getResourcePermissions(resourceId));
```

---

## Best Practices

- **Define permission constants** in your MFE (`COURSE_PERMISSIONS`, etc.) rather than
  inline strings — prevents typos and makes global renames easy.
- **Use query builder helpers** (`getGradingPermissions(courseId)`) to build the query
  object — keeps permission definitions co-located with the feature they belong to.
- **Do not duplicate `{ action, scope }` pairs** within a single query — only the first
  matching key is mapped in the response.
- **Keep `featureEnabled` close to the flag source** — the boolean should come directly
  from your waffle flag check, not be stored in state or passed through many layers.

---

## Manual Cache Invalidation

If user roles change mid-session and you need to force a refetch:

```typescript
import { permissionsQueryKeys } from '@openedx/frontend-authz';
import { getConfig } from '@edx/frontend-platform';

queryClient.invalidateQueries({
  queryKey: permissionsQueryKeys.validate(myQuery, getConfig().LMS_BASE_URL),
});
```
